# Throttle session refreshes

## Benefits

- **Less PostgreSQL write traffic.** Requests within the refresh window only read the session. When renewal is due, concurrent requests produce one successful update, reducing repeated writes to the same row and its expiry index.
- **Fewer response headers.** `Set-Cookie` dropped from 420 of 420 authenticated responses to zero of 420 within the refresh window in the local benchmark. Six of seven authenticated endpoints also had lower p95 latency in that run.
- **Rolling expiry and prompt revocation.** Active sessions still renew, and each request checks PostgreSQL so expired or revoked sessions are rejected on the next request. The existing timestamps support the change without a schema migration.

## Behavior before the change

[`requireAuth`](../../backend/src/shared/middlewares/requireAuth.js) previously read the session from PostgreSQL, extended its expiry, and sent `Set-Cookie` on every authenticated request. A page that loaded several resources repeated the update on the same row. Each update created a new row version and changed the indexed expiry, adding database work even for read-only requests. Requests from the same session could also queue behind each other on that row. The configured default session lifetime is 14 days.

## Implementation

1. Keep the indexed lookup by hashed token in [`session.js`](../../backend/src/shared/auth/session.js). Treat missing and expired sessions as unauthorized. Keep the existing logout and logout-everywhere deletion paths so subsequent requests see revocation on their next lookup.
2. Use the stored `updatedAt` as the last refresh time. In [`config`](../../backend/src/shared/config/index.js), start with a 10-minute refresh interval and clamp the effective interval to at most half the configured session TTL so short-lived sessions still have a chance to renew. Reuse the existing creation and refresh timestamps so existing sessions work without a schema migration. Confirm the code paths that update the session row before relying on `updatedAt` for this purpose.
3. Skip the write when the loaded session is fresh. When a refresh is due, perform one conditional update by session ID with `updatedAt` at or before the cutoff and `expiresAt` later than the current time. Use `updateMany` or another operation that reports the affected row count. With parallel requests, the first eligible update moves the timestamp forward and the others affect zero rows. This also prevents an expired or deleted session from being refreshed using an old lookup result.
4. Set the refreshed cookie only when the write succeeds, using the new persisted expiry to determine its remaining lifetime. Keep the existing cookie flags and login and logout behavior. If an attempted refresh affects zero rows, re-read the session to distinguish a concurrent refresh from expiration or revocation. Continue without reissuing the cookie for a still-valid session. Return the usual unauthorized response for a revoked or expired session. Propagate actual database errors through the existing error handler.
5. Leave the rolling expiry behavior in place. Document that the recorded last activity can lag real activity by up to the refresh interval. Keep raw tokens and cookie values out of logs and metrics.

## Verification

Use the [measured backend baseline](backend-performance-baseline.md) to compare authenticated response latency and `Set-Cookie` frequency.

- A new session authorizes requests without a write or `Set-Cookie` during the refresh window. The first eligible request after the window renews both the database expiry and the cookie.
- Concurrent eligible requests on the same session produce one successful refresh and one renewed cookie. An expired session stays expired, and logout and logout everywhere still reject subsequent requests.
- A short configured TTL works with the clamped interval. A database failure follows the normal error path.
- Compare the number of successful session refreshes per authenticated request and p95 authenticated request latency on the same workload before and after the change.

## Verification results

Integration checks against PostgreSQL with a six-second session lifetime confirmed that a fresh request left the stored timestamps unchanged and 12 concurrent requests on a due session produced one renewed cookie. The test also checked persisted expiry, expired-session cleanup, logout, logout everywhere, revocation during renewal, and the error response when the refresh query fails.

The localhost rerun used the same development dataset, five warm-up requests, and 60 measured requests per endpoint. The seven authenticated endpoints went from 420 of 420 responses with `Set-Cookie` to zero of 420 within a fresh session's refresh window. Response body sizes were unchanged.

| Endpoint | Before p95 | After p95 |
| --- | ---: | ---: |
| Health | 1.24 ms | 1.78 ms |
| Encyclopedia topics | 3.44 ms | 2.93 ms |
| Encyclopedia categories | 4.20 ms | 3.27 ms |
| Space notes | 4.08 ms | 4.21 ms |
| Space stats | 4.27 ms | 3.14 ms |
| Space encyclopedia stats | 3.53 ms | 2.70 ms |
| Space recent encyclopedia entries | 4.45 ms | 3.43 ms |
| Space encyclopedia topic entries | 4.94 ms | 3.60 ms |

Six of seven authenticated endpoints had lower p95 in this run. These are sequential localhost timings on a small dataset.

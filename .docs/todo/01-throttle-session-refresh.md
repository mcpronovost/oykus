# Throttle session refreshes

## Current behavior and cost

[`requireAuth`](../../backend/src/shared/middlewares/requireAuth.js) reads the session from PostgreSQL, extends its expiry, and sends `Set-Cookie` on every authenticated request. A page that loads several resources repeats the update on the same row. Each update creates a new row version and changes the indexed expiry, which adds database work even for read-only requests. Requests from the same session can also queue behind each other on that row. The configured default session lifetime is 14 days, so extending it on every request buys little additional idle time for an active user.

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

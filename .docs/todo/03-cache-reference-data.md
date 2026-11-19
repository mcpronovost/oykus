# Cache reference data where it is reused

## Current behavior and cost

The frontend uses TanStack Query with a [30-second default freshness window](../../frontend/src/components/Providers.tsx). Encyclopedia topics and categories are populated by the [seed script](../../backend/prisma/seed.js), while note categories can be edited through the [API](../../backend/src/features/notes/notes.routes.js). These small lookup lists can often stay fresh longer than notes or entries. Reusing them in the browser avoids the entire HTTP request, including the session lookup. A server-side cache would save only the lookup query.

## Implementation

1. Start with a 15-minute `staleTime` for encyclopedia topics and categories. Apply the options consistently wherever each query key is used, including the topic page and edit modal. Keep category keys scoped to their topic slug. If the aim is to reuse the values after navigating away for several minutes, set a per-query `gcTime` at least as long as the freshness window so inactive entries survive that period.
2. Extend note category freshness only if it fits how often people edit categories. Invalidate the category query after successful create, update, or delete actions. Invalidate or update affected notes queries where their cached responses embed the old category label or association. Local invalidation reaches that browser's query client. Choose a freshness window that also accounts for changes made by other users, tabs, or API clients.
3. Keep auth and space-content query freshness independent of reference data. Preserve the [logout query cleanup](../../frontend/src/services/auth/index.tsx) and the service worker's [`NetworkOnly` rule for API requests](../../frontend/vite.config.ts). Keep cookie-authenticated API responses out of shared Nginx caching. Nginx already compresses JSON and serves immutable static assets and uploads with long-lived caching. [Production Nginx config](../../nginx/nginx.prod.conf)
4. Measure request volume after the browser change. If metadata still causes significant database traffic on a single API replica, cache only successful reference-data results at the service layer, after request authentication. Start with a short TTL and a fixed maximum number of entries. Use canonical keys, reuse a single in-flight fetch per key, and remove failed in-flight fetches so callers can retry. Invalidate mutable categories after a committed write and account for an older in-flight fetch that could repopulate the cache afterward. Seed-driven changes become visible on expiry or process restart. Consider shared cache infrastructure only if measurements show a need for cross-replica reuse or invalidation.

## Verification

The [measured backend baseline](backend-performance-baseline.md) includes uncached HTTP requests for encyclopedia topics and categories.

- Navigate between topic and edit screens within the freshness window and verify that the browser reuses the same category query. Verify a refetch when stale data is next used and verify independent results for different topic slugs.
- Create, rename, and delete a note category. Check the editing client's category menus and embedded labels, then verify that another client sees the change within the intended freshness window when it refetches.
- Verify logout clears private query data and signed-out callers still receive the expected unauthorized response. Inspect the Nginx and service-worker behavior for API requests.
- Compare reference-data HTTP requests and corresponding database calls before and after. If a server cache is added, record hit rate, entry count, and invalidation behavior under concurrent requests.

[TanStack Query defaults](https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults)

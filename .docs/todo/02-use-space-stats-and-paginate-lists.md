# Use space stats in the delete dialog and paginate lists

## Benefits

- The delete dialog gets both counts from one request, and confirmation stays disabled until the counts are available.
- The notes and encyclopedia screens request up to 25 records on the first page. In a local test with 150 records per list, this reduced first-response body size by about 83% for both screens.
- Encyclopedia filters and section totals use counts across the whole topic, including entries on pages that have yet to load.

## Behaviour before the change

The [space deletion dialog](../../frontend/src/pages/Settings/modals/SpaceDelete.tsx) fetched all notes and encyclopedia stats to build its confirmation counts. It used the notes only for `notes.length`, while the payload contained every note body. [`GET /api/v1/spaces/:id/stats`](../../backend/src/core/spaces/spaces.routes.js) already returned both the note count and per-topic encyclopedia counts.

The [notes list](../../backend/src/features/notes/notes.services.js) and [encyclopedia topic list](../../backend/src/features/encyclopedia/encyclopedia.services.js) used unbounded `findMany` calls. As spaces grew, each full-list request retrieved, serialized, and transferred more data. The encyclopedia list already excluded section bodies, and its recent feed already capped results at 12.

## Implementation

### Use counts in the delete dialog

1. Replace the dialog's two queries with the existing `getSpaceStats` API helper and `queryKeys.spaces.stats(space.id)`. Read `stats.notes` and `stats.encyclopedia`. If the dialog needs a topic label or icon, resolve it by slug using the existing topic metadata or UI mapping.
2. Preserve loading and error states, including the confirmation controls. A failed or pending request must not appear as a successful count of zero. Keep invalidating the space stats query after changes that affect the counts.

### Bound the notes and encyclopedia lists

1. Start with 25 notes or entries per page and cap the accepted `limit` at 50. Validate `limit` and the cursor using the existing request validation path. Keep authorization scoped to the space on every page.
2. Use keyset pagination with a deterministic tie-breaker. Notes sort by `updatedAt DESC, id DESC`. The next page applies `updatedAt < cursor.updatedAt` or the same timestamp with `id < cursor.id`. Encyclopedia entries sort by `title ASC, id ASC` within the space and topic. Carry the last sort values in an opaque, validated cursor so a deleted boundary row still permits fetching the next page. Keep the same collation and sort direction across page boundaries.
3. Fetch `limit + 1` rows, return up to `limit`, and set `nextCursor` from the last returned row when an extra row exists. Use `{ items, nextCursor }` for every list request, with or without pagination parameters.
4. Update the [API client](../../frontend/src/services/api/index.ts), query keys, and list screens together. Use an infinite query or explicit page controls, with keys that include the space, topic, and active filters. Invalidate or restart pages after mutations that can change order or membership. Edits that move an item across a cursor can temporarily affect what is seen across requests, so refresh the list after local edits.
5. The encyclopedia topic screen currently derives populated categories and their totals from the full entry list. Move active filters into the request and include an explicit uncategorized filter. Fetch category totals separately if the UI still displays them. Keep true totals independent of how many pages the browser has loaded, including in the all-categories view.
6. Start by bounding the existing notes payload so current cards can render. If measurements show bodies still dominate and the UI supports a preview, add a preview-only list shape and fetch the full note from the existing detail route when opened. Evaluate indexes using the [query index task](04-match-indexes-to-list-queries.md).

## Verification

Use the [measured backend baseline](backend-performance-baseline.md) to compare response bytes and latency.

- The delete dialog gets both counts through one stats query and makes no new notes-list request. Counts and error states remain correct for empty and populated spaces.
- Test the first and last pages, invalid cursors, limits above the cap, deleted boundary rows, and rows with identical timestamps or titles. Check complete coverage and duplicate-free results on unchanged data.
- Verify category filtering, uncategorized entries, visible totals, mutations, and access denial for unauthorized users on later pages.
- Compare initial list response bytes and p95 latency on representative small and large spaces. The first page should stay within the configured row limit as the space grows.

## Implementation and verification results

Both list routes return `{ data: { items, nextCursor } }` by default. The first page needs no query parameters. Use `cursor` for subsequent pages and `limit` to override the page size. Encyclopedia requests can use either `category=<slug>` or `uncategorized=true`. The space-scoped `GET /api/v1/spaces/:id/encyclopedia/:topic/counts` route returns counts by category ID and uses `null` for uncategorized entries. Mutations invalidate the topic's query prefix to refresh filtered pages and counts.

PostgreSQL integration checks covered empty lists, default and maximum page sizes, invalid query parameters and cursors, exact coverage with tied sort values, deleted page boundaries, access checks on later pages, and category filters and counts. The local comparison used the same temporary fixtures for full-list and paged responses, with five warm-ups and 60 sequential HTTP measurements per variant directly against the backend.

Headless browser checks with mock API responses verified that **Load more** appends records, category filters request the correct pages and show totals, and the delete dialog recovers from a failed stats request without fetching the note list or encyclopedia stats.

| Records | List | Full-list body | First page body | Full-list p95 | First page p95 |
| ---: | --- | ---: | ---: | ---: | ---: |
| 4 | Notes | 3,118 B | 3,146 B | 2.81 ms | 3.72 ms |
| 4 | Encyclopedia | 3,256 B | 3,284 B | 3.13 ms | 3.33 ms |
| 150 | Notes | 116,750 B | 19,601 B | 5.47 ms | 2.83 ms |
| 150 | Encyclopedia | 121,925 B | 19,925 B | 7.04 ms | 3.76 ms |

[TanStack Query infinite queries](https://tanstack.com/query/latest/docs/framework/react/reference/functions/useInfiniteQuery)

# Use space stats in the delete dialog and paginate lists

## Current behavior and cost

The [space deletion dialog](../../frontend/src/pages/Settings/modals/SpaceDelete.tsx) fetches all notes and encyclopedia stats to build its confirmation counts. It uses the notes only for `notes.length`, while the notes payload contains the entire body of every note. [`GET /api/v1/spaces/:id/stats`](../../backend/src/core/spaces/spaces.routes.js) already returns both the note count and per-topic encyclopedia counts.

The [notes list](../../backend/src/features/notes/notes.services.js) and [encyclopedia topic list](../../backend/src/features/encyclopedia/encyclopedia.services.js) both use unbounded `findMany` calls. As spaces grow, the API retrieves, serializes, and transfers more data on every full-list request. The encyclopedia list already excludes section bodies, and its recent feed already caps results at 12.

## Implementation

### Use counts in the delete dialog

1. Replace the dialog's two queries with the existing `getSpaceStats` API helper and `queryKeys.spaces.stats(space.id)`. Read `stats.notes` and `stats.encyclopedia`. If the dialog needs a topic label or icon, resolve it by slug using the existing topic metadata or UI mapping.
2. Preserve loading and error states, including the confirmation controls. A failed or pending request must not appear as a successful count of zero. Keep invalidating the space stats query after changes that affect the counts.

### Bound the notes and encyclopedia lists

1. Start with 25 notes or entries per page and cap the accepted `limit` at 50. Validate `limit` and the cursor using the existing request validation path. Keep authorization scoped to the space on every page.
2. Use keyset pagination with a deterministic tie-breaker. Notes sort by `updatedAt DESC, id DESC`. The next page applies `updatedAt < cursor.updatedAt` or the same timestamp with `id < cursor.id`. Encyclopedia entries sort by `title ASC, id ASC` within the space and topic. Carry the last sort values in an opaque, validated cursor so a deleted boundary row still permits fetching the next page. Keep the same collation and sort direction across page boundaries.
3. Fetch `limit + 1` rows, return up to `limit`, and set `nextCursor` from the last returned row when an extra row exists. Use a consistent response such as `{ items, nextCursor }`. Inventory the callers before changing the current array response. If old and new clients can overlap during deployment, stage the paged contract using a separate route or an explicit request option and retire the legacy path after callers move.
4. Update the [API client](../../frontend/src/services/api/index.ts), query keys, and list screens together. Use an infinite query or explicit page controls, with keys that include the space, topic, and active filters. Invalidate or restart pages after mutations that can change order or membership. Edits that move an item across a cursor can temporarily affect what is seen across requests, so refresh the list after local edits.
5. The encyclopedia topic screen currently derives populated categories and their totals from the full entry list. Move active filters into the request and include an explicit uncategorized filter. Fetch category totals separately if the UI still displays them. Keep true totals independent of how many pages the browser has loaded, including in the all-categories view.
6. Start by bounding the existing notes payload so current cards can render. If measurements show bodies still dominate and the UI supports a preview, add a preview-only list shape and fetch the full note from the existing detail route when opened. Evaluate indexes using the [query index task](04-match-indexes-to-list-queries.md).

## Verification

Use the [measured backend baseline](backend-performance-baseline.md) to compare response bytes and latency.

- The delete dialog gets both counts through one stats query and makes no new notes-list request. Counts and error states remain correct for empty and populated spaces.
- Test the first and last pages, invalid cursors, limits above the cap, deleted boundary rows, and rows with identical timestamps or titles. Check complete coverage and duplicate-free results on unchanged data.
- Verify category filtering, uncategorized entries, visible totals, mutations, and access denial for unauthorized users on later pages.
- Compare initial list response bytes and p95 latency on representative small and large spaces. The first page should stay within the configured row limit as the space grows.

[TanStack Query infinite queries](https://tanstack.com/query/latest/docs/framework/react/reference/functions/useInfiniteQuery)

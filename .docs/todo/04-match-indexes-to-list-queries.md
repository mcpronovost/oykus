# Match PostgreSQL indexes to list queries

## Current behavior and cost

The [notes schema](../../backend/prisma/models/notes.prisma) indexes `spaceId`, and the query filters by space and orders by `updatedAt`. The [encyclopedia schema](../../backend/prisma/models/encyclopedia.prisma) has indexes for space and topic or category, while the recent-entries query orders by `updatedAt` and takes 12 rows. The existing indexes can help find matching rows. An index that also matches the sort can help PostgreSQL return a small page without sorting all matches first. Extra indexes consume disk and add work to inserts, deletes, and updates, so their value depends on data size and traffic.

## Implementation

1. Start with the notes query shape from [the pagination task](02-use-space-stats-and-paginate-lists.md). Capture the actual SQL Prisma sends for the first and later pages. Run `EXPLAIN (ANALYZE, BUFFERS)` for those reads on staging or a representative local copy. Include both small and large spaces and record rows scanned, sort work, buffers, and execution time.
2. Test a B-tree for `(spaceId, updatedAt DESC, id DESC)` as the first candidate. In Prisma, the corresponding model index is `@@index([spaceId, updatedAt(sort: Desc), id(sort: Desc)])`. Ensure the sort and cursor predicate match the index, then repeat the measurements with the same data and parameters. Compare the existing `spaceId` index usage across the rest of the app before deciding whether the narrower index can be dropped.
3. If recent encyclopedia reads are hot, evaluate the same column pattern there and add `id DESC` as a tie-breaker in the query. If paged topic browsing is hot, evaluate `(spaceId, topicId, title, id)` against the final query shape, including category filters. Let actual plans and call frequency determine which index to ship.
4. Add only measured improvements to the relevant Prisma model and create a migration. For large live tables, plan the index build around deployment traffic. If using `CREATE INDEX CONCURRENTLY`, keep it outside a transaction block, verify how the migration runner executes it in staging, and check for an invalid index after any failed build. Review index size and write performance before removing or superseding an index.

## Verification

The [measured backend baseline](backend-performance-baseline.md) records HTTP timings for a small development space. Use representative query plans to assess any index change.

- Compare query plans, sorts, buffers, and timings before and after on the same dataset. Verify faster reads for the spaces and page depths that matter.
- Confirm pagination order, filters, results, and access behavior with the new index. Check insert and update latency as well as index size.
- Apply the migration to a fresh database and an existing staging database. Confirm the index is valid and the application can use the resulting schema.

[PostgreSQL EXPLAIN](https://www.postgresql.org/docs/18/sql-explain.html) · [Indexes and ordering](https://www.postgresql.org/docs/18/indexes-ordering.html) · [Concurrent index builds](https://www.postgresql.org/docs/18/sql-createindex.html)

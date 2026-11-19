# Backend performance baseline

Measured November 18, 2026 on local Windows Docker Desktop. Runtime measurements use the development Compose stack and the existing development database. The production image size comes from a separate build of the production Compose backend target.

## Backend image size

| Image tag | Docker-reported size |
| --- | ---: |
| `oykus-backend:development` | 686 MB |
| `oykus-backend:production` | 1.13 GB |

The production image was built with `docker compose -f docker-compose.prod.yml build backend`. Its layer history reports **348 MB** for copying `node_modules` and **350 MB** for the later `mkdir` and recursive `chown` step. Both install stages installed 219 packages, including the production stage that passed `--omit=dev`. The ownership layer is the first image-size change to measure. See the [production image task](05-run-migrations-once-per-deploy.md).

## Container memory

`docker stats --no-stream` reported the following in a single idle snapshot before the HTTP benchmark. These values are container memory usage, including the development backend's Node watch mode, and do not establish peak or production memory usage.

| Development container | Memory |
| --- | ---: |
| Backend | 151.2 MiB |
| PostgreSQL | 42.14 MiB |
| Nginx | 15.91 MiB |

## Local API latency and response size

Measured after the image build finished. The sampled space had two notes and four encyclopedia entries. The sampled topic list returned two entries, and the reference category endpoint returned three categories. Each row represents 60 measured requests after warm-up, with one request in flight at a time.

| Endpoint | p50 | p95 | Body bytes | `Set-Cookie` responses |
| --- | ---: | ---: | ---: | ---: |
| Health | 1.05 ms | 1.24 ms | 11 | 0/60 |
| Encyclopedia topics | 2.75 ms | 3.44 ms | 502 | 60/60 |
| Encyclopedia categories | 3.03 ms | 4.20 ms | 126 | 60/60 |
| Space notes | 3.41 ms | 4.08 ms | 646 | 60/60 |
| Space stats | 3.38 ms | 4.27 ms | 239 | 60/60 |
| Space encyclopedia stats | 3.18 ms | 3.53 ms | 453 | 60/60 |
| Space recent encyclopedia entries | 3.62 ms | 4.45 ms | 2,502 | 60/60 |
| Space encyclopedia topic entries | 4.06 ms | 4.94 ms | 1,382 | 60/60 |

- All 420 measured authenticated responses sent `Set-Cookie`, consistent with the session refresh in the middleware. The benchmark counted response headers. Database write counts were not instrumented.
- On this space, the two requests used by the deletion dialog returned a combined 1,099 body bytes. The existing space stats response returned 239 bytes, about 78% fewer. The dialog's overall latency was not measured, and its current requests can run in parallel.
- These timings describe warm, sequential localhost reads over HTTP on a small dataset. Production latency, concurrent throughput, and production memory still need their own measurements.

## How to compare a follow-up

- Collect image sizes with `docker image ls --filter 'reference=oykus-backend:*' --format '{{.Repository}}:{{.Tag}} {{.Size}}'`. Compare the same production target and platform. The reported image size is Docker's local metric and does not represent the download size or unique disk usage.
- Repeat `docker stats --no-stream oykus-backend oykus-db oykus-nginx` after warm-up. For peak memory, record samples during a separately defined workload with the same dataset and concurrency.
- Send requests to the development Nginx endpoint at `http://127.0.0.1:8080`. Reuse one HTTP client and a development session, make five warm-up requests per endpoint, and record 60 sequential successful responses per endpoint. Time from request initiation through reading the full body. Report nearest-rank p50 and p95, body bytes without compression, and the number of responses containing `Set-Cookie`. Exclude login and logout from endpoint timings.
- For [pagination](02-use-space-stats-and-paginate-lists.md) and [indexes](04-match-indexes-to-list-queries.md), repeat with a representative larger dataset and capture the PostgreSQL query plans. For [reference caching](03-cache-reference-data.md), measure HTTP requests from actual browser navigation too. An HTTP client that explicitly requests each endpoint bypasses React Query.

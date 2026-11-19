# Run Prisma migrations once per deploy

## Benefits

- The production API image dropped from **1.13 GB to 357 MB**, about 68%. The CLI is installed in the migration image, and only the uploads directory changes ownership in the API image.
- API restarts no longer run migrations. In a local test against an already migrated database, median time to the first successful API health response fell from **1.92 seconds to 0.60 seconds**.
- A failed migration prevents the new API release from starting. The documented release sequence leaves the running API in place until the job succeeds.

## Behaviour before the change

The production entrypoint ran `npx prisma migrate deploy` before starting Node. The API image shipped the Prisma CLI, and every API restart repeated migration startup work.

The measured production image was 1.13 GB. Its layer history attributed 350 MB to the recursive ownership change, roughly the size of the preceding `node_modules` layer. [Measured backend baseline](backend-performance-baseline.md)

## Implementation

1. The [Dockerfile](../../backend/Dockerfile) installs the full lockfile and generates Prisma Client at build time. The `migrate` image uses this stage and runs the installed CLI against the deploy-time `DATABASE_URL`.
2. The Prisma CLI is a dev dependency. The runtime installs with `npm ci --omit=dev --omit=optional` because Prisma Client also declares the CLI as an optional peer. The API image includes the generated client and runs Node directly as the `node` user. Only `/app/uploads` needs an ownership change. Development and seed commands retain access to the CLI.
3. [Production Compose](../../docker-compose.prod.yml) waits for PostgreSQL to accept TCP connections, then runs the one-shot migration service. The API's dependency condition requires the job to exit successfully. Nginx depends on API health. The production project has its own network and volumes.
4. The [production release sequence](../../README.md) recreates the migration job before updating the running API. The API and Nginx start after their prerequisites succeed without replaying the job. Use compatible schema changes when keeping the previous API online during migrations. Rolling back the API image leaves applied migrations in the database.

## Verification

Use the [measured backend baseline](backend-performance-baseline.md) to compare production image size after separating migrations.

- Deploy against an empty staging database and verify migrations run before the API becomes healthy. Deploy again against an already migrated database and verify the job exits successfully. Run a release with a new pending migration and confirm the job is recreated and applies it.
- Restart only the API process or container and verify it starts without invoking the migration CLI. Check that the runtime image lacks the CLI and still performs a database read and writes an upload.
- Introduce a migration failure in disposable staging and verify it prevents the new backend from starting. Inspect the migration job logs and check recovery after fixing the failure.
- Compare the old and new production image sizes and API startup times using the same build platform and measurement method. Measure steady-state memory separately if that is a deployment goal.

## Verification results

An isolated Compose project verified that a failed migration blocked startup, a fresh database applied the existing migrations, a subsequent release applied a temporary pending migration before replacing the API container, and repeating that release created a fresh successful job with no pending changes. An API-only restart left the migration container untouched.

The API ran as `node` and served database-backed requests with no Prisma CLI or migration history in its filesystem. The API wrote space covers to both a fresh and a reused upload volume. Stock Nginx with the production proxy config served the API health route and both uploaded files. Existing frontend TypeScript errors still block building the complete Nginx image with the site bundled.

The startup comparison rebuilt the previous API image and used the same base image, Docker Desktop host, and already migrated database for three starts per image. Each sample ran from launching a new container to the first successful database-backed health response. The dependency layer dropped from 348 MB to 83.7 MB, and the upload ownership layer dropped from 350 MB to 12.3 kB.

[Docker Compose startup order](https://docs.docker.com/compose/how-tos/startup-order/) · [Prisma migration deployment](https://www.prisma.io/docs/orm/v7/prisma-client/deployment/deploy-database-changes-with-prisma-migrate)

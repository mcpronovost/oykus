# Run Prisma migrations once per deploy

## Current behavior and cost

The [production entrypoint](../../backend/docker-entrypoint.sh) runs `npx prisma migrate deploy` before starting Node. The [Dockerfile](../../backend/Dockerfile) ships the Prisma CLI and production dependencies together because every API container needs the CLI at startup. This increases the runtime image and makes restarts repeat migration startup work. A one-shot migration job gives the deploy a clear failure point and leaves API startup responsible for starting the server.

The measured production image was 1.13 GB. Its layer history attributed 350 MB to the final recursive ownership change, roughly the size of the preceding `node_modules` copy. This makes ownership a separate optimization that can be measured before migrating the CLI out of the image. [Measured backend baseline](backend-performance-baseline.md)

## Implementation

1. Keep a Docker build stage that installs the full lockfile and generates the Prisma client. Add a migration target with the local Prisma CLI, `prisma.config.js`, schema files, and migration history. Run `prisma migrate deploy` using the installed CLI and the deploy-time `DATABASE_URL`. Keep client generation at image build time and migrations at deploy time.
2. Move the `prisma` CLI package to `devDependencies` and update the lockfile. Keep `@prisma/client`, `@prisma/adapter-pg`, and Express in production dependencies. The API image should install with `npm ci --omit=dev` and copy in the generated client. Check the final image starts under the existing `node` user, can write to its upload volume, and can execute a real database query. Keep the development image and seed command able to access the CLI.
3. Add a one-shot `migrate` service to [production Compose](../../docker-compose.prod.yml). Have it wait for healthy PostgreSQL, use the same network and database configuration as the API, and exit with the CLI's status. Have backend startup wait for `service_completed_successfully`, then let Nginx continue to wait for the backend health check. Pass secrets at service startup.
4. Update the [production instructions](../../README.md) so each release executes a fresh migration job for that release, even if a prior job container exists. If deployment is scripted, make migration success a prerequisite to starting the new backend release. Verify the documented command sequence on an existing deployment as well as a fresh one. The API entrypoint can then execute Node directly with its existing options.
5. For an in-place rollout where the old API can still serve traffic during migration, use schema changes that both versions can tolerate or schedule a maintenance window for incompatible changes. Define rollback around schema compatibility. Rolling back the API image leaves applied migrations in the database.
6. Replace the recursive `/app` ownership change with targeted setup for writable paths. The `node` user needs to read application files and dependencies and write to `/app/uploads`. Keep readable artifacts root-owned where possible and set ownership at copy or creation time for paths that need it. Validate permissions with a fresh upload volume and with the existing volume before comparing image history and size.

## Verification

Use the [measured backend baseline](backend-performance-baseline.md) to compare production image size after separating migrations.

- Deploy against an empty staging database and verify migrations run before the API becomes healthy. Deploy again against an already migrated database and verify the job exits successfully. Run a release with a new pending migration and confirm the job is recreated and applies it.
- Restart only the API process or container and verify it starts without invoking the migration CLI. Check that the runtime image lacks the CLI and still performs a database read and writes an upload.
- Introduce a migration failure in disposable staging and verify it prevents the new backend from starting. Inspect the migration job logs and check recovery after fixing the failure.
- Compare the old and new production image sizes and API startup times using the same build platform and measurement method. Measure steady-state memory separately if that is a deployment goal.

[Docker Compose startup order](https://docs.docker.com/compose/how-tos/startup-order/) · [Prisma migration deployment](https://www.prisma.io/docs/orm/v7/prisma-client/deployment/deploy-database-changes-with-prisma-migrate)

![Oykus](.github/assets/banner.webp "Oykus")

<p align="center">
  <br/>
  <a href="https://github.com/mcpronovost/oykus">Oykus</a> &mdash; where every player is both author and adventurer
  <br/><br/>
</p>

<div align="center">

[![Version](https://img.shields.io/badge/Version-0.4.0-blue.svg)](./CHANGELOG.md)
[![License](https://img.shields.io/badge/License-BSD--3--Clause-red.svg)](./LICENSE)
[![made in Québec](https://img.shields.io/badge/Créé%20au-Québec-003399)](#)

</div>

Oykus is an **experimental RPG project** blending story-creation, planning and management, with gameplay — letting players shape narratives while they play.

- **Backend:** Express / Prisma
- **Frontend:** Vite / React

> _This project is a work in progress!_

---

## Layout
<details>
  <summary>Core structure</summary>

```
oykus/
├── backend/                     ## Express and Prisma, JavaScript
├── frontend/                    ## Vite, React, and TypeScript
├── nginx/                       ## reverse proxy
├── .env.example
├── docker-compose.prod.yml      ## production images
├── docker-compose.yml           ## local: docker compose up
└── README.md
```

</details>

<details>
  <summary>backend/src</summary>

```
src/
├── core/
│   ├── auth/
│   │   ├── auth.controllers.js
│   │   ├── auth.inputs.js
│   │   ├── auth.routes.js
│   │   └── auth.services.js
│   ├── spaces/
│   │   ├── members/
│   │   │   ├── members.controllers.js
│   │   │   ├── members.routes.js
│   │   │   └── members.services.js
│   │   ├── permissions/
│   │   │   └── permissions.services.js
│   │   ├── roles/
│   │   │   ├── roles.controllers.js
│   │   │   ├── roles.routes.js
│   │   │   └── roles.services.js
│   │   ├── spaces.controllers.js
│   │   ├── spaces.routes.js
│   │   └── spaces.services.js
│   └── users/
│       ├── users.controllers.js
│       ├── users.outputs.js
│       ├── users.routes.js
│       └── users.services.js
├── features/
│   ├── encyclopedia/
│   │   ├── encyclopedia.controllers.js
│   │   ├── encyclopedia.inputs.js
│   │   ├── encyclopedia.outputs.js
│   │   ├── encyclopedia.routes.js
│   │   └── encyclopedia.services.js
│   └── notes/
│       ├── notes.controllers.js
│       ├── notes.inputs.js
│       ├── notes.outputs.js
│       ├── notes.routes.js
│       └── notes.services.js
├── plugins/
│   ├── blog/
│   │   ├── blog.controllers.js
│   │   ├── blog.routes.js
│   │   └── blog.services.js
│   └── tracker/
│       ├── tracker.controllers.js
│       ├── tracker.routes.js
│       └── tracker.services.js
├── shared/
│   ├── auth/
│   │   ├── cookies.js
│   │   ├── password.js
│   │   └── session.js
│   ├── config/
│   │   └── index.js
│   ├── db/
│   │   └── index.js
│   ├── errors/
│   │   └── index.js
│   ├── middlewares/
│   │   ├── csrf.js
│   │   ├── errorHandler.js
│   │   ├── rateLimit.js
│   │   ├── requireAuth.js
│   │   └── securityHeaders.js
│   └── validate.js
├── app.js
└── index.js
```

</details>

<details>
  <summary>frontend/src</summary>

```
src/
├── assets/
│   ├── img/
│   └── styles/
│       ├── base/
│       ├── common/
│       ├── core/
│       ├── ui/
│       └── main.scss
├── components/
│   ├── common/                    ## shared components, imported through index.js
│   ├── core/                      ## singular layout components: sidebar, header, main
│   ├── ui/                        ## interface components, imported through index.js
│   ├── Providers.tsx
│   └── index.js
├── pages/
├── services/
│   ├── api/
│   ├── auth/
│   ├── router/
│   ├── store/
│   └── translation/
├── utils/                       ## imported through index.js
├── App.tsx
└── main.tsx
```

</details>

There is no root `package.json`. Backend and frontend are separate npm projects. Docker Compose ties them together.

CSS classes use the `oyk-` prefix when a separator is required. Exported React components use `Oyk` in PascalCase. Filenames do not use the prefix.

## Docs

Product decisions and feature notes live in [`.docs/`](./.docs/):

- [Spaces and current workspace](./.docs/spaces-and-workspace.md)
- [Navigation and menu](./.docs/navigation-and-menu.md)

## Install

Docker Desktop on Windows or Mac is the only requirement. The same commands run on both.

1. Copy `.env.example` to `.env` in the repository root.

2. Start the local stack:

```bash
docker compose up
```

On first start, the backend and frontend containers install npm packages into the bind-mounted project folders (so the IDE can resolve them) and generate the Prisma client under `backend/prisma/db`. Later starts skip install unless `package-lock.json` is newer than `node_modules`.

3. Open `http://localhost:8080`.

Postgres is published on port `5433`. The API and Vite are reached only through Nginx.

Client configuration uses names that start with `VITE_` in `.env`. During local development, Compose injects that file into the Vite process, and the browser can read those names from `import.meta.env`. Other names stay on the server. A production build inlines `VITE_` values when the Nginx image is built, so a change to a client variable means rebuilding that image.

Authenticated requests validate the session in PostgreSQL. Active sessions renew their database expiry and cookie at most once every 10 minutes, or half of `SESSION_TTL_MS` when the configured lifetime is shorter than 20 minutes. The recorded last activity can lag actual requests by up to that refresh interval.

The notes and encyclopedia topic list routes return pages of 25 records by default. An optional `limit` accepts 1–50. Pass the returned `nextCursor` as the `cursor` query parameter to load the next page.

Lint the frontend:

```bash
docker compose exec oykus-frontend npm run lint
```

## Production

Run the following from the repository root for each release. The migration job finishes before the running API is replaced.

```powershell
$composeFile = "docker-compose.prod.yml"

docker compose -f $composeFile build
if ($LASTEXITCODE -ne 0) { throw "Production image build failed." }

docker compose -f $composeFile up -d --wait postgres
if ($LASTEXITCODE -ne 0) { throw "PostgreSQL did not become healthy." }

docker compose -f $composeFile up --no-deps --no-build --force-recreate --exit-code-from migrate migrate
if ($LASTEXITCODE -ne 0) { throw "Database migration failed. The API release was not started." }

docker compose -f $composeFile up -d --no-deps --no-build --wait backend
if ($LASTEXITCODE -ne 0) { throw "The API did not become healthy." }

docker compose -f $composeFile up -d --no-deps --no-build --force-recreate nginx
if ($LASTEXITCODE -ne 0) { throw "Nginx did not start." }
```

The release sequence always recreates the migration job. It starts the API and Nginx without replaying completed dependencies. Restarting the API with `docker compose -f docker-compose.prod.yml restart backend` starts Node directly. For migration diagnostics, use `docker compose -f docker-compose.prod.yml logs migrate`.

The running API may continue serving during migrations. Use migrations compatible with both releases or schedule maintenance for incompatible changes. Rolling back an API image leaves applied database migrations in place.

Nginx listens on port 80, serves the built frontend, and proxies `/api/` to the backend. The `oykus-production` Compose project uses its own network and volumes, separate from development.

User uploads (avatars, covers) are served by Nginx at `/uploads/` with a one-year cache. Locally, both the backend and Nginx use `backend/uploads` on the host. In production, a named Docker volume is mounted at `/app/uploads` in the backend (read-write) and `/var/www/uploads` in Nginx (read-only).

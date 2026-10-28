![Oykus](.github/assets/banner.jpg "Oykus")

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

```js
oykus/
├── backend/                     // Express and Prisma, JavaScript
├── frontend/                    // Vite, React, and TypeScript
├── nginx/                       // reverse proxy
├── .env.example
├── docker-compose.prod.yml      // production images
├── docker-compose.yml           // local: docker compose up
└── README.md
```

`backend/src`:

```js
src/
├── core/
│   ├── auth/
│   │   ├── auth.controllers.js
│   │   ├── auth.routes.js
│   │   └── auth.services.js
│   ├── spaces/
│   │   ├── spaces.controllers.js
│   │   ├── spaces.routes.js
│   │   └── spaces.services.js
│   └── users/
│       ├── users.controllers.js
│       ├── users.routes.js
│       └── users.services.js
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
│   ├── db/
│   │   └── index.js
│   ├── errors/
│   │   └── index.js
│   └── middlewares/
│       └── errorHandler.js
├── app.js
└── index.js
```

`frontend/src`:

```js
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
│   ├── common/                    // shared components, imported through index.js
│   ├── core/                      // singular layout components: sidebar, header, main
│   ├── ui/                        // interface components, imported through index.js
│   ├── Providers.tsx
│   └── index.js
├── pages/
├── services/
│   ├── api/
│   ├── auth/
│   ├── router/
│   ├── store/
│   └── translation/
├── utils/                       // imported through index.js
├── App.tsx
└── main.tsx
```

There is no root `package.json`. Backend and frontend are separate npm projects. Docker Compose ties them together.

CSS classes use the `oyk-` prefix when a separator is required. Exported React components use `Oyk` in PascalCase. Filenames do not use the prefix.

## Install

Docker Desktop on Windows or Mac is the only requirement. The same commands run on both.

1. Copy `.env.example` to `.env` in the repository root.

2. Start the local stack:

```bash
docker compose up
```

3. Open `http://localhost:8080`.

Postgres is published on port `5432`. The API and Vite are reached only through Nginx.

Client configuration uses names that start with `VITE_` in `.env`. During local development, Compose injects that file into the Vite process, and the browser can read those names from `import.meta.env`. Other names stay on the server. A production build inlines `VITE_` values when the Nginx image is built, so a change to a client variable means rebuilding that image.

Lint the frontend:

```bash
docker compose exec oykus-frontend npm run lint
```

## Production

```bash
docker compose -f docker-compose.prod.yml up --build
```

Nginx listens on port 80, serves the built frontend, and proxies `/api/` to the backend.

User uploads (avatars, covers) live on a named Docker volume mounted at `/app/uploads` in the backend (read-write) and `/var/www/uploads` in Nginx (read-only). Nginx serves them at `/uploads/` with a one-year cache.

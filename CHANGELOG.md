# Changelog

All notable changes to Oykus v4 development, starting from the October 2026 rewrite.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.0] — Unreleased

Brand-new v4 codebase. Previous history was wiped and replaced with this rewrite.

### 2026-10-23
- Init v4 project structure with Docker, Express backend, and Vite/React frontend
- Initial README

### 2026-10-24
- Frontend foundation: theme variables, SCSS, Babel/ESLint, path aliases, and API proxy
- Handmade translation service and RouterProvider with localized routes
- Home page and early Kanban UI; add Tabler icons

### 2026-10-25
- Expand UI kit: Grid, Chip, Divider, ProgressBar, and Button
- Kanban layout and theme refinements; add project rules

### 2026-10-26
- Express backend skeleton: health check, Prisma, error middleware and classes
- Backend architecture rules and docs; PWA and favicon
- Auth service init; lazy-loaded Home/Dashboard; Home hero/footer polish
- Auth-aware routing, core loading state, and “encyclopedia” naming on Home

### 2026-10-27
- Core Prisma schema
- User uploads volumes in Docker/Nginx and local upload handling in README

### 2026-10-29
- OykLayout shell for the main app layout

### 2026-10-31
- Header and Sidebar; layout conditional rendering by route
- Home atmosphere imagery, craft section, and sidebar nav items
- Theme colour and authenticated layout polish

### 2026-11-01
- Header/sidebar styling, avatars, and sidebar icons
- Favicon and app icons refresh; README update

### 2026-11-02
- UI: Tooltip, Spacer, Result, Dialog
- Sidebar nav links (Library, Add plugins), settings dialog, Notes page init
- Docker/package scripts, responsive header social icons, docs updates

### 2026-11-03
- Dev and Laboratory pages; 404 via OykResult; route redirects (`resolveRoute`)
- Rename Library → Encyclopedia; initial DB migration
- Registration page with EN/FR translations and skyline asset

### 2026-11-04
- OykButton `routeName` navigation
- Auth-gated Header/Sidebar; Home CTAs wired to routes

### 2026-11-05
- Full session auth: register/login, cookies, CSRF, rate limiting, Prisma session models
- Input validation schemas and AuthProvider loading/state
- OykAlert and semantic theme colour tokens (success, danger, info, warning, special)

### 2026-11-06
- Username-based login; React Query for auth/session data fetching
- UI: Heading, Scrollbar, button variants/colours, Components demo page
- Theme and alert styling refinements

### 2026-11-07
- OykForm with validation, select, and multiselect; Login/Register use SubmitEvent
- Button size/`grow` props; Card padding/gradient; Grid flex/gap/`nop`
- OykMasonry with category filtering and entry animations; Notes page form UX

### 2026-11-08
- SpaceMember, SpaceRole, and SpaceRolePermission models
- Notes CRUD and categories with improved seed script
- Current space management; space creation modal on Dashboard
- OykModal, OykLink, header nav/branding; Card/Divider polish; README mermaid diagrams

### 2026-11-09
- Notes masonry UX and note deletion; Vite HMR-safe context providers
- Login on OykForm; OykLink/sidebar disabled states; dashboard and i18n updates
- Encyclopedia and Notes pages with initial functionality; current space on dashboard

### 2026-11-10
- Space deletion with notes summary feedback in modal
- OykList on Dashboard; modal style consistency

### 2026-11-11
- OykStats component; HeaderUser dialog; relative layout heights

### 2026-11-12
- User language/timezone and streak management init; session rename
- Encyclopedia topic pages: characters, factions, locations, nature, items, events, lore
- ProgressBar/Stat API tweaks; encyclopedia layout and topics card

### 2026-11-13
- Encyclopedia Prisma models, migrations, topic seeding, and CRUD API
- Topic pages with filtering/loading; space stats endpoint and SpaceCurrentCard queries
- Topic position, icon, and colour fields; move tools under Features; docs updates

### 2026-11-14
- Encyclopedia entry create modal, cards, drawers, and recent entries
- OykDrawer, OykClamp; form textarea and portal select menu
- Encyclopedia stats API; masonry animations removed
- BSD 3-Clause licence; i18n, theme, and layout polish (xxl breakpoint, greetings/dates)

---

[0.4.0]: https://github.com/mcpronovost/oykus/compare/v0.3.0...HEAD

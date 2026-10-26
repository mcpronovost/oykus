---
description: Frontend conventions (Vite + React)
globs: frontend/**
alwaysApply: false
---

# Structure

- `components/ui`: generic, presentation-only building blocks (Button, Card, Chip, Form, Modal, etc.). No business logic, no service calls.
- `components/common`: reusable components that know about the app (they may use services via hooks).
- `pages`: one component per route. Compose components, keep logic thin.
- `services/*`: each service is a context + provider + hook (+ its own utils and types), except `services/api`.
- `services/api`: plain fetch client, not a provider. All HTTP calls go through it, never call `fetch` directly elsewhere.
- `utils`: pure functions only (formatters, validators). No React, no side effects.

# Services

- Use the existing services: `router`, `store`, `auth`, `translation`, `api`. Never add or suggest react-router, i18next, Redux, Zustand, axios, zod or similar.
- Consume a service through its hook (`useAuth`, `useRouter`, ...), never by importing its context directly.
- Providers are composed in one place (`components/Providers.tsx` component). Register new providers there.
- A new service follows the same pattern as the existing ones: `Context.tsx`, `Provider.tsx`, `use<Name>.ts`, `types.ts`, `index.ts`.

# React

- Function components and hooks only.
- Keep state as local as possible. Use the `store` service only for truly shared state.
- User-facing strings go through the `translation` service, never hardcoded.
- Validate through `utils/validaters`. Extend it instead of adding a validation library.
- Styles live in `assets/styles`. Reuse existing classes and tokens before adding new ones.

# Style

- Double quotes everywhere.
- Prefer TypeScript for new files. Existing `.js` utils can stay as they are unless touched.

# ALTA — Frontend (Angular 21)

The Angular single-page app for the ALTA e-commerce platform. For the full
project (backend, database, architecture), see the [root README](../README.md).

## Tech

- Angular 21 (standalone components, no NgModules)
- Signals for state, `computed()` for derived state
- Reactive Forms, RxJS
- Lazy-loaded feature routes
- Custom SCSS design system (no UI framework)
- Vitest for unit tests

## Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io/) (`npm i -g pnpm`)

## Setup & run

```bash
pnpm install
pnpm start          # ng serve -> http://localhost:4200
```

The API base URL is configured in `src/environments/environment.ts`
(`apiUrl`, default `http://localhost:5113`). The production replacement is
`src/environments/environment.prod.ts`.

## Build

```bash
pnpm build          # production build -> dist/alta-f
```

## Test

```bash
pnpm test           # Vitest
```

## Project structure

```
src/app/
├── core/                 # app-wide, non-feature code
│   ├── guards/           # authGuard, adminGuard, adminOnlyGuard, guestGuard
│   ├── interceptors/     # auth (JWT) + error interceptors
│   └── services/         # token storage, notifications
├── features/             # one folder per feature, lazy-loaded
│   ├── auth/             # login, register, verify-email, forgot/reset password
│   ├── products/         # catalog list (search/filter) + product detail
│   ├── cart/             # cart page + checkout
│   ├── orders/           # order history + status actions
│   ├── profile/          # profile, security, account deletion
│   ├── admin/            # products, categories, orders, users management
│   └── shell/            # main authenticated layout
└── shared/               # reusable components (navbar, product-card,
                          # pagination, toast) and typed API models
```

## Conventions

standalone components, `inject()`,
signals + `computed()`, `OnPush` change detection, native control flow
(`@if`/`@for`), `input()`/`output()` functions, and accessibility (ARIA, WCAG AA).

## Authentication & roles

The auth interceptor attaches the JWT bearer token to API requests; the error
interceptor handles `401` by logging out. Route guards gate access:

- `authGuard` — requires a logged-in user
- `adminGuard` — requires **Admin** or **Manager** (admin area)
- `adminOnlyGuard` — requires **Admin** (user management)
- `guestGuard` — only for anonymous users (login/register)

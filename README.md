# ALTA — E-Commerce Platform

A full-stack e-commerce platform: a product catalog with categories, search & filtering, a shopping cart, order management with status tracking, user accounts with email verification, and a role-based admin panel.

- **Backend** (`alta-b/`) — ASP.NET Core 8 Web API, Entity Framework Core, SQL Server, JWT auth.
- **Frontend** (`alta-f/`) — Angular 21 (standalone components, signals), custom SCSS design system.

> The original assignment specification is preserved in [`docs/REQUIREMENTS.md`](docs/REQUIREMENTS.md).
> Architecture is documented with the C4 model in [`docs/ARCHITECTURE-C4.md`](docs/ARCHITECTURE-C4.md).

---

## Tech stack

| Layer    | Technology |
|----------|------------|
| Backend  | C#, ASP.NET Core 8, Entity Framework Core 8, SQL Server |
| Auth     | JWT bearer tokens, BCrypt password hashing, email verification (SMTP) |
| Validation | FluentValidation (registered via DI) |
| Mapping  | AutoMapper |
| Docs     | Swagger / OpenAPI (Swashbuckle) |
| Frontend | Angular 21, RxJS, Angular signals, Reactive Forms, SCSS |
| Tests    | xUnit + EF InMemory (backend), Vitest (frontend) |

---

## Repository layout

```
.
├── alta-b/                 # ASP.NET Core Web API
│   ├── Controllers/        # API endpoints
│   ├── Services/           # Business logic (one folder per domain)
│   ├── Models/             # EF Core entities
│   ├── DTOs/               # Request/response contracts
│   ├── Validators/         # FluentValidation validators
│   ├── Mappers/            # AutoMapper profiles
│   ├── Data/               # DbContext
│   ├── Migrations/         # EF Core migrations
│   ├── Extensions/         # DI & pipeline wiring
│   ├── Common/             # Cross-cutting: Result<T>, middleware, JWT, SMTP, validation
│   └── Scripts/            # SQL schema + seed scripts
├── alta-f/                 # Angular 21 SPA
│   └── src/app/
│       ├── core/           # guards, interceptors, app-wide services
│       ├── features/       # auth, products, cart, orders, profile, admin
│       └── shared/         # components & models
├── ALTA.Tests/             # xUnit backend test project
└── docs/                   # REQUIREMENTS.md (spec), ARCHITECTURE-C4.md
```

---

## Prerequisites

- [.NET SDK 8.0+](https://dotnet.microsoft.com/download)
- [Node.js 20+](https://nodejs.org/) and [pnpm](https://pnpm.io/) (`npm i -g pnpm`)
- SQL Server (LocalDB, Express, or full) — the default connection targets `localhost\SQLEXPRESS`

---

## Backend setup & run

```bash
cd alta-b

# 1. Configure secrets (see "Configuration & secrets" below)
dotnet user-secrets set "Smtp:Email"    "you@gmail.com"
dotnet user-secrets set "Smtp:Password" "<gmail-app-password>"

# 2. Create / update the database from migrations
dotnet ef database update          # or run Scripts/schema.sql manually

# 3. Run the API
dotnet run
```

The API starts on `http://localhost:5113` (see `Properties/launchSettings.json`).
Swagger UI is available at `http://localhost:5113/swagger` in Development.

> If `dotnet ef` is not found: `dotnet tool install --global dotnet-ef`.

---

## Frontend setup & run

```bash
cd alta-f

pnpm install
pnpm start            # ng serve -> http://localhost:4200
```

The frontend reads the API base URL from `src/environments/environment.ts`
(`apiUrl: 'http://localhost:5113'`). Update it if your API runs elsewhere.

Build for production:

```bash
pnpm build            # outputs to dist/alta-f
```

---

## Configuration & secrets

Backend configuration lives in `alta-b/appsettings.json`. **No real secrets are
committed.** Sensitive values are supplied at runtime via
[.NET user-secrets](https://learn.microsoft.com/aspnet/core/security/app-secrets)
(loaded automatically in the Development environment) or environment variables.

| Key | Purpose | Where to set |
|-----|---------|--------------|
| `ConnectionStrings:Default` | SQL Server connection | `appsettings.json` (no secret) |
| `Jwt:Key` | JWT signing key | `appsettings.json` (dev) / secret (prod) |
| `Smtp:Email` / `Smtp:Password` | SMTP sender + app password | **user-secrets / env only** |
| `Cors:AllowedOrigins` | Allowed frontend origins | `appsettings.json` |

Set secrets locally:

```bash
cd alta-b
dotnet user-secrets set "Smtp:Email"    "you@gmail.com"
dotnet user-secrets set "Smtp:Password" "your-app-password"
```

For Gmail, use an **App Password** (not your account password) with 2FA enabled.

---

## Roles

Three roles are enforced (`UserRoles` enum):

| Role | Value | Capabilities |
|------|-------|--------------|
| `User` | 0 | Browse, cart, checkout, manage own orders & profile |
| `Admin` | 1 | Everything, including user management & role assignment |
| `Manager` | 2 | Manage products, categories, and orders (no user management) |

Admin-area access (`/admin`) is granted to **Admin** and **Manager**; the Users
page is **Admin-only**. New users register as `User`; an Admin promotes them via
the admin Users page or `PUT /api/admin/users/{id}/role`.

---

## API reference

Base URL: `http://localhost:5113`. All `Result<T>` responses share the shape
`{ status, value, message, errors }`. 🔒 = requires JWT; 👑 = Admin/Manager; 👤 = Admin only.

### Auth — `/api/auth`
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/register` | Register; sends email verification code |
| POST | `/login` | Login → JWT (or "Verification" if unverified) |
| PUT  | `/verify-email` | Verify email with code → JWT |
| POST | `/forgot-password/{email}` | Send password reset code |
| PUT  | `/reset-password` | Reset password with code |

### Products — `/api/products`
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/` | Paginated product list |
| GET | `/filter` | Filter by query, price range, category |
| GET | `/{id}` | Product details |

### Categories — `/api/categories`
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/` | List all categories |

### Wishlist — `/api/wishlist` 🔒
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/` | Paginated wishlist |
| POST | `/` | Add a product to the wishlist |
| DELETE | `/{productId}` | Remove a product from the wishlist |

### Reviews — `/api/reviews`
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/product/{productId}` | Paginated reviews for a product |
| POST | `/` 🔒 | Create/update the caller's review (rating 1–5) |

### Addresses — `/api/addresses` 🔒
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/` | List the caller's saved addresses |
| POST | `/` | Add an address |
| PUT | `/{addressId}` | Update an address |
| DELETE | `/{addressId}` | Delete an address |

### Cart — `/api/cart` 🔒
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/` | Paginated cart items |
| POST | `/` | Add item to cart |
| PUT | `/` | Edit item quantity |
| DELETE | `/{id}` | Remove item |

### Orders — `/api/orders` 🔒
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/` | Order history (optional status filter) |
| POST | `/checkout` | Create order from cart |
| POST | `/{id}/confirm` | Confirm a pending order |
| POST | `/{id}/cancel` | Cancel a pending order (restores stock) |
| DELETE | `/{id}` | Soft-delete a non-pending order |

### Users — `/api/users` 🔒
| Method | Route | Description |
|--------|-------|-------------|
| PUT | `/edit` | Edit profile (username, address, phone) |
| PUT | `/change-password` | Change password |
| DELETE | `/` | Delete own account |

### Admin — `/api/admin` 🔒👑
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/dashboard` | Analytics: sales, counts, low stock, top products |
| POST/PUT/DELETE | `/products[/{id}]` | Product CRUD |
| POST/PUT/DELETE | `/categories[/{id}]` | Category CRUD |
| GET | `/orders` | All orders (filterable) |
| PUT | `/orders/{id}/status` | Update order status |
| GET | `/users` 👤 | All users |
| PUT | `/users/{id}/role` 👤 | Assign user role |

Full, always-current documentation is available via Swagger UI.

---

## Testing

```bash
# Backend (xUnit + EF InMemory)
dotnet test ALTA.Tests/ALTA.Tests.csproj

# Frontend (Vitest)
cd alta-f && pnpm test
```

---

## Troubleshooting

- **Cannot connect to SQL Server** — verify the instance name in
  `ConnectionStrings:Default` (default `localhost\SQLEXPRESS`) and that the
  database exists (`dotnet ef database update`).
- **Emails not sending** — ensure `Smtp:Email` / `Smtp:Password` are set in
  user-secrets and that the Gmail account uses an App Password.
- **CORS errors in the browser** — add your frontend origin to
  `Cors:AllowedOrigins` in `appsettings.json`.
- **401 on protected endpoints** — the JWT expires after 30 minutes; log in again.

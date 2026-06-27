# 🌐 VAPE — Enterprise E-Commerce Platform

> [!NOTE]
> A comprehensive, full-stack e-commerce solution featuring a scalable catalog, robust cart mechanics, order lifecycle tracking, strict role-based access control, and a modern, high-performance UI.

## 🏗️ System Overview

| Subsystem | Stack | Path | Description |
|-----------|-------|------|-------------|
| **Backend** | `ASP.NET Core 8 Web API` | `vape-b/` | C#, EF Core 8, SQL Server, JWT, FluentValidation |
| **Frontend** | `Angular 21` | `vape-f/` | Standalone, Signals, RxJS, Custom SCSS |

> [!TIP]
> - Original requirements: [`docs/REQUIREMENTS.md`](docs/REQUIREMENTS.md)
> - C4 Architecture: [`ARCHITECTURE-C4.md`](ARCHITECTURE-C4.md)

---

## 🛠️ Repository Topography

```text
📦 VAPE Monorepo
 ┣ 📂 vape-b                 # Backend API (ASP.NET)
 ┃ ┣ 📂 Controllers          # HTTP Endpoint Definitions
 ┃ ┣ 📂 Services             # Vertical Slice Business Logic
 ┃ ┣ 📂 Models               # EF Core Domain Entities
 ┃ ┗ 📂 Migrations           # DB Schema Iterations
 ┣ 📂 vape-f                 # Frontend SPA (Angular)
 ┃ ┗ 📂 src/app
 ┃   ┣ 📂 core               # Guards, Interceptors, App-State
 ┃   ┣ 📂 features           # Lazy-Loaded Domains (Admin, Shop)
 ┃   ┗ 📂 shared             # Reusable UI Components
 ┗ 📂 VAPE.Tests             # xUnit Automated Verification
```

---

## 🚀 Deployment Operations

### 1. Backend Initialization (`vape-b/`)

> [!IMPORTANT]
> The application uses `.NET User Secrets` to manage sensitive data. Never commit passwords.

```bash
cd vape-b

# Inject SMTP configuration
dotnet user-secrets set "Smtp:Email" "sys@gmail.com"
dotnet user-secrets set "Smtp:Password" "app-password"

# Synchronize Database Schema
dotnet ef database update

# Boot API Server
dotnet run
```
* **API Origin:** `http://localhost:5113`
* **Swagger Interface:** `http://localhost:5113/swagger`

### 2. Frontend Initialization (`vape-f/`)

```bash
cd vape-f

# Resolve dependencies and run dev server
pnpm install
pnpm start
```
* **Client Origin:** `http://localhost:4200`
* *Target API is configured within `src/environments/environment.ts`.*

---

## 🔐 Security & Access Control

Three distinct permission tiers are strictly enforced across the application lifecycle:

1. **`User` (Level 0):** Standard consumer access. Can modify personal cart, address book, and track historical orders.
2. **`Manager` (Level 2):** Operational staff. Capable of mutating catalog data (products, categories) and updating order fulfillment statuses.
3. **`Admin` (Level 1):** System administrator. Inherits all Manager privileges, plus exclusive authority to dictate user roles and purge accounts.

---

## 📡 Core API Topography

*All protected routes require a valid JWT Bearer token.*

| Domain | Scope | Description |
|--------|-------|-------------|
| **`/api/auth`** | Public | Authentication, JWT provisioning, email validation. |
| **`/api/products`** | Public | Catalog retrieval and dynamic filtering. |
| **`/api/cart`** | 🔒 Auth | Ephemeral cart state mutation. |
| **`/api/orders`** | 🔒 Auth | Checkout workflows and historical tracking. |
| **`/api/admin`** | 🔒/👑 Elev | Catalog mutation, order status injection, role management. |

---

## 🧪 Validation Mechanics

```bash
# Execute Backend Tests (xUnit + EF InMemory)
dotnet test VAPE.Tests/VAPE.Tests.csproj

# Execute Frontend Tests (Vitest)
cd vape-f && pnpm test
```

> [!WARNING]
> **Troubleshooting Guide:**
> - **SQL Connection Failures:** Validate `ConnectionStrings:Default` in `appsettings.json`. Target defaults to `localhost\SQLEXPRESS`.
> - **CORS Blockers:** Ensure the client origin matches `Cors:AllowedOrigins`.
> - **401 Unauthorized:** JWT lifecycle is capped at 30 minutes. Re-authenticate upon expiration.

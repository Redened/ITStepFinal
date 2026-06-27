# 🅰️ VAPE Frontend — Angular 21 Architecture

> [!NOTE]
> This is the standalone client-side application for the VAPE platform, built entirely on Angular 21 utilizing bleeding-edge rendering patterns, advanced signal-based reactivity, and a highly modular, zero-dependency SCSS UI framework.

---

## ⚙️ Core Technical Stack & Systems

- **Core Framework:** Angular 21 (`@angular/core`, `@angular/common`, `@angular/router`)
- **Modality:** 100% Strict Standalone Components (Zero `NgModules`)
- **Reactive State (Synchronous):** Native Angular Signals (`signal`, `computed`, `effect`)
- **Reactive Data Streams (Asynchronous):** RxJS (`~7.8.0`) mapping and stream manipulation
- **Forms System:** Reactive Forms (`@angular/forms`) with strict typings
- **Styling Architecture:** Modular SCSS relying on CSS Custom Properties (Variables)
- **Testing Engine:** Vitest integration (`vitest`, `jsdom`) for high-velocity isolated component assertion

---

## 🏗️ Detailed Architectural Topology

The frontend is strictly segmented to ensure maximal scalability and lazy-loading efficiency.

<details>
<summary><b>Click to expand full structural layout</b></summary>

```text
src/app/
 ┣ 📂 core/                # Systemic Singletons & Network Protocols
 ┃ ┣ 📂 guards/            # Navigation Interceptors (authGuard, adminGuard)
 ┃ ┣ 📂 interceptors/      # HTTP Middleware (Token Injection, 401 Handlers)
 ┃ ┗ 📂 services/          # Global State & Utility (TokenStorage, Notifications)
 ┣ 📂 features/            # Isolated Business Domains (Lazy-Loaded)
 ┃ ┣ 📂 auth/              # Registration, Login, JWT Retrieval, Password Reset
 ┃ ┣ 📂 products/          # Catalog List, Dynamic Filtering, Detail View
 ┃ ┣ 📂 cart/              # Client-Side Cart Mutability & Checkout Staging
 ┃ ┣ 📂 orders/            # Lifecycle Tracking & Fulfillment Logs
 ┃ ┣ 📂 profile/           # User Configuration & Address Books
 ┃ ┗ 📂 admin/             # Elevated Operational Command Center
 ┗ 📂 shared/              # Reusable Cross-Domain Constructs
   ┣ 📂 components/        # Dumb UI Elements (Pagination, Modals, Product Cards)
   ┗ 📂 models/            # Strict TypeScript Interfaces & Contracts
```
</details>

---

## 🚦 Navigation Guard Rails & Security

Route resolution is strictly gated by authorization interceptors that analyze JWT payload structures stored by the client:

1. **`guestGuard`**: Prevents authenticated sessions from accessing login/registration vectors. Forces redirection to catalog.
2. **`authGuard`**: Blocks anonymous access to protected internal views (Cart, Orders, Profile).
3. **`adminGuard`**: Restricts entry to operational panels; inherently requires `Manager` or `Admin` JWT claims.
4. **`adminOnlyGuard`**: Hard-locks the elevated user-management matrix to `Admin` claims exclusively.

---

## 🔄 Network Interceptors

HTTP operations are intercepted at the boundaries to apply systemic rules automatically:

- **Auth Interceptor:** Intercepts all outbound requests, retrieving the stored JWT from `TokenStorageService`, and appending the `Authorization: Bearer <token>` header.
- **Error Interceptor:** Globally traps HTTP `401 Unauthorized` responses (typically due to JWT expiration), forcing a hard purge of local authentication state and routing the user to the login matrix.

---

## 🎨 Design System & Accessibility

- **No Third-Party Component Libraries:** The entire UI (modals, skeletons, toast notifications, badges, form inputs) is constructed from scratch.
- **CSS Custom Properties:** Global variables (`styles.scss`) dictate themes, spacing variants, color palettes, and typography metrics to ensure consistency.
- **Accessibility Protocols:** Implements native HTML structural semantics, `aria-label`, `aria-hidden`, and `role` attributes ensuring WCAG AA baseline compliance. Focus management is applied to interactive elements like modals and navigation drawers.

---

## 🛠️ Execution Protocol

### Initialization
```bash
# Guarantee pnpm is globally available: npm i -g pnpm
pnpm install
```

### Development Server
```bash
pnpm start
# Automatically binds to http://localhost:4200
```

> [!IMPORTANT]
> Target API parameters are defined in `src/environments/environment.ts`. The default `apiUrl` points to `https://localhost:7169`. Ensure your backend is running at this exact destination.

### Production Pipeline
```bash
# Compiles AOT optimized output to /dist/vape-f
pnpm build

# Executes isolated test suites via Vitest engine
pnpm test
```

# 🏛️ VAPE — Architectural Blueprint (C4 Model)

> [!NOTE]
> This document maps the structural topology of the VAPE platform using the C4 hierarchy, progressing from systemic macro-contexts down to internal API composition.

---

## 🌐 Level 1: System Context

Defines the external actors and their boundaries relative to the VAPE platform.

```mermaid
graph TD
    customer["👤 Customer<br/><i>Browses, orders, manages account</i>"]
    staff["👤 Admin / Manager<br/><i>Manages catalog, orders, users</i>"]

    subgraph vape[" "]
        system["🛒 VAPE E-Commerce Platform<br/><i>Catalog, cart, orders, accounts, admin</i>"]
    end

    smtp["✉️ External: SMTP<br/><i>Gmail Delivery System</i>"]

    customer -->|"Uses (HTTPS)"| system
    staff -->|"Manages (HTTPS)"| system
    system -->|"Dispatches Mail"| smtp
```

---

## 📦 Level 2: Container Matrix

The logical deployment nodes and their communication vectors.

```mermaid
graph TD
    user["👤 User (Browser)"]

    subgraph platform["VAPE Ecosystem"]
        spa["🅰️ SPA Client<br/><b>Angular 21</b><br/><i>UI & State Signals</i>"]
        api["🌐 REST Gateway<br/><b>ASP.NET Core 8</b><br/><i>Auth & Logic Rules</i>"]
        db[("🗄️ Relational DB<br/><b>SQL Server</b><br/><i>EF Core Persistence</i>")]
    end

    smtp["✉️ Gmail (SMTP)"]

    user -->|"HTTPS"| spa
    spa -->|"JSON / HTTPS / JWT"| api
    api -->|"TDS Protocol"| db
    api -->|"SMTP Relay"| smtp
```

| Node | Technology | Primary Function |
|------|------------|------------------|
| **SPA Client** | Angular 21, RxJS | DOM rendering, route guarding, state hydration. |
| **REST Gateway** | ASP.NET Core 8 | Route controllers, data mapping, fluent validation. |
| **Relational DB**| SQL Server | Permanent state storage via EF Core mapping. |

---

## ⚙️ Level 3: Internal API Components

Internal dependency graph of the `.NET Core` REST Gateway.

```mermaid
graph TD
    subgraph api["REST Gateway Internals"]
        mw["ExceptionMiddleware<br/><i>Global Error Trap</i>"]
        authmw["Authorization Pipeline<br/><i>JWT & Policy Enforcement</i>"]

        subgraph controllers["HTTP Controllers"]
            authC["Auth"]
            prodC["Products"]
            catC["Categories"]
            cartC["Cart"]
            orderC["Orders"]
            userC["Users"]
            adminC["Admin"]
        end

        subgraph services["Domain Services"]
            authS["Auth Service"]
            prodS["Product Service"]
            catS["Category Service"]
            cartS["Cart Service"]
            orderS["Order Service"]
            userS["User Service"]
            adminS["Admin Service"]
        end

        subgraph cross["Shared Infrastructure"]
            validators["FluentValidation"]
            mapper["AutoMapper"]
            jwt["JwtGenerator"]
            smtpS["SmtpClient"]
            result["Result&lt;T&gt; Wrapper"]
        end

        ctx["DataContext<br/><i>EF Core Graph</i>"]
    end

    db[("SQL Server")]

    mw --> authmw --> controllers
    authC --> authS
    prodC --> prodS
    catC --> catS
    cartC --> cartS
    orderC --> orderS
    userC --> userS
    adminC --> adminS

    services --> validators
    services --> mapper
    services --> ctx
    authS --> jwt
    authS --> smtpS
    ctx --> db
```

---

## 🔄 Transaction Lifecycle: Checkout Sequence

```mermaid
sequenceDiagram
    participant SPA as Angular Client
    participant API as OrdersController
    participant SRV as OrderServices
    participant DB as SQL Database

    SPA->>API: POST /checkout (JWT Attached)
    API->>API: Assert Authorization Policy
    API->>SRV: Dispatch Checkout(userId)
    SRV->>DB: Query Cart + Inventory Locks
    
    alt Verification Failure (No Stock)
        SRV-->>API: Result.BadRequest()
        API-->>SPA: HTTP 400
    else Verification Success
        SRV->>DB: Mutate Stock, Create Order, Flush Cart
        SRV-->>API: Result.Ok(orderId)
        API-->>SPA: HTTP 200 { id }
    end
```

---

## 💾 Relational Data Topography

```mermaid
erDiagram
    User ||--|| UserDetails : configures
    User ||--o{ Order : authorizes
    User ||--o{ CartItem : stages
    Category ||--o{ Product : categorizes
    Product ||--o{ CartItem : instantiates
    Product ||--o{ OrderItem : fulfills
    Order ||--o{ OrderItem : aggregates

    User {
        int Id PK
        string Username
        int Role
    }
    Product {
        int Id PK
        double Price
        int Stock
        int Status
    }
    Order {
        int Id PK
        int Status
        double TotalAmount
    }
```

> [!TIP]
> **Architectural Decisions:**
> 1. **Result Pattern**: Eliminates exception-driven flow control.
> 2. **Vertical Slice Services**: Forces thin controllers.
> 3. **Stateless JWT**: Completely decouples session memory from server instances.

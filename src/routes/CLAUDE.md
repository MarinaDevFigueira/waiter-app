# Routes Module

Módulo de rotas usando TanStack Router com file-based routing.

## Estrutura

```
src/routes/
├── __root.tsx                     # Root route (SplashScreen + Outlet)
├── index.tsx                      # Home route (/) - Profile-based routing
├── login.tsx                      # Login page route
├── dashboard/                     # Dashboard routes (admin/kitchen)
│   ├── index.tsx                  # Dashboard home
│   ├── products.tsx               # Products listing
│   ├── categories.tsx             # Categories listing
│   └── products/
│       └── categories.tsx         # Nested categories page
└── __tests__/                     # Route tests
```

## TanStack Router

Este projeto usa **TanStack Router v1** com file-based routing.

### Conceitos Principais

1. **File-based Routes** - Arquivos em `src/routes/` viram rotas automaticamente
2. **Code Splitting** - Cada rota é code-split automaticamente
3. **Type Safety** - Rotas são type-safe com TypeScript
4. **Route Tree** - `routeTree.gen.ts` é auto-gerado pelo Vite plugin

## Padrões de Rotas

### Root Route (`__root.tsx`)

Route raiz que renderiza SplashScreen e Outlet para child routes:

```tsx
import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { SplashScreen } from "@/components/splash-screen/splash-screen";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <React.Fragment>
      <SplashScreen />
      <Outlet />
    </React.Fragment>
  );
}
```

**IMPORTANTE:** `__root.tsx` usa **duplo underscore** (`__`).

### Index Routes

Rotas index são acessadas pelo caminho base:

```tsx
// src/routes/index.tsx -> rota "/"
// src/routes/dashboard/index.tsx -> rota "/dashboard"

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return <div>Home Page</div>;
}
```

### Dynamic Routes

Rotas dinâmicas usam prefixo `$`:

```tsx
// src/routes/products/$productId.tsx -> "/products/:productId"

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/products/$productId")({
  component: ProductDetail,
});

function ProductDetail() {
  const { productId } = Route.useParams();
  return <div>Product: {productId}</div>;
}
```

### Layout Routes

Rotas de layout usam prefixo `_`:

```tsx
// src/routes/_authenticated.tsx

import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
  component: () => <Outlet />,
});
```

## Protected Routes

### Using beforeLoad

**SEMPRE** usar `beforeLoad` para proteção de rotas:

```tsx
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: ({ context, location }) => {
    const isAuthenticated = context.auth.isAuthenticated;
    const notAuthenticated = !isAuthenticated;
    if (notAuthenticated) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: DashboardPage,
});
```

### Router Context

Context é passado para todas as rotas via router:

```tsx
// src/main.tsx
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { useAuth } from "@/shared/hooks/useAuth";

const router = createRouter({
  routeTree,
  context: {
    auth: undefined!,
  },
});

function App() {
  const auth = useAuth();

  return (
    <RouterProvider router={router} context={{ auth }} />
  );
}
```

## Profile-Based Routing

**IMPORTANTE:** Todos os perfis compartilham a mesma rota `/` mas renderizam conteúdo diferente.

### Implementação

```tsx
// src/routes/index.tsx
import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/shared/hooks/useAuth";
import { FoodsPage } from "@/pages/foods/page";
import { KitchenPage } from "@/pages/kitchen/page";
import { DashboardPage } from "@/pages/dashboard/page";
import { USER_PROFILES } from "@/shared/constants/user-profile";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const { profile } = useAuth();

  if (profile === USER_PROFILES.CUSTOMER) {
    return <FoodsPage />;
  }

  if (profile === USER_PROFILES.KITCHEN) {
    return <KitchenPage />;
  }

  if (profile === USER_PROFILES.ADMIN) {
    return <DashboardPage />;
  }

  return <div>Perfil desconhecido</div>;
}
```

### Proteção com Profile Sync

```tsx
import { createFileRoute, redirect } from "@tanstack/react-router";
import { authObservable } from "@/shared/subjects/auth";
import { USER_PROFILES } from "@/shared/constants/user-profile";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: ({ context }) => {
    const auth = authObservable.getValue();
    const isAdmin = auth?.profile === USER_PROFILES.ADMIN;
    const notAdmin = !isAdmin;

    if (notAdmin) {
      throw redirect({ to: "/" });
    }
  },
  component: DashboardPage,
});
```

## Navigation

### Link Component

Use `<Link>` para navegação com user interaction:

```tsx
import { Link } from "@tanstack/react-router";

<Link to="/dashboard" className="text-primary hover:underline">
  Dashboard
</Link>

// Com search params
<Link
  to="/products"
  search={{ page: 1, size: 10 }}
>
  Products
</Link>

// Com params
<Link
  to="/products/$productId"
  params={{ productId: "123" }}
>
  Product 123
</Link>
```

### useNavigate Hook

Use `useNavigate()` para navegação programática:

```tsx
import { useNavigate } from "@tanstack/react-router";

function MyComponent() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate({ to: "/dashboard" });
  };

  const handleWithSearch = () => {
    navigate({
      to: "/products",
      search: { page: 2 },
    });
  };

  return <button onClick={handleClick}>Go to Dashboard</button>;
}
```

### NUNCA usar window.location

```tsx
// ❌ INCORRETO
window.location.href = "/dashboard";

// ✅ CORRETO
navigate({ to: "/dashboard" });
```

## Not Found Handling

### defaultNotFoundComponent

Configure no router:

```tsx
// src/main.tsx
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { DefaultNotFound } from "@/components/default-not-found/default-not-found";

const router = createRouter({
  routeTree,
  defaultNotFoundComponent: () => <DefaultNotFound />,
});
```

**IMPORTANTE:** `notFoundComponent` DEVE ser uma função `() => <Component />`, NÃO uma referência de componente.

```tsx
// ✅ CORRETO
defaultNotFoundComponent: () => <DefaultNotFound />

// ❌ INCORRETO
defaultNotFoundComponent: DefaultNotFound
```

## Layout with Outlet

Parent routes DEVEM usar `<Outlet />` para renderizar child routes:

```tsx
// src/routes/dashboard.tsx
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/layouts/dashboard-layout/dashboard-layout";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayoutRoute,
});

function DashboardLayoutRoute() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}
```

## Pathname Normalization

**SEMPRE** remover trailing slashes antes de route matching:

```tsx
import { useLocation } from "@tanstack/react-router";

function MyComponent() {
  const location = useLocation();
  const pathname = location.pathname;

  const normalizedPathname = pathname.endsWith("/") && pathname !== "/"
    ? pathname.slice(0, -1)
    : pathname;

  // Usar normalizedPathname para matching
  const isActive = normalizedPathname === "/dashboard";
}
```

## Route Params

### useParams Hook

```tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/products/$productId")({
  component: ProductDetail,
});

function ProductDetail() {
  const { productId } = Route.useParams();

  return <div>Product ID: {productId}</div>;
}
```

### useSearch Hook

```tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/products")({
  component: ProductsList,
});

function ProductsList() {
  const search = Route.useSearch();
  const page = search.page || 1;
  const size = search.size || 10;

  return <div>Page {page}, Size {size}</div>;
}
```

## Testing

Testes de rotas em `src/routes/__tests__/`:

```javascript
// src/routes/__tests__/index.spec.js
import { test, expect } from "@playwright/test";

test.describe("Home Route", () => {
  test("should redirect to login when not authenticated", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL("/login");
  });

  test("should show foods page for customer profile", async ({ page }) => {
    await page.goto("/login");
    await page.getByTestId("email-input").fill("customer@example.com");
    await page.getByTestId("password-input").fill("password");
    await page.getByTestId("login-button").click();

    await expect(page).toHaveURL("/");
    await expect(page.getByText("Bem vindo ao WAITERAPP")).toBeVisible();
  });
});
```

## Route Generation

`routeTree.gen.ts` é **auto-gerado** pelo Vite plugin `@tanstack/router-plugin`.

**NUNCA** editar manualmente este arquivo.

```json
// vite.config.js
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

export default defineConfig({
  plugins: [
    TanStackRouterVite(),
    react(),
  ],
});
```

## Exemplos Completos

### Exemplo: Protected Admin Route

```tsx
// src/routes/dashboard/products.tsx
import { createFileRoute, redirect } from "@tanstack/react-router";
import { authObservable } from "@/shared/subjects/auth";
import { USER_PROFILES } from "@/shared/constants/user-profile";
import { ProductsPage } from "@/pages/products/page";

export const Route = createFileRoute("/dashboard/products")({
  beforeLoad: () => {
    const auth = authObservable.getValue();
    const isAdmin = auth?.profile === USER_PROFILES.ADMIN;
    const notAdmin = !isAdmin;

    if (notAdmin) {
      throw redirect({ to: "/" });
    }
  },
  component: ProductsPage,
});
```

### Exemplo: Route with Search Params

```tsx
// src/routes/products.tsx
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const productsSearchSchema = z.object({
  page: z.number().optional(),
  size: z.number().optional(),
  search: z.string().optional(),
});

export const Route = createFileRoute("/products")({
  validateSearch: productsSearchSchema,
  component: ProductsPage,
});

function ProductsPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const handlePageChange = (newPage: number) => {
    navigate({
      search: (prev) => ({ ...prev, page: newPage }),
    });
  };

  return (
    <div>
      <h1>Products - Page {search.page || 1}</h1>
    </div>
  );
}
```

### Exemplo: Nested Routes

```
src/routes/dashboard/
├── index.tsx           # /dashboard
├── products.tsx        # /dashboard/products
└── products/
    └── categories.tsx  # /dashboard/products/categories
```

```tsx
// src/routes/dashboard/products/categories.tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/products/categories")({
  component: ProductCategoriesPage,
});

function ProductCategoriesPage() {
  return <div>Product Categories</div>;
}
```

## Referências

- TanStack Router Docs: https://tanstack.com/router
- File-based Routing: https://tanstack.com/router/latest/docs/framework/react/guide/file-based-routing
- Route Protection: https://tanstack.com/router/latest/docs/framework/react/guide/authenticated-routes

# Shared Module

Módulo de código compartilhado do waiter-app contendo subjects RxJS, hooks, schemas, constantes, enums, utilitários e API client.

## Estrutura

```
src/shared/
├── subjects/       # RxJS BehaviorSubjects para state management
├── hooks/          # Custom React hooks
├── schemas/        # Zod schemas para validação
├── constants/      # Constantes compartilhadas
├── enums/          # TypeScript enums
├── mocks/          # Mock data para desenvolvimento
├── api/            # API client com token refresh
├── translations/   # Arquivos de tradução i18n
└── utils/          # Utilitários compartilhados
```

## State Management (RxJS Subjects)

### Padrão BehaviorSubject Encapsulado

**SEMPRE** encapsular BehaviorSubjects para controlar acesso:

```typescript
// src/shared/subjects/foods.ts
import { BehaviorSubject, type Subscription } from "rxjs";

const foodsSubject = new BehaviorSubject<FoodItem[]>([]);

export const foodsObservable = {
  subscribe: (callback: (value: FoodItem[]) => void): Subscription =>
    foodsSubject.subscribe(callback),
  getValue: (): FoodItem[] => foodsSubject.getValue(),
  setFoods: (foods: FoodItem[]): void => foodsSubject.next(foods),
};
```

### Subjects Disponíveis

- **auth.ts** - Estado de autenticação (user, profile, token)
- **cart.subject.ts** - Carrinho de compras e order session
- **categories.ts** - Categorias de produtos
- **foods.ts** - Produtos/foods (legacy, migrar para products)
- **kitchen-orders.subject.ts** - Pedidos da cozinha
- **language.subject.ts** - Idioma selecionado
- **order.ts** - Pedido atual
- **orders-view.subject.ts** - Visualização de pedidos (grid/table)
- **products-filters.subject.ts** - Filtros de produtos
- **theme.ts** - Tema claro/escuro

### Subscription Cleanup

**SEMPRE** fazer unsubscribe no cleanup do useEffect:

```typescript
useEffect(() => {
  const subscription = foodsObservable.subscribe(setFoods);
  return () => subscription.unsubscribe();
}, []);
```

## Custom Hooks

### Hooks Disponíveis

- **useAuth.ts** - Hook de autenticação (`auth`, `isAuthenticated`, `profile`)
- **useCart.ts** - Hook do carrinho (`cart`, `addItem`, `removeItem`, `itemCount`)
- **useCategories.ts** - Hook de categorias com paginação e filtros
- **useCategory.ts** - Hook para categoria individual
- **useFoodsFilter.ts** - Hook de filtros de produtos (legacy)
- **useLanguage.ts** - Hook de idioma (`language`, `setLanguage`, `addLanguagePrefix`)
- **useMediaQuery.ts** - Hook para media queries responsivas
- **useOrders.ts** - Hook de pedidos com paginação
- **useOrdersView.ts** - Hook de visualização de pedidos (grid/table)
- **useOrderSessionOrders.ts** - Hook de pedidos da session
- **usePagination.ts** - Hook de paginação reutilizável
- **useProducts.ts** - Hook de produtos com paginação e filtros
- **useTheme.ts** - Hook de tema (`theme`, `setTheme`)
- **useTranslation.ts** - Hook de tradução (`t`, `language`)

### Exemplo: useAuth Hook

```typescript
// src/shared/hooks/useAuth.ts
import { useEffect, useState } from "react";
import { authObservable, type AuthData } from "@/shared/subjects/auth";

interface UseAuthReturn {
  auth: AuthData | null;
  isAuthenticated: boolean;
  profile: string | null;
}

export function useAuth(): UseAuthReturn {
  const [auth, setAuthState] = useState<AuthData | null>(authObservable.getValue());

  useEffect(() => {
    const subscription = authObservable.subscribe(setAuthState);
    return () => subscription.unsubscribe();
  }, []);

  const isAuthenticated = auth !== null;
  const profile = auth?.profile ?? null;

  return { auth, isAuthenticated, profile };
}
```

### Exemplo: useTranslation Hook

```typescript
import { useTranslation } from "@/shared/hooks/useTranslation";

function MyComponent() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("foods.welcome")}</h1>
      <p>{t("orders.noResults", { query: searchQuery })}</p>
    </div>
  );
}
```

### Exemplo: usePagination Hook

```typescript
import { usePagination } from "@/shared/hooks/usePagination";
import { Pagination } from "@/components/ui/pagination/pagination";

function ProductsList() {
  const pagination = usePagination({
    page: 1,
    size: 10,
    total: 100,
    totalPages: 10,
    hasNextPage: true,
    hasPreviousPage: false,
    onPageChange: (newPage) => console.log(newPage),
  });

  return (
    <Pagination>
      <Pagination.Info {...pagination} />
      <Pagination.Controls {...pagination} />
    </Pagination>
  );
}
```

## Schemas (Zod Validation)

### Base Entity Pattern

**SEMPRE** estender `baseEntitySchema` para entidades de domínio:

```typescript
// src/shared/schemas/base-entity.schema.ts
import { z } from "zod";

export const baseEntitySchema = z.object({
  id: z.string(),
  active: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  createdBy: z.string(),
  updatedBy: z.string(),
  deletedAt: z.date().nullable(),
  deletedBy: z.string().nullable(),
});

export const baseEntityDefaults = {
  active: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: "system",
  updatedBy: "system",
  deletedAt: null,
  deletedBy: null,
};
```

### Schemas Disponíveis

- **base-entity.schema.ts** - Schema base para todas as entidades
- **category.schema.ts** - Schema de categoria com translations
- **product.schema.ts** - Schema de produto com images e translations
- **order.schema.ts** - Schema de pedido

### Exemplo: Product Schema

```typescript
// src/shared/schemas/product.schema.ts
import { z } from "zod";
import { baseEntitySchema } from "./base-entity.schema";

export const productSchema = baseEntitySchema.extend({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  categoryId: z.string(),
  price: z.number().positive(),
  stock: z.number().int().min(0),
  unit: z.enum(["un", "kg", "g", "ml", "l"]),
  images: z.array(z.object({
    id: z.string(),
    url: z.string().url(),
  })).optional(),
});

export type Product = z.infer<typeof productSchema>;
```

## Constants

Constantes compartilhadas do projeto.

### Constantes Disponíveis

- **storage-keys.ts** - Chaves do localStorage
- **route-map.ts** - Mapeamento de rotas
- **user-profile.ts** - Perfis de usuário (CUSTOMER, KITCHEN, ADMIN)
- **splash.ts** - Configurações da splash screen

### Exemplo: Storage Keys

```typescript
// src/shared/constants/storage-keys.ts
export const STORAGE_KEYS = {
  AUTH_TOKEN: "waiter_auth_token",
  USER_PROFILE: "waiter_user_profile",
  THEME: "waiter_theme",
  LANGUAGE: "waiter_language",
} as const;
```

## Enums

TypeScript enums para type safety.

### Enums Disponíveis

- **translations.enum.ts** - Idiomas suportados (PT_BR, EN_US, ES)
- **sort-direction.enum.ts** - Direção de ordenação (ASC, DESC)
- **products-order-by.enum.ts** - Campos de ordenação de produtos
- **categories-order-by.enum.ts** - Campos de ordenação de categorias
- **orders-order-by.enum.ts** - Campos de ordenação de pedidos
- **orders-view.enum.ts** - Visualização de pedidos (GRID, TABLE)
- **product-status.enum.ts** - Status de produto (ACTIVE, INACTIVE)

### Exemplo: Translations Enum

```typescript
// src/shared/enums/translations.enum.ts
export enum TranslationsEnum {
  PT_BR = "pt-BR",
  EN_US = "en-US",
  ES = "es",
}

export type TranslationLanguage =
  | TranslationsEnum.PT_BR
  | TranslationsEnum.EN_US
  | TranslationsEnum.ES;
```

## API Client

### API Client com Token Refresh

HTTP client com refresh automático de token antes das requests:

```typescript
// src/shared/api/api-client.ts
import { cookies } from "@/lib/cookies";

const API_URL = import.meta.env.VITE_API_URL;

export const api = {
  async get<T>(endpoint: string): Promise<{ data: T } | { error: string }> {
    await refreshTokenIfNeeded();
    const response = await fetch(`${API_URL}${endpoint}`, {
      credentials: "include",
    });
    return handleResponse(response);
  },

  async post<T>(endpoint: string, body: unknown): Promise<{ data: T } | { error: string }> {
    await refreshTokenIfNeeded();
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: "include",
    });
    return handleResponse(response);
  },

  async postFormData<T>(endpoint: string, formData: FormData): Promise<{ data: T } | { error: string }> {
    await refreshTokenIfNeeded();
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });
    return handleResponse(response);
  },

  // put, delete, etc...
};
```

### Uso do API Client

**SEMPRE** usar o client de `@/services/api.ts` (re-export do api-client):

```typescript
import { api } from "@/services/api";

const result = await api.get<Product[]>("/products");
const hasError = "error" in result;
if (hasError) {
  return { error: result.error };
}
return { data: result.data };
```

## Translations (i18n)

Arquivos de tradução multi-idioma.

### Estrutura de Traduções

```
src/shared/translations/
├── pt-BR.json
├── en-US.json
└── es.json
```

### Padrão de Traduções

**CRÍTICO:** Todos os arquivos DEVEM ter estrutura de chaves idêntica:

```json
// pt-BR.json
{
  "auth": {
    "login": "Entrar",
    "logout": "Sair"
  },
  "foods": {
    "welcome": "Bem-vindo ao WAITERAPP"
  }
}

// en-US.json
{
  "auth": {
    "login": "Login",
    "logout": "Logout"
  },
  "foods": {
    "welcome": "Welcome to WAITERAPP"
  }
}
```

### Query Cache Invalidation

**SEMPRE** incluir language prefix nas query keys:

```typescript
const { addLanguagePrefix } = useLanguage();

const { data } = useQuery({
  queryKey: addLanguagePrefix("products", queryParams),
  queryFn: () => fetchProducts(queryParams),
});

// Invalidação
queryClient.invalidateQueries({
  queryKey: addLanguagePrefix("products"),
});
```

## Utils

Utilitários compartilhados.

### translations.ts

Utilitários para i18n:

```typescript
import { getTranslation } from "@/shared/utils/translations";

const translation = getTranslation("pt-BR", "foods.welcome");
```

## Mock Data

Mock data para desenvolvimento em `src/shared/mocks/`:

- **foods.ts** - Mock de produtos (legacy)
- **products.ts** - Mock de produtos
- **categories.ts** - Mock de categorias
- **kitchen-orders.ts** - Mock de pedidos da cozinha
- **users.ts** - Mock de usuários
- **pizzas.ts** - Mock de pizzas (legacy)

### Padrão de Mock Data

Mock data DEVE seguir exatamente os Zod schemas:

```typescript
import { productSchema } from "@/shared/schemas/product.schema";

export const mockProducts: z.infer<typeof productSchema>[] = [
  {
    id: "1",
    name: "Pizza Margherita",
    description: "Molho de tomate, mussarela e manjericão",
    categoryId: "cat-1",
    price: 45.90,
    stock: 10,
    unit: "un",
    images: [{ id: "img-1", url: "https://example.com/pizza.jpg" }],
    active: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    createdBy: "system",
    updatedBy: "system",
    deletedAt: null,
    deletedBy: null,
  },
];
```

## Testing

Testes em `src/shared/hooks/__tests__/` usando Playwright:

```javascript
// src/shared/hooks/__tests__/useAuth.spec.js
import { test, expect } from "@playwright/test";

test.describe("useAuth Hook", () => {
  test("should return authenticated state", async ({ page }) => {
    await page.goto("/test-auth");
    const status = page.getByTestId("auth-status");
    await expect(status).toHaveText("Authenticated: true");
  });
});
```

## Dependências

- **rxjs** - Reactive state management
- **zod** - Schema validation
- **@tanstack/react-query** - Data fetching (usado nos hooks)

## Referências

- RxJS: https://rxjs.dev
- Zod: https://zod.dev
- TanStack Query: https://tanstack.com/query

# Services Module

Camada de serviços do waiter-app responsável por comunicação com a API backend.

## Estrutura

```
src/services/
├── api.ts                    # Re-export do API client
├── auth/
│   └── auth.service.ts       # Serviço de autenticação
├── business/
│   ├── business.service.ts
│   └── interfaces/
│       └── business.interface.ts
├── business-limits/
│   ├── business-limits.service.ts
│   └── interfaces/
│       └── business-limits.interface.ts
├── business-settings/
│   ├── business-settings.service.ts
│   └── interfaces/
│       └── business-settings.interface.ts
├── categories/
│   ├── categories.service.ts
│   └── interfaces/
│       └── categories.interface.ts
├── orders/
│   ├── orders.service.ts
│   └── interfaces/
│       └── orders.interface.ts
├── order-sessions/
│   ├── order-sessions.service.ts
│   └── interfaces/
│       └── order-sessions.interface.ts
├── permissions/
│   ├── permissions.service.ts
│   └── interfaces/
│       └── permissions.interface.ts
├── products/
│   ├── products.service.ts
│   └── interfaces/
│       └── products.interface.ts
└── users/
    ├── users.service.ts
    └── interfaces/
        └── users.interface.ts
```

## Padrões de Serviços

### 1. Service Result Pattern

**TODOS** os métodos de serviço DEVEM retornar `ServiceResult<T>`:

```typescript
type ServiceSuccess<T> = { data: T };
type ServiceError = { error: string };
type ServiceResult<T> = ServiceSuccess<T> | ServiceError;
```

### 2. TypeScript Interfaces (No Zod)

**SEMPRE** usar TypeScript interfaces para tipagem. **NUNCA** usar Zod na camada de services.

Interfaces DEVEM seguir a convenção de nomenclatura:
- `GetXxxResponse` - Resposta de GET
- `GetXxxRequestQuery` - Query params de GET
- `CreateXxxRequestBody` - Body de POST
- `UpdateXxxRequestBody` - Body de PUT/PATCH
- `DeleteXxxResponse` - Resposta de DELETE

```typescript
// src/services/products/interfaces/products.interface.ts
export interface GetAllProductsRequestQuery {
  page: number;
  size: number;
  orderBy: string;
  direction: "asc" | "desc";
  search?: string;
  categoryId?: string;
}

export interface GetAllProductsResponse {
  items: Product[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface GetProductByIdResponse {
  id: string;
  name: string;
  description: string | null;
  categoryId: string;
  price: number;
  stock: number;
  unit: "un" | "kg" | "g" | "ml" | "l";
  images: Array<{ id: string; url: string }>;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequestBody {
  translations: Record<string, { name: string; description?: string }>;
  categoryId: string;
  price: number;
  stock: number;
  unit: string;
  active: boolean;
}
```

### 3. Error Handling Pattern

**SEMPRE** isolar operações em try-catch e retornar `{ data }` ou `{ error }`:

```typescript
import type { GetAllProductsResponse, GetAllProductsRequestQuery } from "./interfaces/products.interface";

async getAll(params: GetAllProductsRequestQuery): Promise<ServiceResult<GetAllProductsResponse>> {
  try {
    const result = await api.get<GetAllProductsResponse>("/products", { params });

    const hasError = "error" in result;
    if (hasError) {
      return { error: result.error };
    }

    return { data: result.data };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Erro ao buscar produtos";
    logger.error(errorMessage, error instanceof Error ? error : null);
    return { error: errorMessage };
  }
}
```

### 4. Write Operations Return Void

Operações create/update/delete DEVEM retornar `Promise<ServiceResult<void>>`:

```typescript
import type { CreateProductRequestBody } from "./interfaces/products.interface";

async create(data: CreateProductRequestBody): Promise<ServiceResult<void>> {
  try {
    const result = await api.post<void>("/products", data);

    const hasError = "error" in result;
    if (hasError) {
      return { error: result.error };
    }

    return { data: undefined };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Erro ao criar produto";
    logger.error(errorMessage, error instanceof Error ? error : null);
    return { error: errorMessage };
  }
}
```

**IMPORTANTE:** Chamador DEVE invalidar cache manualmente:

```typescript
const result = await productsService.create(data);
const hasError = "error" in result;
if (hasError) {
  toast.error(result.error);
  return;
}

queryClient.invalidateQueries({ queryKey: ["products"] });
toast.success("Produto criado!");
```

### 5. Interface File Structure

Interfaces DEVEM estar em `interfaces/service-name.interface.ts`:

```
src/services/products/
├── products.service.ts
└── interfaces/
    └── products.interface.ts
```

## Products Service

Serviço de gerenciamento de produtos.

### Métodos

```typescript
export const productsService = {
  async getAll(params: GetAllProductsRequestQuery): Promise<ServiceResult<GetAllProductsResponse>>,
  async getById(productId: string): Promise<ServiceResult<GetProductByIdResponse>>,
  async create(data: CreateProductRequestBody, files?: File[]): Promise<ServiceResult<void>>,
  async update(productId: string, data: UpdateProductRequestBody, files?: File[]): Promise<ServiceResult<void>>,
  async delete(productId: string): Promise<ServiceResult<DeleteProductResponse>>,
  async deleteFile(productId: string, fileId: string): Promise<ServiceResult<void>>,
  async getTranslations(productId: string): Promise<ServiceResult<GetProductTranslationsResponse>>,
};
```

### FormData para Upload

```typescript
function buildProductFormData(data: CreateProductRequestBody, files: File[]): FormData {
  const formData = new FormData();

  const translationsJson = JSON.stringify(data.translations);
  formData.append("translations", translationsJson);

  formData.append("categoryId", data.categoryId);
  formData.append("price", data.price.toString());
  formData.append("stock", data.stock.toString());
  formData.append("unit", data.unit);
  formData.append("active", data.active.toString());

  files.forEach((file) => {
    formData.append("files", file);
  });

  return formData;
}

const formData = buildProductFormData(data, files);
const result = await api.postFormData<void>("/products", formData);
```

## Categories Service

Serviço de gerenciamento de categorias.

### Métodos

```typescript
export const categoriesService = {
  async getAll(params: GetAllCategoriesRequestQuery): Promise<ServiceResult<GetAllCategoriesResponse>>,
  async getById(categoryId: string): Promise<ServiceResult<GetCategoryByIdResponse>>,
  async create(data: CreateCategoryRequestBody): Promise<ServiceResult<void>>,
  async update(categoryId: string, data: UpdateCategoryRequestBody): Promise<ServiceResult<void>>,
  async delete(categoryId: string): Promise<ServiceResult<DeleteCategoryResponse>>,
  async getTranslations(categoryId: string): Promise<ServiceResult<GetCategoryTranslationsResponse>>,
};
```

### Exemplo de Uso

```typescript
import { categoriesService } from "@/services/categories/categories.service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

function useCategories() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["categories", { page: 1, size: 10 }],
    queryFn: async () => {
      const result = await categoriesService.getAll({
        page: 1,
        size: 10,
        orderBy: "sortOrder",
        direction: "asc",
      });

      const hasError = "error" in result;
      if (hasError) {
        throw new Error(result.error);
      }

      return result.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: CreateCategoryRequestBody) => {
      const result = await categoriesService.create(data);
      const hasError = "error" in result;
      if (hasError) {
        throw new Error(result.error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Categoria criada!");
    },
  });

  return { categories: data?.items ?? [], isLoading, createMutation };
}
```

## Orders Service

Serviço de gerenciamento de pedidos.

### Métodos

```typescript
export const ordersService = {
  async getAll(params: GetAllOrdersRequestQuery): Promise<ServiceResult<GetAllOrdersResponse>>,
  async getById(orderId: string): Promise<ServiceResult<GetOrderByIdResponse>>,
  async updateStatus(orderId: string, status: string): Promise<ServiceResult<void>>,
};
```

## Order Sessions Service

Serviço de sessões de pedido (mesas).

### Métodos

```typescript
export const orderSessionsService = {
  async create(tableNumber: string): Promise<ServiceResult<CreateOrderSessionResponse>>,
  async addItem(sessionId: string, item: AddItemRequestBody): Promise<ServiceResult<void>>,
  async confirmOrder(sessionId: string): Promise<ServiceResult<void>>,
  async getOrders(sessionId: string): Promise<ServiceResult<GetSessionOrdersResponse>>,
  async close(sessionId: string): Promise<ServiceResult<void>>,
};
```

## Auth Service

Serviço de autenticação.

### Métodos

```typescript
export const authService = {
  async login(credentials: LoginRequestBody): Promise<ServiceResult<LoginResponse>>,
  async logout(): Promise<ServiceResult<void>>,
  async refreshToken(): Promise<ServiceResult<RefreshTokenResponse>>,
  async verify(): Promise<ServiceResult<VerifyResponse>>,
};
```

### Exemplo: Login Flow

```typescript
import { authService } from "@/services/auth/auth.service";
import { authObservable } from "@/shared/subjects/auth";
import { useNavigate } from "@tanstack/react-router";

async function handleLogin(credentials: LoginRequestBody) {
  const result = await authService.login(credentials);
  const hasError = "error" in result;

  if (hasError) {
    toast.error(result.error);
    logger.error("Login falhou", new Error(result.error));
    return;
  }

  authObservable.setAuth(result.data);
  toast.success("Login realizado com sucesso!");
  navigate({ to: "/" });
}
```

## API Client

Todos os services usam o API client de `@/services/api.ts`:

```typescript
export { api } from "@/shared/api/api-client";
```

### Métodos do API Client

```typescript
export const api = {
  async get<T>(endpoint: string): Promise<{ data: T } | { error: string }>,
  async post<T>(endpoint: string, body: unknown): Promise<{ data: T } | { error: string }>,
  async patch<T>(endpoint: string, body: unknown): Promise<{ data: T } | { error: string }>,
  async put<T>(endpoint: string, body: unknown): Promise<{ data: T } | { error: string }>,
  async delete<T>(endpoint: string): Promise<{ data: T } | { error: string }>,
  async postFormData<T>(endpoint: string, formData: FormData): Promise<{ data: T } | { error: string }>,
  async putFormData<T>(endpoint: string, formData: FormData): Promise<{ data: T } | { error: string }>,
};
```

### Automatic Token Refresh

API client automaticamente refresha token antes de cada request:

```typescript
async function refreshTokenIfNeeded() {
  const token = cookies.get("auth_token");
  if (!token) return;

  const decoded = jwt.decode(token);
  const isExpiring = decoded.exp - Date.now() / 1000 < 300;

  if (isExpiring) {
    await authService.refreshToken();
  }
}
```

### Credentials: Include

Todas as requests enviam cookies automaticamente:

```typescript
const response = await fetch(`${API_URL}${endpoint}`, {
  credentials: "include",
});
```

## Padrões de Uso

### 1. Sempre Usar TypeScript Interfaces

```typescript
// ✅ CORRETO
import type { GetAllProductsResponse } from "./interfaces/products.interface";
const result = await api.get<GetAllProductsResponse>("/products");
return { data: result.data };

// ❌ INCORRETO - Nunca usar Zod na camada de services
import { apiProductSchema } from "./products.schema";
const parsed = apiProductSchema.safeParse(result.data);
```

### 2. Sempre Logar Erros

```typescript
// ✅ CORRETO
logger.error("[productsService.getAll] Erro ao buscar", error instanceof Error ? error : null);

// ❌ INCORRETO
console.error(error);
```

### 3. Invalidar Cache Manualmente

```typescript
// ✅ CORRETO
const result = await productsService.create(data);
if ("error" in result) {
  toast.error(result.error);
  return;
}
queryClient.invalidateQueries({ queryKey: ["products"] });

// ❌ INCORRETO
const result = await productsService.create(data);
```

### 4. No Client-Side Filtering

```typescript
// ❌ INCORRETO
const allProducts = await productsService.getAll({ page: 1, size: 1000 });
const filtered = allProducts.items.filter(p => p.name.includes(search));

// ✅ CORRETO
const result = await productsService.getAll({
  page: 1,
  size: 10,
  search,
});
```

## Testing

Services são testados indiretamente através dos hooks e páginas que os utilizam.

## Dependências

- **@/shared/api/api-client** - HTTP client com token refresh
- **@/lib/logger** - Logging estruturado

## Referências

- API Client: `src/shared/api/api-client.ts`
- Logger: `src/lib/logger.ts`
- API Docs: `http://localhost:3000/api/docs`

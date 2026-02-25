# Services Module

Camada de serviços do waiter-app responsável por comunicação com a API backend.

## Estrutura

```
src/services/
├── api.ts                    # Re-export do API client
├── auth/
│   └── auth.service.ts       # Serviço de autenticação
├── products/
│   ├── products.service.ts   # Serviço de produtos
│   └── products.schema.ts    # Schemas de API (co-located)
├── categories/
│   ├── categories.service.ts # Serviço de categorias
│   └── categories.schema.ts  # Schemas de API
├── orders/
│   ├── orders.service.ts     # Serviço de pedidos
│   └── orders.schema.ts      # Schemas de API
└── order-sessions/
    ├── order-sessions.service.ts # Serviço de sessões de pedido
    └── order-sessions.schema.ts  # Schemas de API
```

## Padrões de Serviços

### 1. Service Result Pattern

**TODOS** os métodos de serviço DEVEM retornar `ServiceResult<T>`:

```typescript
type ServiceSuccess<T> = { data: T };
type ServiceError = { error: string };
type ServiceResult<T> = ServiceSuccess<T> | ServiceError;
```

### 2. Error Handling Pattern

**SEMPRE** isolar operações em try-catch e retornar `{ data }` ou `{ error }`:

```typescript
async getAll(): Promise<ServiceResult<Product[]>> {
  try {
    const result = await api.get<unknown>("/products");

    const hasError = "error" in result;
    if (hasError) {
      return { error: result.error };
    }

    // Validação com Zod
    const parsed = apiProductListSchema.safeParse(result.data);
    if (!parsed.success) {
      const zodMessage = formatZodError(parsed.error);
      logger.error("[productsService.getAll] Erro de validação", new Error(zodMessage));
      return { error: "Resposta inválida do servidor" };
    }

    return { data: parsed.data };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Erro ao buscar produtos";
    logger.error(errorMessage, error instanceof Error ? error : null);
    return { error: errorMessage };
  }
}
```

### 3. Write Operations Return Void

Operações create/update/delete DEVEM retornar `Promise<ServiceResult<void>>`:

```typescript
async create(data: ProductForm): Promise<ServiceResult<void>> {
  try {
    const result = await api.post<unknown>("/products", data);

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

// Invalidar cache após sucesso
queryClient.invalidateQueries({ queryKey: ["products"] });
toast.success("Produto criado!");
```

### 4. Service Schemas (Co-located)

Schemas de API DEVEM estar em arquivos `*.schema.ts` no mesmo diretório do service:

```
src/services/products/
├── products.service.ts
└── products.schema.ts       # Schemas específicos da API
```

```typescript
// src/services/products/products.schema.ts
import { z } from "zod";

export const apiProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  categoryId: z.string(),
  price: z.number(),
  stock: z.number(),
  unit: z.enum(["un", "kg", "g", "ml", "l"]),
  images: z.array(z.union([
    z.string(),
    z.object({ id: z.string(), url: z.string() }),
  ])).optional(),
  active: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const apiProductListSchema = z.object({
  items: z.array(apiProductSchema),
  total: z.number(),
  page: z.number(),
  size: z.number(),
  totalPages: z.number(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
});

export type ApiProduct = z.infer<typeof apiProductSchema>;
export type PaginatedProducts = z.infer<typeof apiProductListSchema>;
```

### 5. Mapping API to Domain

**SEMPRE** mapear responses da API para schemas de domínio:

```typescript
import type { Product } from "@/shared/schemas/product.schema";
import { baseEntityDefaults } from "@/shared/schemas/base-entity.schema";

function mapApiProductToProduct(raw: ApiProduct): Product {
  return {
    ...baseEntityDefaults,
    id: raw.id,
    name: raw.name,
    description: raw.description ?? undefined,
    categoryId: raw.categoryId,
    price: raw.price,
    stock: raw.stock,
    unit: raw.unit as Product["unit"],
    images: (raw.images ?? []).map((img) => {
      const isString = typeof img === "string";
      if (isString) {
        const urlParts = img.split("/");
        const fileId = urlParts[urlParts.length - 1];
        return { id: fileId, url: img };
      }
      return { id: img.id, url: img.url };
    }),
    active: raw.active,
    createdAt: new Date(raw.createdAt),
    updatedAt: new Date(raw.updatedAt),
    createdBy: "api",
    updatedBy: "api",
    deletedAt: null,
    deletedBy: null,
  };
}
```

## Products Service

Serviço de gerenciamento de produtos.

### Métodos

```typescript
export const productsService = {
  // Listar produtos com paginação e filtros
  async getAll(queryParams: ProductQueryParams): Promise<ServiceResult<PaginatedProducts>>,

  // Buscar produto por ID
  async getById(productId: string): Promise<ServiceResult<Product>>,

  // Criar produto
  async create(data: ProductForm, files?: File[]): Promise<ServiceResult<void>>,

  // Atualizar produto
  async update(productId: string, data: ProductForm, files?: File[]): Promise<ServiceResult<void>>,

  // Deletar produto
  async delete(productId: string): Promise<ServiceResult<{ success: boolean; id: string }>>,

  // Deletar imagem do produto
  async deleteFile(productId: string, fileId: string): Promise<ServiceResult<void>>,

  // Buscar traduções do produto
  async getTranslations(productId: string): Promise<ServiceResult<ApiProductTranslations>>,
};
```

### Query Params Pattern

```typescript
export interface ProductQueryParams {
  page: number;
  size: number;
  orderBy: string;
  direction: "asc" | "desc";
  filters?: {
    search?: string;
    categoria?: string[];
    precoMin?: number;
    precoMax?: number;
    somenteEmEstoque?: boolean;
    estoqueMin?: number;
    status?: string[];
  };
}
```

### FormData para Upload

```typescript
function buildProductFormData(data: ProductForm, files: File[]): FormData {
  const formData = new FormData();

  const translationsJson = JSON.stringify(data.translations);
  formData.append("translations", translationsJson);

  formData.append("categoryId", data.categoryId);
  formData.append("price", data.price.toString());
  formData.append("stock", data.stock.toString());
  formData.append("unit", data.unit);
  formData.append("active", data.active.toString());

  // Append files
  files.forEach((file) => {
    formData.append("files", file);
  });

  return formData;
}

// Uso
const formData = buildProductFormData(data, files);
const result = await api.postFormData<unknown>("/products", formData);
```

## Categories Service

Serviço de gerenciamento de categorias.

### Métodos

```typescript
export const categoriesService = {
  // Listar categorias com paginação
  async getAll(queryParams: CategoryQueryParams): Promise<ServiceResult<PaginatedCategories>>,

  // Buscar categoria por ID
  async getById(categoryId: string): Promise<ServiceResult<Category>>,

  // Criar categoria
  async create(data: CategoryForm): Promise<ServiceResult<void>>,

  // Atualizar categoria
  async update(categoryId: string, data: CategoryForm): Promise<ServiceResult<void>>,

  // Deletar categoria
  async delete(categoryId: string): Promise<ServiceResult<{ success: boolean; id: string }>>,

  // Buscar traduções da categoria
  async getTranslations(categoryId: string): Promise<ServiceResult<ApiCategoryTranslations>>,
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
    mutationFn: async (data: CategoryForm) => {
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
  // Listar pedidos com paginação e filtros
  async getAll(queryParams: OrderQueryParams): Promise<ServiceResult<PaginatedOrders>>,

  // Buscar pedido por ID
  async getById(orderId: string): Promise<ServiceResult<Order>>,

  // Atualizar status do pedido
  async updateStatus(orderId: string, status: string): Promise<ServiceResult<void>>,
};
```

## Order Sessions Service

Serviço de sessões de pedido (mesas).

### Métodos

```typescript
export const orderSessionsService = {
  // Criar sessão de pedido
  async create(tableNumber: string): Promise<ServiceResult<{ sessionId: string }>>,

  // Adicionar item à sessão
  async addItem(sessionId: string, item: CartItem): Promise<ServiceResult<void>>,

  // Confirmar pedido
  async confirmOrder(sessionId: string): Promise<ServiceResult<void>>,

  // Listar pedidos da sessão
  async getOrders(sessionId: string): Promise<ServiceResult<Order[]>>,

  // Encerrar sessão
  async close(sessionId: string): Promise<ServiceResult<void>>,
};
```

### Exemplo: Carrinho com Order Session

```typescript
import { orderSessionsService } from "@/services/order-sessions/order-sessions.service";
import { cartObservable } from "@/shared/subjects/cart.subject";

async function addToCart(item: CartItem) {
  const cart = cartObservable.getValue();
  const sessionId = cart.orderSessionId;
  const noSession = !sessionId;

  if (noSession) {
    const createResult = await orderSessionsService.create("Mesa 1");
    const hasError = "error" in createResult;
    if (hasError) {
      toast.error(createResult.error);
      return;
    }
    cartObservable.setOrderSessionId(createResult.data.sessionId);
  }

  const addResult = await orderSessionsService.addItem(sessionId, item);
  const hasError = "error" in addResult;
  if (hasError) {
    toast.error(addResult.error);
    return;
  }

  toast.success("Item adicionado ao carrinho!");
}
```

## Auth Service

Serviço de autenticação.

### Métodos

```typescript
export const authService = {
  // Login
  async login(credentials: { email: string; password: string }): Promise<ServiceResult<AuthData>>,

  // Logout
  async logout(): Promise<ServiceResult<void>>,

  // Refresh token
  async refreshToken(): Promise<ServiceResult<{ token: string }>>,

  // Verificar autenticação
  async verify(): Promise<ServiceResult<AuthData>>,
};
```

### Exemplo: Login Flow

```typescript
import { authService } from "@/services/auth/auth.service";
import { authObservable } from "@/shared/subjects/auth";
import { useNavigate } from "@tanstack/react-router";

async function handleLogin(credentials: { email: string; password: string }) {
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
// src/services/api.ts
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
  const isExpiring = decoded.exp - Date.now() / 1000 < 300; // 5 minutos

  if (isExpiring) {
    await authService.refreshToken();
  }
}
```

### Credentials: Include

Todas as requests enviam cookies automaticamente:

```typescript
const response = await fetch(`${API_URL}${endpoint}`, {
  credentials: "include", // Envia cookies (user_language, auth_token)
});
```

## Padrões de Uso

### 1. Sempre Validar com Zod

```typescript
// ✅ CORRETO
const parsed = apiProductSchema.safeParse(result.data);
if (!parsed.success) {
  const zodMessage = formatZodError(parsed.error);
  logger.error("Validação falhou", new Error(zodMessage));
  return { error: "Resposta inválida do servidor" };
}
return { data: parsed.data };

// ❌ INCORRETO
return { data: result.data }; // Sem validação
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
// Cache não é invalidado
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
  filters: { search },
});
```

## Testing

Services são testados indiretamente através dos hooks e páginas que os utilizam.

## Dependências

- **@/shared/api/api-client** - HTTP client com token refresh
- **zod** - Schema validation
- **@/lib/logger** - Logging estruturado
- **@/lib/zod-errors** - Formatação de erros

## Referências

- API Client: `src/shared/api/api-client.ts`
- Logger: `src/lib/logger.ts`
- Zod: https://zod.dev

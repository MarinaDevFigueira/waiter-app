# Lib Module

Módulo de utilitários e helpers do waiter-app.

## Arquivos

```
src/lib/
├── utils.ts         # Utilitários gerais (cn, formatPrice)
├── logger.ts        # Sistema de logging
├── logger.example.ts # Exemplos de uso do logger
├── math.ts          # Utilitários matemáticos
├── cookies.ts       # Gerenciamento de cookies
└── zod-errors.ts    # Formatação de erros Zod
```

## utils.ts

Utilitários gerais do projeto.

### cn() - Class Names Utility

Função para merge de classes CSS do Tailwind usando `clsx` e `tailwind-merge`:

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

**Uso:**

```jsx
import { cn } from "@/lib/utils";

<div className={cn(
  "base-class",
  isActive && "active-class",
  "text-primary"
)} />
```

### formatPrice()

Formata valores monetários em Real brasileiro:

```typescript
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
}
```

**Uso:**

```jsx
import { formatPrice } from "@/lib/utils";

const price = 45.90;
console.log(formatPrice(price)); // "R$ 45,90"
```

## logger.ts

Sistema de logging estruturado do projeto.

### API do Logger

```typescript
import { logger } from "@/lib/logger";

// Debug (somente em desenvolvimento)
logger.debug("Mensagem de debug", { userId: 123 });

// Info (informação geral)
logger.info("Usuário logado", { username: "john" });

// Warning (avisos não críticos)
logger.warn("API lenta", { duration: 3000 });

// Error (erros críticos)
logger.error("Falha ao buscar dados", error, { url: "/api/products" });
```

### Níveis de Log

- **debug** - Informações de debugging (somente dev)
- **info** - Informações gerais
- **warn** - Avisos não críticos
- **error** - Erros críticos que precisam atenção

### Padrão de Uso

**SEMPRE** usar logger para erros ao invés de `console.error`:

```typescript
// ✅ CORRETO
try {
  const result = await api.get("/products");
} catch (error) {
  const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
  logger.error("Erro ao buscar produtos", error instanceof Error ? error : null);
  return { error: errorMessage };
}

// ❌ INCORRETO
try {
  const result = await api.get("/products");
} catch (error) {
  console.error(error);
}
```

### Exemplo: Logger no Service

```typescript
import { logger } from "@/lib/logger";
import { api } from "@/services/api";

export const productsService = {
  async getAll(): Promise<ServiceResult<Product[]>> {
    try {
      const result = await api.get<Product[]>("/products");

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
  },
};
```

## math.ts

Utilitários matemáticos.

### Exemplo de Uso

```typescript
import { calculateTotal, percentage } from "@/lib/math";

const items = [{ price: 10, quantity: 2 }, { price: 20, quantity: 1 }];
const total = calculateTotal(items);

const discount = percentage(total, 10); // 10% de desconto
```

## cookies.ts

Gerenciamento de cookies HTTP.

### API de Cookies

```typescript
import { cookies } from "@/lib/cookies";

// Setar cookie
cookies.set("user_language", "pt-BR", 365); // 365 dias

// Obter cookie
const language = cookies.get("user_language"); // "pt-BR" ou null

// Remover cookie
cookies.remove("user_language");
```

### Implementação

```typescript
export const cookies = {
  set: (name: string, value: string, days = 365): void => {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/`;
  },

  get: (name: string): string | null => {
    const nameEQ = `${name}=`;
    const cookiesArray = document.cookie.split(";");
    for (let i = 0; i < cookiesArray.length; i++) {
      let cookie = cookiesArray[i];
      while (cookie.charAt(0) === " ") {
        cookie = cookie.substring(1, cookie.length);
      }
      if (cookie.indexOf(nameEQ) === 0) {
        return cookie.substring(nameEQ.length, cookie.length);
      }
    }
    return null;
  },

  remove: (name: string): void => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
  },
};
```

### Uso para Language Cookie

**SEMPRE** usar cookie `user_language` para enviar idioma ao backend:

```typescript
import { cookies } from "@/lib/cookies";

export function useLanguage() {
  const setLanguage = (language: string) => {
    localStorage.setItem("language", language);
    document.documentElement.lang = language;
    cookies.set("user_language", language); // Cookie para backend
  };

  return { setLanguage };
}
```

## zod-errors.ts

Formatação de erros Zod para mensagens legíveis.

### formatZodError()

Converte erros de validação Zod em string legível:

```typescript
import { formatZodError } from "@/lib/zod-errors";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("Email inválido"),
});

const result = schema.safeParse({ name: "ab", email: "invalid" });
if (!result.success) {
  const errorMessage = formatZodError(result.error);
  console.log(errorMessage);
  // "name: Nome deve ter no mínimo 3 caracteres; email: Email inválido"
}
```

### Uso no Service

```typescript
import { formatZodError } from "@/lib/zod-errors";
import { logger } from "@/lib/logger";
import { productSchema } from "@/shared/schemas/product.schema";

export const productsService = {
  async getById(id: string): Promise<ServiceResult<Product>> {
    try {
      const result = await api.get<unknown>(`/products/${id}`);

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      const parsed = productSchema.safeParse(result.data);
      if (!parsed.success) {
        const zodMessage = formatZodError(parsed.error);
        logger.error("[productsService.getById] Erro de validação", new Error(zodMessage));
        return { error: "Resposta inválida do servidor" };
      }

      return { data: parsed.data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao buscar produto";
      logger.error(errorMessage, error instanceof Error ? error : null);
      return { error: errorMessage };
    }
  },
};
```

## Padrões de Uso

### 1. Sempre Usar cn() para Classes Condicionais

```jsx
// ✅ CORRETO
import { cn } from "@/lib/utils";

<Button className={cn(
  "base-styles",
  isActive && "active-styles",
  isPrimary ? "primary-styles" : "secondary-styles"
)} />

// ❌ INCORRETO
<Button className={`base-styles ${isActive ? "active-styles" : ""}`} />
```

### 2. Logger para Todos os Erros

```typescript
// ✅ CORRETO
import { logger } from "@/lib/logger";

try {
  await doSomething();
} catch (error) {
  logger.error("Erro ao executar operação", error instanceof Error ? error : null);
}

// ❌ INCORRETO
try {
  await doSomething();
} catch (error) {
  console.error(error);
}
```

### 3. Cookies para Language Preference

```typescript
// ✅ CORRETO
import { cookies } from "@/lib/cookies";

const setLanguage = (lang: string) => {
  localStorage.setItem("language", lang);
  cookies.set("user_language", lang); // Backend recebe via cookie
};

// ❌ INCORRETO
const setLanguage = (lang: string) => {
  localStorage.setItem("language", lang);
  // Backend não recebe a informação
};
```

### 4. Formatação de Preços

```typescript
// ✅ CORRETO
import { formatPrice } from "@/lib/utils";

const displayPrice = formatPrice(product.price); // "R$ 45,90"

// ❌ INCORRETO
const displayPrice = `R$ ${product.price.toFixed(2)}`; // "R$ 45.90" (errado)
```

## Testing

Utilitários de lib são testados indiretamente através dos componentes e services que os utilizam.

## Dependências

- **clsx** - Conditional class names
- **tailwind-merge** - Merge Tailwind classes
- **zod** - Schema validation

## Exemplos Completos

### Exemplo: Service com Logger e Zod Validation

```typescript
import { api } from "@/services/api";
import { logger } from "@/lib/logger";
import { formatZodError } from "@/lib/zod-errors";
import { productSchema, type Product } from "@/shared/schemas/product.schema";

type ServiceResult<T> = { data: T } | { error: string };

export const productsService = {
  async getById(id: string): Promise<ServiceResult<Product>> {
    try {
      const result = await api.get<unknown>(`/products/${id}`);

      const hasError = "error" in result;
      if (hasError) {
        logger.warn(`Produto não encontrado: ${id}`);
        return { error: result.error };
      }

      const parsed = productSchema.safeParse(result.data);
      if (!parsed.success) {
        const zodMessage = formatZodError(parsed.error);
        const error = new Error(zodMessage);
        logger.error("[productsService.getById] Validação falhou", error);
        return { error: "Resposta inválida do servidor" };
      }

      logger.info(`Produto carregado: ${parsed.data.name}`, { id });
      return { data: parsed.data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao buscar produto";
      logger.error(errorMessage, error instanceof Error ? error : null, { id });
      return { error: errorMessage };
    }
  },
};
```

### Exemplo: Component com cn() e formatPrice()

```jsx
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";

function ProductCard({ product, isSelected }) {
  return (
    <div className={cn(
      "rounded-lg border p-4 transition-colors",
      isSelected && "border-primary bg-primary/10",
      !product.active && "opacity-50"
    )}>
      <h3 className="font-semibold">{product.name}</h3>
      <p className="text-sm text-muted-foreground">{product.description}</p>
      <span className="text-lg font-bold text-primary">
        {formatPrice(product.price)}
      </span>
    </div>
  );
}
```

## Referências

- clsx: https://github.com/lukeed/clsx
- tailwind-merge: https://github.com/dcastil/tailwind-merge
- Zod: https://zod.dev

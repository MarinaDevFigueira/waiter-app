# Business Selector - Implementation Plan

## Validation Results

### ✅ Passes Spec
- RxJS Subject Pattern - BehaviorSubject encapsulado
- Cookie Pattern - business_id em cookie HTTP
- Service Result Pattern - { data } | { error }
- Service Schemas Co-located - business.schema.ts junto com business.service.ts
- Pagination Pattern - Segue padrão de users.service.ts
- No Client-Side Filtering - Search via API querystring
- Composite Pattern - Dialog/Drawer com subcomponentes
- useMediaQuery - Desktop (Dialog) vs Mobile (Drawer)
- i18n Pattern - Traduções em pt-BR, en-US, es

### ❌ Violates Spec
Nenhuma violação identificada.

### ⚠️ Missing
- useDebounce hook - precisa criar se não existir

### API Documentation (Validado)

**Endpoint:** `GET /business`

**Query Params:**
```typescript
{
  search?: string;
  page?: number;
  limit?: number;
  includeDeleted?: boolean;
}
```

**Response:**
```typescript
{
  items: Business[];
  total: number;
  page: number;
  limit: number;
}
```

**Business Item:**
```typescript
{
  id: string;
  name: string;
  logoUrl: string | null;
  city: string | null;
  state: string | null;
  createdAt: string;
}
```

## Implementation Tasks

### Task 1: Business Service & Schemas

**Files to create:**
- `src/services/business/business.service.ts`
- `src/services/business/business.schema.ts`
- `src/shared/schemas/business.schema.ts`

#### 1.1 API Schema (business.schema.ts)

```typescript
import { z } from "zod";

export const apiBusinessItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  logoUrl: z.string().nullable(),
  city: z.string().nullable(),
  state: z.string().nullable(),
  createdAt: z.string(),
});

export const apiPaginatedBusinessSchema = z.object({
  items: z.array(apiBusinessItemSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
});

export interface BusinessQueryParams {
  page: number;
  size: number;
  filters?: {
    search?: string;
    includeDeleted?: boolean;
  };
}

export type ApiBusinessItem = z.infer<typeof apiBusinessItemSchema>;
export type ApiPaginatedBusiness = z.infer<typeof apiPaginatedBusinessSchema>;
```

#### 1.2 Domain Schema (src/shared/schemas/business.schema.ts)

```typescript
import { z } from "zod";

export const businessSchema = z.object({
  id: z.string(),
  name: z.string(),
  logoUrl: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  createdAt: z.coerce.date(),
});

export type Business = z.infer<typeof businessSchema>;
```

#### 1.3 Business Service (business.service.ts)

```typescript
import { api } from "@/services/api";
import { formatZodError } from "@/lib/zod-errors";
import { logger } from "@/lib/logger";
import {
  apiPaginatedBusinessSchema,
  type BusinessQueryParams,
  type ApiBusinessItem,
} from "./business.schema";
import type { Business } from "@/shared/schemas/business.schema";

interface PaginatedBusinessResult {
  items: Business[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

function mapApiBusinessItemToBusiness(apiItem: ApiBusinessItem): Business {
  return {
    id: apiItem.id,
    name: apiItem.name,
    logoUrl: apiItem.logoUrl ?? undefined,
    city: apiItem.city ?? undefined,
    state: apiItem.state ?? undefined,
    createdAt: new Date(apiItem.createdAt),
  };
}

type ServiceSuccess<T> = { data: T };
type ServiceError = { error: string };
type ServiceResult<T> = ServiceSuccess<T> | ServiceError;

export const businessService = {
  async getAll(
    queryParams: BusinessQueryParams
  ): Promise<ServiceResult<PaginatedBusinessResult>> {
    try {
      const { page, size, filters = {} } = queryParams;

      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(size));

      const hasSearch = filters.search !== undefined && filters.search !== "";
      if (hasSearch) {
        params.set("search", filters.search);
      }

      const hasIncludeDeleted = filters.includeDeleted === true;
      if (hasIncludeDeleted) {
        params.set("includeDeleted", "true");
      }

      const result = await api.get<unknown>(`/business?${params.toString()}`);

      const hasError = "error" in result;
      if (hasError) {
        return { error: result.error };
      }

      const parsed = apiPaginatedBusinessSchema.safeParse(result.data);
      const validationFailed = !parsed.success;
      if (validationFailed) {
        const zodMessage = formatZodError(parsed.error);
        logger.error("[businessService.getAll] Validation error", new Error(zodMessage));
        return { error: "Resposta inválida do servidor" };
      }

      const apiData = parsed.data;
      const totalPages = Math.ceil(apiData.total / apiData.limit);
      const hasNextPage = apiData.page < totalPages;
      const hasPreviousPage = apiData.page > 1;

      const mappedItems = apiData.items.map(mapApiBusinessItemToBusiness);

      const mappedData: PaginatedBusinessResult = {
        items: mappedItems,
        total: apiData.total,
        page: apiData.page,
        size: apiData.limit,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      };

      return { data: mappedData };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao buscar empresas";
      logger.error(errorMessage, error instanceof Error ? error : null);
      return { error: errorMessage };
    }
  },
};
```

### Task 2: Business Subject

**File to create:** `src/shared/subjects/business.subject.ts`

```typescript
import { BehaviorSubject, type Subscription } from "rxjs";
import { cookies } from "@/lib/cookies";

interface BusinessData {
  id: string;
  name: string;
}

const getStoredBusinessId = (): string | null => {
  const cookieValue = cookies.get("business_id");
  return cookieValue;
};

const getStoredBusinessName = (): string | null => {
  const cookieValue = cookies.get("business_name");
  return cookieValue;
};

const getInitialBusiness = (): BusinessData | null => {
  const storedId = getStoredBusinessId();
  const storedName = getStoredBusinessName();
  const hasBothValues = storedId !== null && storedName !== null;
  if (hasBothValues) {
    return { id: storedId, name: storedName };
  }
  return null;
};

const initialBusiness = getInitialBusiness();

const businessSubject = new BehaviorSubject<BusinessData | null>(initialBusiness);

export const businessObservable = {
  subscribe: (callback: (value: BusinessData | null) => void): Subscription =>
    businessSubject.subscribe(callback),
  getValue: (): BusinessData | null => businessSubject.getValue(),
  setBusiness: (business: BusinessData): void => {
    cookies.set("business_id", business.id);
    cookies.set("business_name", business.name);
    businessSubject.next(business);
  },
  clearBusiness: (): void => {
    cookies.remove("business_id");
    cookies.remove("business_name");
    businessSubject.next(null);
  },
};
```

### Task 3: Custom Hook

**File to create:** `src/shared/hooks/useBusiness.ts`

```typescript
import { useEffect, useState } from "react";
import { businessObservable } from "@/shared/subjects/business.subject";

interface BusinessData {
  id: string;
  name: string;
}

interface UseBusinessReturn {
  selectedBusiness: BusinessData | null;
  setBusiness: (business: BusinessData) => void;
  clearBusiness: () => void;
}

export function useBusiness(): UseBusinessReturn {
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessData | null>(
    businessObservable.getValue()
  );

  useEffect(() => {
    const subscription = businessObservable.subscribe(setSelectedBusiness);
    return () => subscription.unsubscribe();
  }, []);

  const setBusiness = (business: BusinessData): void => {
    businessObservable.setBusiness(business);
  };

  const clearBusiness = (): void => {
    businessObservable.clearBusiness();
  };

  return {
    selectedBusiness,
    setBusiness,
    clearBusiness,
  };
}
```

### Task 4: useDebounce Hook (se não existir)

**File to check/create:** `src/shared/hooks/useDebounce.ts`

```typescript
import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

### Task 5: BusinessSelector Component

**Files to create:**
- `src/components/business-selector/business-selector.tsx`
- `src/components/business-selector/business-selector.interface.ts`
- `src/components/business-selector/__tests__/business-selector.spec.js`

#### 5.1 Interface

```typescript
export interface BusinessSelectorProps {
  className?: string;
}
```

#### 5.2 Component

```typescript
import { useState, useMemo, useCallback, useEffect } from "react";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useIsMobile } from "@/shared/hooks/useMediaQuery";
import { useBusiness } from "@/shared/hooks/useBusiness";
import { businessService } from "@/services/business/business.service";
import type { Business } from "@/shared/schemas/business.schema";
import { Dialog } from "@/components/ui/dialog/dialog";
import { Drawer } from "@/components/ui/drawer/drawer";
import { Input } from "@/components/ui/input/input";
import { Button } from "@/components/ui/button/button";
import { Label } from "@/components/ui/label/label";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { toast } from "react-toastify";
import { logger } from "@/lib/logger";
import { BuildingOfficeIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
import type { BusinessSelectorProps } from "./business-selector.interface";

export function BusinessSelector({ className }: BusinessSelectorProps) {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const { selectedBusiness, setBusiness } = useBusiness();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    const fetchBusinesses = async () => {
      setIsLoading(true);
      const result = await businessService.getAll({
        page: 1,
        size: 50,
        filters: { search: debouncedSearch },
      });
      const hasError = "error" in result;
      if (hasError) {
        toast.error(result.error);
        logger.error("[BusinessSelector] Error fetching", new Error(result.error));
        setIsLoading(false);
        return;
      }
      setBusinesses(result.data.items);
      setIsLoading(false);
    };

    const shouldFetch = isOpen;
    if (shouldFetch) {
      fetchBusinesses();
    }
  }, [debouncedSearch, isOpen]);

  const handleSelect = useCallback(
    (business: Business) => {
      setBusiness({ id: business.id, name: business.name });
      setIsOpen(false);
      toast.success(t("business.selector.selected", { name: business.name }));
    },
    [setBusiness, t]
  );

  const buttonText = useMemo(() => {
    const hasSelected = selectedBusiness !== null;
    if (hasSelected) {
      return selectedBusiness.name;
    }
    return t("business.selector.select");
  }, [selectedBusiness, t]);

  const hasResults = businesses.length > 0;
  const showEmpty = !isLoading && !hasResults;

  const Content = (
    <>
      <div className="mb-4">
        <Label htmlFor="search">{t("business.selector.searchLabel")}</Label>
        <div className="relative mt-2">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            id="search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("business.selector.search")}
            className="pl-10"
          />
        </div>
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <p className="text-sm text-muted-foreground">{t("common.loading")}</p>
          </div>
        )}

        {showEmpty && (
          <div className="flex flex-col items-center justify-center py-8">
            <BuildingOfficeIcon size={48} className="text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">{t("business.selector.noResults")}</p>
          </div>
        )}

        {hasResults && !isLoading && (
          <div className="space-y-2">
            {businesses.map((business) => {
              const isSelected = selectedBusiness?.id === business.id;
              const locationText = useMemo(() => {
                const hasCity = business.city !== undefined;
                const hasState = business.state !== undefined;
                const hasBothCityAndState = hasCity && hasState;
                if (hasBothCityAndState) {
                  return `${business.city}, ${business.state}`;
                }
                if (hasCity) {
                  return business.city;
                }
                if (hasState) {
                  return business.state;
                }
                return null;
              }, [business.city, business.state]);

              return (
                <button
                  key={business.id}
                  onClick={() => handleSelect(business)}
                  data-selected={isSelected}
                  className="w-full text-left p-3 rounded-md border border-border hover:bg-accent transition-colors data-[selected=true]:bg-primary data-[selected=true]:text-white data-[selected=true]:border-primary"
                >
                  <div className="font-medium">{business.name}</div>
                  {locationText && (
                    <div
                      data-selected={isSelected}
                      className="text-xs text-muted-foreground data-[selected=true]:text-white/80 mt-1"
                    >
                      {locationText}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </>
  );

  const triggerButton = (
    <Button
      variant="outline"
      className={className}
      data-selected={selectedBusiness !== null}
      data-testid="business-selector-trigger"
    >
      <BuildingOfficeIcon size={18} />
      <span className="ml-2 truncate">{buttonText}</span>
    </Button>
  );

  const shouldUseMobile = isMobile;
  if (shouldUseMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <Drawer.Trigger asChild>{triggerButton}</Drawer.Trigger>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>{t("business.selector.title")}</Drawer.Title>
            <Drawer.Description>{t("business.selector.description")}</Drawer.Description>
          </Drawer.Header>
          <div className="px-4">{Content}</div>
        </Drawer.Content>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>{triggerButton}</Dialog.Trigger>
      <Dialog.Content className="sm:max-w-[500px]">
        <Dialog.Header>
          <Dialog.Title>{t("business.selector.title")}</Dialog.Title>
          <Dialog.Description>{t("business.selector.description")}</Dialog.Description>
        </Dialog.Header>
        {Content}
      </Dialog.Content>
    </Dialog>
  );
}
```

### Task 6: DashboardLayout Integration

**File to modify:** `src/components/layouts/dashboard-layout/dashboard-layout.tsx`

**Changes:**

1. Import BusinessSelector:
```typescript
import { BusinessSelector } from "@/components/business-selector/business-selector";
```

2. Add below line 186 (before logout button):
```tsx
<div className="p-4 border-t border-border">
  <div
    data-minimized={isMinimized}
    className="flex items-center gap-2 mb-3 data-[minimized=true]:hidden"
  >
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium truncate">{auth?.name}</p>
      <p className="text-xs text-muted-foreground">{auth?.profile}</p>
    </div>
  </div>

  {/* 🔴 ADD THIS BLOCK 🔴 */}
  {hasFullMenuAccess && (
    <div
      data-minimized={isMinimized}
      className="mb-3 data-[minimized=true]:hidden"
    >
      <BusinessSelector className="w-full" />
    </div>
  )}
  {/* 🔴 END ADD 🔴 */}

  <Button
    variant="ghost"
    size={isMinimized ? "icon-sm" : "sm"}
    onClick={handleLogout}
    data-testid="logout-button"
    className="w-full"
  >
    <SignOutIcon />
    <span
      data-minimized={isMinimized}
      className="data-[minimized=true]:hidden ml-2"
    >
      {t("common.buttons.logout")}
    </span>
  </Button>
</div>
```

**Note:** `hasFullMenuAccess` já existe no componente (linha 70-72), então pode reutilizar.

### Task 7: Storage Keys

**File to modify:** `src/shared/constants/storage-keys.ts`

**Add:**
```typescript
export const StorageKeys = Object.freeze({
  AUTH: "auth",
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  SIDEBAR_MINIMIZED: "sidebar-minimized",
  THEME: "theme",
  LANGUAGE: "language",
  ORDERS_VIEW: "orders-view",
  CART: "cart",
  BUSINESS_ID: "business_id",        // ADD THIS
  BUSINESS_NAME: "business_name",    // ADD THIS
});
```

### Task 8: Translations (i18n)

**CRITICAL:** Adicionar em TODOS os 3 arquivos com estrutura IDÊNTICA.

#### 8.1 pt-BR.json

```json
{
  "business": {
    "selector": {
      "select": "Selecionar Empresa",
      "selected": "Empresa selecionada: {{name}}",
      "search": "Buscar empresa...",
      "searchLabel": "Buscar",
      "noResults": "Nenhuma empresa encontrada",
      "title": "Selecione uma Empresa",
      "description": "Escolha a empresa para visualizar os dados"
    }
  }
}
```

#### 8.2 en-US.json

```json
{
  "business": {
    "selector": {
      "select": "Select Business",
      "selected": "Business selected: {{name}}",
      "search": "Search business...",
      "searchLabel": "Search",
      "noResults": "No business found",
      "title": "Select a Business",
      "description": "Choose the business to view data"
    }
  }
}
```

#### 8.3 es.json

```json
{
  "business": {
    "selector": {
      "select": "Seleccionar Empresa",
      "selected": "Empresa seleccionada: {{name}}",
      "search": "Buscar empresa...",
      "searchLabel": "Buscar",
      "noResults": "Ninguna empresa encontrada",
      "title": "Seleccione una Empresa",
      "description": "Elija la empresa para ver los datos"
    }
  }
}
```

### Task 9: Testing

**File to create:** `src/components/business-selector/__tests__/business-selector.spec.js`

```javascript
import { test, expect } from "@playwright/test";

test.describe("BusinessSelector Component", () => {
  test("should render trigger button", async ({ page }) => {
    await page.goto("/dashboard");
    const trigger = page.getByTestId("business-selector-trigger");
    await expect(trigger).toBeVisible();
  });

  test("should open dialog on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto("/dashboard");
    const trigger = page.getByTestId("business-selector-trigger");
    await trigger.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
  });

  test("should search businesses", async ({ page }) => {
    await page.goto("/dashboard");
    const trigger = page.getByTestId("business-selector-trigger");
    await trigger.click();
    const searchInput = page.getByPlaceholder("Buscar empresa...");
    await searchInput.fill("Test Business");
    await expect(searchInput).toHaveValue("Test Business");
  });

  test("should select business", async ({ page }) => {
    await page.goto("/dashboard");
    const trigger = page.getByTestId("business-selector-trigger");
    await trigger.click();
    const firstBusiness = page.locator("button").filter({ hasText: "Business Name" }).first();
    await firstBusiness.click();
    const toast = page.getByText(/Empresa selecionada/);
    await expect(toast).toBeVisible();
  });

  test("should show empty state when no results", async ({ page }) => {
    await page.goto("/dashboard");
    const trigger = page.getByTestId("business-selector-trigger");
    await trigger.click();
    const searchInput = page.getByPlaceholder("Buscar empresa...");
    await searchInput.fill("nonexistent business xyz");
    const emptyState = page.getByText("Nenhuma empresa encontrada");
    await expect(emptyState).toBeVisible();
  });
});
```

## Implementation Checklist

### Services & Schemas
- [ ] Criar `src/services/business/business.service.ts`
- [ ] Criar `src/services/business/business.schema.ts`
- [ ] Criar `src/shared/schemas/business.schema.ts`
- [ ] Implementar método `getAll` com paginação
- [ ] Validar response com Zod
- [ ] Error handling com try-catch
- [ ] Logger em erros

### State Management
- [ ] Criar `src/shared/subjects/business.subject.ts`
- [ ] BehaviorSubject encapsulado
- [ ] Salvar business_id e business_name em cookies
- [ ] Initial value de cookies
- [ ] Métodos: setBusiness, clearBusiness

### Hooks
- [ ] Verificar se `src/shared/hooks/useDebounce.ts` existe
- [ ] Se não existir, criar useDebounce hook
- [ ] Criar `src/shared/hooks/useBusiness.ts`
- [ ] Subscribe ao businessObservable
- [ ] Cleanup subscription em useEffect

### Components
- [ ] Criar `src/components/business-selector/business-selector.tsx`
- [ ] Criar `src/components/business-selector/business-selector.interface.ts`
- [ ] Dialog para desktop
- [ ] Drawer para mobile (useMediaQuery)
- [ ] Input de busca com debounce
- [ ] Lista de businesses
- [ ] Loading state
- [ ] Empty state
- [ ] Selected state highlighting

### Layout Integration
- [ ] Modificar `src/components/layouts/dashboard-layout/dashboard-layout.tsx`
- [ ] Import BusinessSelector
- [ ] Adicionar acima do logout button
- [ ] Renderizar apenas para hasFullMenuAccess (ADMIN/OWNER)

### Constants
- [ ] Modificar `src/shared/constants/storage-keys.ts`
- [ ] Adicionar BUSINESS_ID
- [ ] Adicionar BUSINESS_NAME

### Translations
- [ ] Modificar `src/shared/translations/pt-BR.json`
- [ ] Modificar `src/shared/translations/en-US.json`
- [ ] Modificar `src/shared/translations/es.json`
- [ ] Validar estrutura idêntica nos 3 arquivos

### Testing
- [ ] Criar `src/components/business-selector/__tests__/business-selector.spec.js`
- [ ] Test: render trigger button
- [ ] Test: open dialog/drawer
- [ ] Test: search functionality
- [ ] Test: select business
- [ ] Test: empty state
- [ ] Usar MCP Playwright para testes visuais

### Validation
- [ ] npm run lint
- [ ] Teste visual com MCP Playwright
- [ ] Teste mobile (drawer)
- [ ] Teste desktop (dialog)
- [ ] Teste troca de idioma
- [ ] Teste seleção de business
- [ ] Verificar cookie business_id salvo

## Files Summary

### Files to Create (8)
1. `src/services/business/business.service.ts`
2. `src/services/business/business.schema.ts`
3. `src/shared/schemas/business.schema.ts`
4. `src/shared/subjects/business.subject.ts`
5. `src/shared/hooks/useBusiness.ts`
6. `src/shared/hooks/useDebounce.ts` (se não existir)
7. `src/components/business-selector/business-selector.tsx`
8. `src/components/business-selector/business-selector.interface.ts`
9. `src/components/business-selector/__tests__/business-selector.spec.js`

### Files to Modify (5)
1. `src/components/layouts/dashboard-layout/dashboard-layout.tsx`
2. `src/shared/constants/storage-keys.ts`
3. `src/shared/translations/pt-BR.json`
4. `src/shared/translations/en-US.json`
5. `src/shared/translations/es.json`

## Critical Patterns Applied

### ✅ Named Variables
```typescript
const hasError = "error" in result;
if (hasError) { ... }
```

### ✅ Boolean Extraction
```typescript
const hasSearch = filters.search !== undefined && filters.search !== "";
if (hasSearch) { ... }
```

### ✅ Array + includes
```typescript
const adminProfiles = [UserProfileEnum.OWNER, UserProfileEnum.ADMIN];
const hasFullMenuAccess = adminProfiles.includes(userProfile);
```

### ✅ Data Attributes Lowercase
```typescript
<div data-minimized={isMinimized}>
<button data-selected={isSelected}>
```

### ✅ No Hardcoded Values
```typescript
className="bg-primary text-white p-4"
```

### ✅ Cookie Pattern
```typescript
cookies.set("business_id", business.id);
cookies.set("business_name", business.name);
```

### ✅ Service Result Pattern
```typescript
Promise<ServiceResult<PaginatedBusinessResult>>
// Returns: { data: ... } | { error: ... }
```

### ✅ RxJS Subject Encapsulated
```typescript
const businessSubject = new BehaviorSubject(...); // private
export const businessObservable = { ... }; // public API
```

### ✅ Subscription Cleanup
```typescript
useEffect(() => {
  const subscription = businessObservable.subscribe(setSelectedBusiness);
  return () => subscription.unsubscribe();
}, []);
```

## Success Criteria

- [ ] ADMIN/OWNER pode ver botão de seleção de empresa
- [ ] Botão mostra "Selecionar Empresa" quando nenhuma selecionada
- [ ] Botão mostra nome da empresa quando selecionada
- [ ] Desktop abre Dialog modal
- [ ] Mobile abre Drawer
- [ ] Search input com debounce funciona
- [ ] Lista de empresas renderiza corretamente
- [ ] Seleção salva cookies business_id e business_name
- [ ] Cookie enviado automaticamente em requests
- [ ] Loading state durante fetch
- [ ] Empty state quando sem resultados
- [ ] Traduções em pt-BR, en-US, es
- [ ] Sem erros no lint
- [ ] Testes passando
- [ ] Código self-documenting

## Next Steps for @dev

1. Verificar se `useDebounce` hook existe
2. Criar business service e schemas
3. Criar business subject
4. Criar useBusiness hook
5. Criar BusinessSelector component
6. Integrar no DashboardLayout
7. Adicionar traduções i18n
8. Executar testes
9. Executar lint
10. Validar visualmente com Playwright MCP

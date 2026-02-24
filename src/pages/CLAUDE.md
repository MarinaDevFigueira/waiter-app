# Pages Module

Módulo de páginas do waiter-app. Cada página representa uma tela completa da aplicação com seus componentes locais.

## Estrutura

```
src/pages/
├── foods/              # Página de cardápio (customer)
├── kitchen/            # Página da cozinha (kitchen profile)
├── orders/             # Páginas de pedidos
│   ├── admin-orders/   # Visualização admin de pedidos
│   └── kitchen-orders/ # Visualização cozinha de pedidos
├── products/           # Página de gerenciamento de produtos (admin)
├── categories/         # Página de gerenciamento de categorias (admin)
├── login/              # Página de login
├── dashboard/          # Dashboard home (admin)
└── admin/              # Outras páginas admin
```

## Padrão de Estrutura

Cada página DEVE seguir esta estrutura:

```
src/pages/{feature}/{view}/
├── page.tsx                       # Componente principal da página
├── page.interface.ts              # Interfaces TypeScript (se necessário)
├── components/                    # Componentes locais da página
│   └── {component-name}/
│       ├── {component-name}.tsx
│       └── {component-name}.interface.ts
└── __tests__/
    └── page.spec.js               # Testes da página
```

### Exemplo: Products Page

```
src/pages/products/
├── page.tsx
├── components/
│   ├── products-table/
│   │   ├── products-table.tsx
│   │   └── products-table.interface.ts
│   ├── products-filters/
│   │   └── products-filters.tsx
│   ├── products-table-skeleton/
│   │   └── products-table-skeleton.tsx
│   └── product-form-dialog/
│       ├── product-form-dialog.tsx
│       ├── product-form-dialog.interface.ts
│       ├── language-switcher.tsx
│       ├── unsaved-changes-dialog.tsx
│       ├── fields.tsx
│       └── footer.tsx
├── __tests__/
│   ├── page.spec.js
│   └── products-api-flow.spec.js
```

## Foods Page (`src/pages/foods/`)

Página de cardápio para clientes navegarem e adicionarem produtos ao carrinho.

### Componentes Principais

- **page.tsx** - Componente principal que orquestra a página
- **components/title.tsx** - Título "Bem vindo ao WAITERAPP"
- **components/categories.tsx** - Lista de categorias (Pizzas, Bebidas, etc)
- **components/foods.tsx** - Grid de produtos
- **components/cart-button/** - Botão do carrinho com contador
- **components/cart-drawer/** - Drawer do carrinho lateral
- **components/order-session-button/** - Botão de resumo da sessão
- **components/order-session-summary/** - Modal de resumo da sessão
- **components/product-detail-modal/** - Modal de detalhe do produto

### Exemplo de Uso

```tsx
// src/pages/foods/page.tsx
import { useState, useCallback, useMemo } from "react";
import { useCategories } from "@/shared/hooks/useCategories";
import { useProducts } from "@/shared/hooks/useProducts";
import { useCart } from "@/shared/hooks/useCart";
import { Title } from "./components/title";
import { Categories } from "./components/categories";
import { Foods } from "./components/foods";

export const FoodsPage = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const { categories } = useCategories({ initialSize: 100 });
  const { products, isLoading } = useProducts();
  const { addItem, itemCount } = useCart();

  const handleCategoryChange = useCallback((categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
  }, []);

  const activeCategories = useMemo(() => {
    return categories.filter(c => c.active);
  }, [categories]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => p.active);
  }, [products]);

  return (
    <div className="flex flex-col gap-4">
      <Title />
      <Categories
        categories={activeCategories}
        selectedCategoryId={selectedCategoryId}
        onCategoryChange={handleCategoryChange}
      />
      <Foods items={filteredProducts} />
    </div>
  );
};
```

## Products Page (`src/pages/products/`)

Página de gerenciamento de produtos para administradores.

### Features

- Listagem de produtos com TanStack Table
- Filtros (busca, categoria, preço, estoque, status)
- Paginação server-side
- Ordenação por coluna
- CRUD de produtos (create, update, delete)
- Upload de imagens de produtos
- Multi-language translations

### Componentes Principais

- **page.tsx** - Componente principal com tabela e filtros
- **components/products-table/** - Tabela de produtos com TanStack Table
- **components/products-filters/** - Filtros de busca/categoria/preço
- **components/products-table-skeleton/** - Loading skeleton
- **components/product-form-dialog/** - Dialog de criação/edição

### Product Form com Translations

```tsx
// src/pages/products/components/product-form-dialog/product-form-dialog.tsx
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLanguage } from "@/shared/hooks/useLanguage";
import { productFormSchema } from "@/shared/schemas/product.schema";

export function ProductFormDialog({ productId, open, onClose }) {
  const { language } = useLanguage();
  const [editingLanguage, setEditingLanguage] = useState(language);
  const [allTranslations, setAllTranslations] = useState({});
  const hasInitializedRef = useRef(false);

  const form = useForm({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      translations: [{
        locale: language,
        name: "",
        description: "",
      }],
      categoryId: "",
      price: 0,
      stock: 0,
      unit: "un",
      active: true,
    },
  });

  // Carregar traduções existentes
  useEffect(() => {
    if (!productId || hasInitializedRef.current) return;

    const loadTranslations = async () => {
      const result = await productsService.getTranslations(productId);
      if ("data" in result) {
        const translationsMap = {};
        result.data.translations.forEach(t => {
          translationsMap[t.locale] = { name: t.name, description: t.description };
        });
        setAllTranslations(translationsMap);
        hasInitializedRef.current = true;
      }
    };

    loadTranslations();
  }, [productId]);

  const handleLanguageSwitch = (newLanguage) => {
    // Salvar tradução atual
    const currentTranslation = form.getValues("translations.0");
    setAllTranslations(prev => ({
      ...prev,
      [editingLanguage]: {
        name: currentTranslation.name,
        description: currentTranslation.description,
      },
    }));

    // Carregar tradução do novo idioma
    const newTranslation = allTranslations[newLanguage] || { name: "", description: "" };
    form.setValue("translations.0.locale", newLanguage);
    form.setValue("translations.0.name", newTranslation.name);
    form.setValue("translations.0.description", newTranslation.description);
    setEditingLanguage(newLanguage);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      {/* Form fields */}
    </Dialog>
  );
}
```

## Categories Page (`src/pages/categories/`)

Página de gerenciamento de categorias.

### Features

- Listagem de categorias
- CRUD de categorias
- Multi-language translations
- Ordem de exibição (sortOrder)

### Componentes

- **page.tsx** - Componente principal
- **components/category-form-dialog/** - Dialog de criação/edição

## Orders Pages (`src/pages/orders/`)

### Admin Orders (`admin-orders/`)

Visualização de pedidos para administradores.

**Componentes:**
- **components/orders-table/** - Tabela de pedidos

### Kitchen Orders (`kitchen-orders/`)

Visualização de pedidos para a cozinha.

**Componentes:**
- **components/order-card/** - Card de pedido individual
- **components/orders-grid/** - Grid de cards
- **components/orders-view-toggle/** - Toggle entre grid/table
- **components/search-bar/** - Busca de pedidos

## Login Page (`src/pages/login/`)

Página de autenticação.

### Componentes

- **page.tsx** - Página principal
- **components/login-form/** - Formulário de login

### Exemplo

```tsx
// src/pages/login/components/login-form/login-form.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authService } from "@/services/auth/auth.service";
import { useNavigate } from "@tanstack/react-router";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

export function LoginForm() {
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data) => {
    const result = await authService.login(data);
    const hasError = "error" in result;

    if (hasError) {
      toast.error(result.error);
      return;
    }

    toast.success("Login realizado com sucesso!");
    navigate({ to: "/" });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
}
```

## Dashboard Page (`src/pages/dashboard/`)

Home do dashboard administrativo.

## Padrões de Código

### 1. Page Component Structure

```tsx
// src/pages/{feature}/page.tsx
import { useState, useCallback, useMemo } from "react";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { ComponentA } from "./components/component-a/component-a";

export const FeaturePage = () => {
  const { t } = useTranslation();
  const [state, setState] = useState(initialValue);

  const handleAction = useCallback(() => {
    // Handle action
  }, []);

  const derivedValue = useMemo(() => {
    // Compute derived value
  }, [dependencies]);

  return (
    <div className="flex flex-col gap-4">
      <ComponentA onAction={handleAction} />
    </div>
  );
};
```

### 2. Local Components

Componentes usados apenas nesta página DEVEM estar em `components/`:

```tsx
// src/pages/foods/components/title.tsx
export function Title() {
  const { t } = useTranslation();
  return <h1 className="text-2xl font-bold">{t("foods.welcome")}</h1>;
}
```

### 3. Composite Pattern

Use composite pattern para componentes complexos:

```tsx
// src/pages/foods/components/foods.tsx
function Foods({ items }) {
  return (
    <ul>
      {items.map(item => (
        <Foods.Item key={item.id} item={item} />
      ))}
    </ul>
  );
}

function FoodsItem({ item }) {
  return <li>{item.name}</li>;
}

Foods.Item = FoodsItem;
export { Foods };
```

### 4. Loading States

Criar skeleton components dedicados:

```tsx
// src/pages/products/components/products-table-skeleton/products-table-skeleton.tsx
export function ProductsTableSkeleton() {
  const skeletonRows = [0, 1, 2, 3, 4];

  return (
    <table>
      <tbody>
        {skeletonRows.map((i) => (
          <tr key={i}>
            <td><div className="h-4 w-32 bg-muted animate-pulse" /></td>
            <td><div className="h-4 w-24 bg-muted animate-pulse" /></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

### 5. No Client-Side Filtering

**NUNCA** usar `.filter()` no cliente. Sempre filtrar via API:

```tsx
// ❌ INCORRETO
const filteredProducts = products.filter(p => p.name.includes(search));

// ✅ CORRETO
const { products } = useProducts({
  filters: { search },
});
```

## Testing

Testes em `__tests__/*.spec.js`:

```javascript
// src/pages/foods/__tests__/page.spec.js
import { test, expect } from "@playwright/test";

test.describe("Foods Page", () => {
  test("should display categories", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Pizzas")).toBeVisible();
    await expect(page.getByText("Bebidas")).toBeVisible();
  });

  test("should filter products by category", async ({ page }) => {
    await page.goto("/");
    await page.getByText("Pizzas").click();
    await expect(page.getByText("Pizza Margherita")).toBeVisible();
  });

  test("should add product to cart", async ({ page }) => {
    await page.goto("/");
    const product = page.getByTestId("product-pizza-1");
    await product.click();
    await page.getByTestId("add-to-cart-button").click();
    await expect(page.getByTestId("cart-count")).toHaveText("1");
  });
});
```

## Dependências

- **@tanstack/react-router** - Routing
- **@tanstack/react-query** - Data fetching
- **react-hook-form** - Formulários
- **@hookform/resolvers** - Validação com Zod
- **zod** - Schema validation
- **react-toastify** - Notificações

## Referências

- TanStack Router: https://tanstack.com/router
- TanStack Query: https://tanstack.com/query
- React Hook Form: https://react-hook-form.com
- Zod: https://zod.dev

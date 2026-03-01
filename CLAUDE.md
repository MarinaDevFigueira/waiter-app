# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (Vite)
npm run build    # Production build
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

## Architecture

This is a React waiter/restaurant ordering app built with Vite and TanStack Router.

### Tech Stack
- **React 19** with JSX (no TypeScript for components)
- **TanStack Router** - File-based routing with auto code-splitting (`src/routes/`)
- **TanStack Query** - Server state management (queries, mutations, cache)
- **TanStack Table** - Data tables with sorting, filtering, pagination
- **React Hook Form + Zod v4** - Form validation
- **RxJS BehaviorSubjects** - Client state management via observables (`src/shared/subjects/`)
- **Tailwind CSS v4** - Styling with `@tailwindcss/vite` plugin
- **shadcn/ui pattern** - UI components using CVA + Radix primitives (`src/components/ui/`)
- **big.js** - Mathematical calculations (money, quantities)
- **react-i18next** - Internationalization

### Project Structure
- `src/routes/` - TanStack Router file-based routes (auto-generates `routeTree.gen.ts`)
- `src/pages/` - Page components with their local components in subdirectories
- `src/shared/subjects/` - RxJS BehaviorSubjects for reactive state (foods, categories, orders)
- `src/shared/constants/` - Shared constants (storage keys, etc.)
- `src/shared/mocks/` - Mock data
- `src/shared/hooks/` - Custom React hooks
- `src/services/` - API services with co-located TypeScript interfaces
- `src/components/ui/` - Reusable UI components (shadcn/ui style)
- `src/lib/utils.js` - Utility functions (includes `cn()` for class merging)
- `.specs/` - Project specification files (coding standards)

### Path Aliases
Use `@/` to import from `src/` directory (configured in vite.config.js).

---

## Code Style

### No Comments in Code
**NUNCA adicionar comentários no código.** O código deve ser auto-documentado através de:
- Nomes descritivos de variáveis e funções
- Funções pequenas com responsabilidade única
- Extração de lógica complexa para funções nomeadas

```jsx
// ❌ PROIBIDO
// Calculate total with tax
const total = price * 1.1;

// ✅ CORRETO
const TAX_RATE = 0.1;
const totalWithTax = price * (1 + TAX_RATE);
```

### No AI Attribution
**NUNCA** adicionar menções de "gerado pelo Claude", "Generated with Claude Code", "Co-authored-by: Claude", ou qualquer referência a assistentes de IA em:
- Commits (incluindo co-author)
- Pull request descriptions
- Código comentado
- Documentação
- Arquivos do projeto

### No Barrel Exports
**Nunca usar arquivos `index.js`** para re-exportar componentes ou módulos:
```jsx
// ✅ Correto
import { SplashScreen } from "@/components/splash-screen/splash-screen";

// ❌ Incorreto
import { SplashScreen } from "@/components/splash-screen"; // via index.js
```

### No Hardcoded Values
- **NUNCA usar valores hardcoded** (cores, espaçamentos, fontes, etc.)
- **Exceções permitidas:** apenas `width` e `height` podem ser hardcoded (ex: `w-[120px]`, `h-[200px]`)
- **Prioridade de uso:**
  1. Classes nativas do Tailwind CSS (ex: `bg-red-500`, `p-4`, `w-full`)
  2. Cores/valores do tema em `src/index.css` (ex: `bg-primary`, `text-foreground`)
  3. **Apenas em último caso:** adicionar nova variável em `:root` e `.dark` em `src/index.css`

```jsx
// ✅ Correto
className="bg-primary text-white p-4 rounded-md w-[120px]"

// ❌ Incorreto
className="bg-[#D73035] text-[#FFFFFF] p-[16px] rounded-[8px]"
```

### ESLint - No Disable
**NUNCA** usar `eslint-disable` ou comentários para bypass de regras:
1. Refatore o código para resolver o problema
2. Se a regra for inválida, discuta com o time antes de usar disable
3. Padrão: deixar código limpo sem suppressões

---

## React Patterns

### Named Variables for Conditionals
**SEMPRE** extrair condições para variáveis nomeadas com prefixo semântico:

```jsx
// ✅ Correto
const shouldShowLoading = isLoading;
const shouldShowEmpty = !isLoading && items.length === 0;
const shouldShowList = !isLoading && items.length > 0;
const hasPermission = user.role === "admin";
const isValidForm = !errors && touched;
const canSubmit = isValidForm && !isSubmitting;

// ❌ Incorreto - condições inline
{isLoading && <Spinner />}
{!isLoading && items.length === 0 && <Empty />}
```

**Prefixos por contexto:**
- `should` - Decisões de renderização: `shouldShowModal`, `shouldRenderList`
- `has` - Presença de dados: `hasItems`, `hasError`, `hasPermission`
- `is` - Estados booleanos: `isLoading`, `isValid`, `isOpen`
- `can` - Permissões/capacidades: `canEdit`, `canDelete`, `canSubmit`

### useMemo with Early Returns for Conditional Content
Quando renderizar conteúdo diferente baseado em múltiplas condições (loading, empty, success), **SEMPRE** use `useMemo` com early returns:

```jsx
// ✅ CORRETO - useMemo com early returns
const dropdownContent = useMemo(() => {
  if (shouldShowLoading) {
    return loadingState;
  }
  if (shouldShowEmpty) {
    return emptyState;
  }
  if (shouldShowList) {
    return itemsList;
  }
  return null;
}, [shouldShowLoading, shouldShowEmpty, shouldShowList, loadingState, emptyState, itemsList]);

// ❌ PROIBIDO - ternários aninhados
const dropdownContent = shouldShowLoading
  ? loadingState
  : shouldShowEmpty
    ? emptyState
    : shouldShowList
      ? itemsList
      : null;
```

### Early Return Pattern
Quando um componente renderiza estruturas completamente diferentes baseado em condição, use early return:

```jsx
// ✅ Correto
function ResponsiveComponent() {
  const isMobile = useIsMobile();

  const sharedHeader = <Header title={title} />;

  if (isMobile) {
    return (
      <MobileLayout>
        {sharedHeader}
        <Content />
      </MobileLayout>
    );
  }

  return (
    <DesktopLayout>
      {sharedHeader}
      <Content />
    </DesktopLayout>
  );
}
```

### No Chained Ternaries
**NUNCA** usar ternários encadeados. Use `if-else`, `switch`, ou object maps:

```jsx
// ❌ PROIBIDO
const color = status === "success" ? "green" : status === "error" ? "red" : "gray";

// ✅ Correto - Object map
const statusColors = {
  success: "green",
  error: "red",
  default: "gray"
};
const color = statusColors[status] || statusColors.default;
```

### Data Attributes for Conditional Styling
Use `data-*` attributes para estilos condicionais ao invés de ternários:

```jsx
// ✅ Correto
<Button
  data-selected={isSelected}
  data-loading={isLoading}
  className="data-[selected=true]:bg-primary data-[selected=false]:bg-muted data-[loading=true]:opacity-50"
/>

// ❌ Incorreto
<Button className={isSelected ? "bg-primary" : "bg-muted"} />
```

**Nota:** Use apenas lowercase em data attributes: `data-selected`, `data-loading` (não `data-isSelected`).

### useCallback for Stable References
**SEMPRE** usar `useCallback` para funções passadas como props ou usadas em dependency arrays:

```jsx
// ✅ Correto
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);

// ❌ Incorreto - recria função a cada render
const handleClick = () => doSomething(id);
```

### useMemo for Derived State
**NUNCA** usar useEffect para derivar estado. Use `useMemo`:

```jsx
// ✅ Correto
const filteredItems = useMemo(() => {
  return items.filter(item => item.active);
}, [items]);

// ❌ Incorreto - useEffect anti-pattern
const [filteredItems, setFilteredItems] = useState([]);
useEffect(() => {
  setFilteredItems(items.filter(item => item.active));
}, [items]);
```

### Composite Component Pattern
Usar padrão de composite components para componentes complexos:

```jsx
// Definição
function Card({ children }) {
  return <div className="card">{children}</div>;
}
Card.Header = function CardHeader({ children }) {
  return <div className="card-header">{children}</div>;
};
Card.Body = function CardBody({ children }) {
  return <div className="card-body">{children}</div>;
};

// Uso
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
</Card>
```

---

## RxJS State Management

### Observable Pattern
Encapsular BehaviorSubject, **NUNCA** exportar diretamente:

```jsx
// ✅ Correto - Encapsulado
const subject = new BehaviorSubject(initialState);

export const myObservable = {
  subscribe: (callback) => subject.subscribe(callback),
  getValue: () => subject.getValue(),
  updateState: (newState) => {
    subject.next({ ...subject.getValue(), ...newState });
  },
  resetState: () => subject.next(initialState),
};

// ❌ Incorreto - Exportar subject diretamente
export const mySubject = new BehaviorSubject(initialState);
```

### Subscription Cleanup
**SEMPRE** fazer unsubscribe no cleanup do useEffect:

```jsx
useEffect(() => {
  const subscription = myObservable.subscribe(setState);
  return () => subscription.unsubscribe(); // OBRIGATÓRIO
}, []);
```

---

## TanStack Router

### File-Based Routing
- Rotas em `src/routes/` auto-geram `routeTree.gen.ts`
- **NUNCA** editar `routeTree.gen.ts` manualmente
- Convenções de arquivo:
  - `__root.tsx` - Layout raiz
  - `index.tsx` - Rota index (/)
  - `about.tsx` - Rota /about
  - `$id.tsx` - Rota dinâmica /:id
  - `_layout.tsx` - Layout sem afetar URL

### Protected Routes
Usar `beforeLoad` para proteção:

```jsx
export const Route = createFileRoute("/admin")({
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
});
```

### Navigation
Usar hooks do TanStack Router:

```jsx
import { useNavigate, Link } from "@tanstack/react-router";

// Navegação programática
const navigate = useNavigate();
navigate({ to: "/products/$id", params: { id: "123" } });

// Links
<Link to="/products/$id" params={{ id: "123" }}>View</Link>
```

### Outlet Pattern
Usar `<Outlet />` para renderizar rotas filhas em layouts.

---

## TanStack Query

### Query Pattern
```jsx
const { data, isLoading, error } = useQuery({
  queryKey: ["products", filters],
  queryFn: () => productService.getAll(filters),
});
```

### Mutation Pattern
Mutations retornam `void` e invalidam cache:

```jsx
const mutation = useMutation({
  mutationFn: (data) => productService.create(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["products"] });
    toast.success(t("product.created"));
  },
  onError: (error) => {
    logger.error("Failed to create product", error);
    toast.error(t("errors.generic"));
  },
});
```

---

## Forms (React Hook Form + Zod)

### Form Structure
```jsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema } from "@/services/products/schemas";

function ProductForm() {
  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: { name: "", price: 0 },
  });

  const onSubmit = form.handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <form onSubmit={onSubmit}>
      <Input {...form.register("name")} />
      {form.formState.errors.name && (
        <span>{form.formState.errors.name.message}</span>
      )}
    </form>
  );
}
```

---

## Services Pattern

### Service Structure
```typescript
// services/products/products.service.ts
import { api } from "@/services/api";
import type {
  GetAllProductsRequestQuery,
  GetAllProductsResponse,
} from "./interfaces/products.interface";

export const productsService = {
  async getAll(params: GetAllProductsRequestQuery): Promise<ServiceResult<GetAllProductsResponse>> {
    try {
      const result = await api.get<GetAllProductsResponse>("/products", { params });
      if ("error" in result) {
        return { error: result.error };
      }
      return { data: result.data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao buscar";
      logger.error(errorMessage, error instanceof Error ? error : null);
      return { error: errorMessage };
    }
  },

  async create(data: CreateProductRequestBody): Promise<ServiceResult<void>> {
    try {
      const result = await api.post<void>("/products", data);
      if ("error" in result) {
        return { error: result.error };
      }
      return { data: undefined };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao criar";
      logger.error(errorMessage, error instanceof Error ? error : null);
      return { error: errorMessage };
    }
  },
};
```

### TypeScript Interfaces (No Zod in Services)
Services usam TypeScript interfaces para tipagem. **NUNCA** usar Zod na camada de services:
```
src/services/products/
├── products.service.ts
└── interfaces/
    └── products.interface.ts
```

### Interface Naming Convention
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

export interface CreateProductRequestBody {
  translations: Record<string, { name: string; description?: string }>;
  categoryId: string;
  price: number;
  stock: number;
  unit: string;
  active: boolean;
}
```

### Error Handling Return Pattern
Funções que podem falhar retornam `{ data }` ou `{ error }`:

```jsx
async function fetchUser(id) {
  try {
    const response = await api.get(`/users/${id}`);
    return { data: response.data };
  } catch (error) {
    logger.error("Failed to fetch user", error);
    return { error: error.message };
  }
}

// Uso
const { data, error } = await fetchUser(id);
if (error) {
  toast.error(t("errors.fetchUser"));
  return;
}
```

### API Query Params
**SEMPRE** usar query params para filtragem server-side. **NUNCA** filtrar client-side:

```jsx
// ✅ Correto - Server-side filtering
const { data } = useQuery({
  queryKey: ["products", { category, search }],
  queryFn: () => productService.getAll({ category, search }),
});

// ❌ Incorreto - Client-side filtering
const { data } = useQuery({ queryKey: ["products"], queryFn: productService.getAll });
const filtered = data?.filter(p => p.category === category); // PROIBIDO
```

---

## Mathematical Calculations

**SEMPRE** usar `big.js` para cálculos com dinheiro. **NUNCA** usar operadores nativos:

```jsx
import Big from "big.js";

// ✅ Correto
const total = new Big(price).times(quantity).toFixed(2);
const withTax = new Big(subtotal).times(1.1).toFixed(2);

// ❌ Incorreto - Imprecisão de ponto flutuante
const total = price * quantity;
const withTax = subtotal * 1.1;
```

---

## Internationalization (i18n)

### Usage Pattern
```jsx
import { useTranslation } from "react-i18next";

function MyComponent() {
  const { t } = useTranslation();
  return <h1>{t("page.title")}</h1>;
}
```

### JSON Structure
```json
{
  "page": {
    "title": "Título da Página",
    "description": "Descrição"
  },
  "common": {
    "loading": "Carregando...",
    "error": "Erro"
  }
}
```

---

## Error Handling

### Toast + Logger Pattern
```jsx
import { toast } from "react-toastify";
import { logger } from "@/lib/logger";

try {
  await someOperation();
  toast.success(t("success.message"));
} catch (error) {
  logger.error("Operation failed", error);
  toast.error(t("errors.generic"));
}
```

---

## Swiper Navigation Pattern

Para sliders com botões de navegação condicionais:

1. **Observable para estado:** `isBeginning`, `isEnd`
2. **Flexbox layout:** sem position absolute
3. **Conditional rendering:** `{shouldShowPrevButton && <button />}`
4. **setTimeout em onInit:** garantir que Swiper está inicializado

```jsx
const handleSwiperInit = useCallback((swiper) => {
  setTimeout(() => {
    swiperObservable.updateState({
      isBeginning: swiper.isBeginning,
      isEnd: swiper.isEnd,
    });
  }, 0);
}, []);
```

---

## Testing

### Playwright MCP
- Usar MCP Playwright integrado ao Claude Code para testar implementações
- **NUNCA** usar `npm run test` durante desenvolvimento

**Ferramentas disponíveis:**
- `browser_navigate` - Navegar para URL
- `browser_snapshot` - Capturar snapshot de acessibilidade (preferir sobre screenshot)
- `browser_click` - Clicar em elementos
- `browser_type` - Digitar texto
- `browser_console_messages` - Verificar erros

### Selective Test Execution
Antes de commits, rodar apenas testes relevantes:

```bash
npm run test -- --grep "ProductForm"
npm run test -- src/components/ui/button/
```

### data-testid Pattern
Usar `data-testid` para selecionar elementos:

```jsx
<button data-testid="submit-button">Submit</button>
```

---

## Principles

### KISS (Keep It Simple)
- Solução mais simples que funciona
- Evitar over-engineering
- Não adicionar features não solicitadas

### DRY (Don't Repeat Yourself)
- Extrair código duplicado para utilities
- Criar hooks reutilizáveis
- Componentes genéricos para padrões repetidos

### When to Use Intermediate Variables
**USAR quando:**
- Expressão envolve múltiplas operações
- O nome adiciona contexto semântico
- Cache de operação lenta
- Facilitar debug

**NÃO USAR quando:**
- Nome repete o nome da função
- Propriedade já é contextualmente clara
- Valor usado apenas uma vez sem ganho de clareza

---

## Figma Design

**Link:** https://www.figma.com/design/PFza25fTu8s9WLjrFxk7lq/WAITERAPP--Copy-?node-id=11-195

### Design Tokens
- **Cor primária:** Vermelho (#D73035)
- **Texto:** Cinza escuro para títulos, cinza médio para descrições
- **Background:** Branco
- **Bordas:** Arredondadas (rounded)
- **Preços:** Formato "R$ XX,00"

---

## Dependencies

### Phosphor Icons
- **Package:** `@phosphor-icons/react`
- Sempre verificar `node_modules/@phosphor-icons/react/dist/index.d.ts` antes de usar novos ícones
- Ícones usam sufixo `Icon` (ex: `PizzaIcon`, `WineIcon`)

---

## Workflow

### Uso do Agente @dev (OBRIGATÓRIO)
**SEMPRE use no mínimo 1 agente @dev** para implementar funcionalidades, corrigir bugs ou refatorar.

### Ao alterar arquivos
1. `npm run lint` - Verificar erros de lint
2. Usar MCP Playwright para testar visualmente

### CI/CD
- GitHub Action em `.github/workflows/test.yml`
- Executa `npm run test` em PRs para `main`

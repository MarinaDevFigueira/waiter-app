# Components Module

Módulo de componentes do waiter-app, dividido entre componentes UI reutilizáveis, layouts, autenticação e componentes específicos de features.

## Estrutura

```
src/components/
├── ui/                        # Componentes UI reutilizáveis (shadcn/ui pattern)
├── layouts/                   # Layouts compartilhados (app-layout, dashboard-layout)
├── auth/                      # Componentes de autenticação e proteção de rotas
├── splash-screen/            # Tela de splash inicial
├── empty-states/             # Estados vazios (kitchen-empty-state)
├── default-not-found/        # Página 404 padrão
├── logout-confirmation-modal/ # Modal de confirmação de logout
└── toast-provider/           # Provider do react-toastify
```

## Padrões de Código

### 1. Composite Pattern (SEMPRE)
Todos os componentes com múltiplas seções DEVEM usar o padrão composite:

```jsx
// card.tsx
function Card({ children, ...props }) {
  return <div {...props}>{children}</div>;
}

function CardHeader({ children, ...props }) {
  return <header {...props}>{children}</header>;
}

Card.Header = CardHeader;
export { Card };

// Uso
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
</Card>
```

### 2. Imports Diretos (NUNCA usar index.js)
```jsx
// ✅ CORRETO
import { Button } from "@/components/ui/button/button";

// ❌ INCORRETO
import { Button } from "@/components/ui/button";
```

### 3. Interfaces em Arquivos Separados
TypeScript interfaces/types DEVEM estar em arquivos `*.interface.ts` separados:

```
src/components/logout-confirmation-modal/
├── logout-confirmation-modal.tsx
└── logout-confirmation-modal.interface.ts
```

### 4. Estrutura de Testes
Cada componente DEVE ter pasta `__tests__/` com mínimo 3-5 testes:

```
src/components/ui/button/
├── button.tsx
├── variants.ts
└── __tests__/
    └── button.spec.js
```

### 5. Sem Valores Hardcoded
**NUNCA** usar cores, espaçamentos ou tamanhos hardcoded (exceto width/height):

```jsx
// ✅ CORRETO
className="bg-primary text-white p-4 w-[120px]"

// ❌ INCORRETO
className="bg-[#D73035] text-[#FFFFFF] p-[16px]"
```

### 6. Data Attributes para Variações
Usar `data-*` attributes ao invés de ternários condicionais:

```jsx
// ✅ CORRETO
<Button
  data-variant={variant}
  className="data-[variant=primary]:bg-primary data-[variant=secondary]:bg-secondary"
/>

// ❌ INCORRETO
<Button className={variant === "primary" ? "bg-primary" : "bg-secondary"} />
```

## Componentes UI (`src/components/ui/`)

Componentes reutilizáveis seguindo padrão shadcn/ui com Radix UI primitives.

### Componentes Disponíveis

- **button/** - Botão com variantes (primary, secondary, outline, ghost)
- **card/** - Container card com composite pattern (Card.Header, Card.Body, Card.Footer)
- **dialog/** - Modal/Dialog usando Radix Dialog
- **drawer/** - Drawer lateral usando Vaul
- **sheet/** - Sheet/Sidebar usando Radix Dialog
- **dropdown-menu/** - Menu dropdown usando Radix DropdownMenu
- **input/** - Input de texto
- **input-file/** - Input de arquivo com preview
- **label/** - Label para formulários
- **checkbox/** - Checkbox usando Radix Checkbox
- **combobox/** - Combobox/autocomplete usando Radix Popover + Command
- **multi-select/** - Seletor múltiplo
- **feedback-screen/** - Tela de feedback (sucesso, erro, loading)
- **hover-card/** - Card que aparece no hover usando Radix HoverCard
- **pagination/** - Componente de paginação (Pagination.Info, Pagination.Controls)
- **logo/** - Logo WAITERAPP
- **language-selector/** - Seletor de idioma
- **theme-toggle/** - Toggle entre tema claro/escuro

### Exemplo: Button Component

```jsx
// src/components/ui/button/button.tsx
import { Slot } from "@radix-ui/react-slot";
import { type VariantProps } from "class-variance-authority";
import { buttonVariants } from "./variants";
import { cn } from "@/lib/utils";

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button };
```

### Variantes com CVA

Componentes usam `class-variance-authority` para gerenciar variantes:

```typescript
// src/components/ui/button/variants.ts
import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary/90",
        secondary: "bg-secondary text-white hover:bg-secondary/90",
        outline: "border border-border bg-transparent hover:bg-accent",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 text-sm",
        lg: "h-11 px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

## Layouts (`src/components/layouts/`)

### AppLayout
Layout para páginas públicas (foods page).

```jsx
import { AppLayout } from "@/components/layouts/app-layout/app-layout";

<AppLayout>
  <FoodsPage />
</AppLayout>
```

### DashboardLayout
Layout para páginas administrativas com sidebar.

```jsx
import { DashboardLayout } from "@/components/layouts/dashboard-layout/dashboard-layout";

<DashboardLayout>
  <ProductsPage />
</DashboardLayout>
```

## Autenticação (`src/components/auth/`)

Componentes de autenticação e proteção de rotas.

### Protected Routes
Usa TanStack Router `beforeLoad` para proteger rotas:

```jsx
// Em src/routes/dashboard.tsx
export const Route = createFileRoute('/dashboard')({
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: '/login' });
    }
  },
});
```

### Profile-Based Routing
Mesmo route `/` renderiza conteúdo diferente baseado no perfil do usuário.

## Outros Componentes

### SplashScreen
Tela de splash exibida no início da aplicação:

```jsx
import { SplashScreen } from "@/components/splash-screen/splash-screen";
```

### DefaultNotFound
Componente 404 padrão configurado no router:

```jsx
import { DefaultNotFound } from "@/components/default-not-found/default-not-found";

// Em __root.tsx
createRootRoute({
  notFoundComponent: () => <DefaultNotFound />,
});
```

### ToastProvider
Provider do react-toastify para notificações:

```jsx
import { ToastProvider } from "@/components/toast-provider/toast-provider";

<ToastProvider>
  <App />
</ToastProvider>
```

## Dependências Externas

- **@radix-ui/react-*** - Primitives para UI components
- **class-variance-authority** - Gerenciamento de variantes CSS
- **vaul** - Drawer component
- **react-toastify** - Toast notifications
- **@phosphor-icons/react** - Biblioteca de ícones

## Testing

### Padrão de Testes
Testes em `__tests__/*.spec.js` usando Playwright:

```javascript
// src/components/ui/button/__tests__/button.spec.js
import { test, expect } from "@playwright/test";

test.describe("Button Component", () => {
  test("should render with default variant", async ({ page }) => {
    await page.goto("/test-button");
    const button = page.getByTestId("button-default");
    await expect(button).toBeVisible();
  });

  test("should apply primary variant styles", async ({ page }) => {
    await page.goto("/test-button");
    const button = page.getByTestId("button-primary");
    await expect(button).toHaveClass(/bg-primary/);
  });

  test("should handle click events", async ({ page }) => {
    await page.goto("/test-button");
    const button = page.getByTestId("button-clickable");
    await button.click();
    await expect(page.getByText("Clicked")).toBeVisible();
  });
});
```

### Seletores com data-testid
Sempre usar `data-testid` para seletores em testes:

```jsx
<Button data-testid="confirm-order-button">
  Confirmar Pedido
</Button>
```

## Exemplos de Uso

### Exemplo: Composite Card Component

```jsx
import { Card } from "@/components/ui/card/card";

function ProductCard({ product }) {
  return (
    <Card>
      <Card.Header>
        <Card.Title>{product.name}</Card.Title>
      </Card.Header>
      <Card.Body>
        <p>{product.description}</p>
      </Card.Body>
      <Card.Footer>
        <span>{formatPrice(product.price)}</span>
      </Card.Footer>
    </Card>
  );
}
```

### Exemplo: Dialog Component

```jsx
import { Dialog } from "@/components/ui/dialog/dialog";
import { Button } from "@/components/ui/button/button";

function ConfirmDialog({ open, onClose, onConfirm }) {
  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Confirmar Ação</Dialog.Title>
          <Dialog.Description>
            Tem certeza que deseja continuar?
          </Dialog.Description>
        </Dialog.Header>
        <Dialog.Footer>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={onConfirm}>
            Confirmar
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
}
```

### Exemplo: Feedback Screen

```jsx
import { FeedbackScreen } from "@/components/ui/feedback-screen/feedback-screen";

function SuccessPage() {
  return (
    <FeedbackScreen
      variant="success"
      title="Pedido Confirmado!"
      description="Seu pedido foi enviado para a cozinha"
    />
  );
}
```

## Referências

- shadcn/ui: https://ui.shadcn.com
- Radix UI: https://www.radix-ui.com
- CVA: https://cva.style
- Phosphor Icons: https://phosphoricons.com

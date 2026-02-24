# UI Components Module

Componentes UI reutilizáveis seguindo o padrão shadcn/ui com Radix UI primitives e Class Variance Authority (CVA).

## Filosofia

Componentes UI são **agnósticos de negócio** e podem ser usados em qualquer contexto:
- **Reutilizáveis** - Funcionam em qualquer parte da aplicação
- **Composable** - Usam composite pattern para flexibilidade
- **Type-safe** - TypeScript com inferência de tipos
- **Accessible** - Radix UI garante acessibilidade
- **Themeable** - Tailwind CSS com design tokens

## Componentes Disponíveis

### Layout & Containers

- **card/** - Container card com composite pattern
- **sheet/** - Sidebar/sheet lateral
- **drawer/** - Drawer lateral (mobile-friendly)
- **dialog/** - Modal/dialog

### Forms

- **input/** - Input de texto
- **input-file/** - Input de arquivo com preview
- **label/** - Label para formulários
- **checkbox/** - Checkbox acessível
- **combobox/** - Combobox/autocomplete
- **multi-select/** - Seletor múltiplo

### Navigation

- **dropdown-menu/** - Menu dropdown
- **pagination/** - Componente de paginação
- **button/** - Botão com variantes

### Feedback

- **feedback-screen/** - Tela de feedback (success, error, loading)
- **hover-card/** - Card que aparece no hover

### Branding

- **logo/** - Logo WAITERAPP
- **theme-toggle/** - Toggle de tema claro/escuro
- **language-selector/** - Seletor de idioma

## Padrão shadcn/ui

Componentes seguem o padrão shadcn/ui:

1. **Radix UI Primitives** - Base acessível
2. **CVA (Class Variance Authority)** - Gerenciamento de variantes
3. **Tailwind CSS** - Styling utility-first
4. **Composite Pattern** - Composição flexível

### Exemplo: Button Component

```tsx
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
export type { ButtonProps };
```

```typescript
// src/components/ui/button/variants.ts
import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium transition-colors cursor-pointer active:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary/90",
        secondary: "bg-secondary text-white hover:bg-secondary/90",
        outline: "border border-border bg-transparent hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 text-sm",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

## Composite Pattern

**SEMPRE** usar composite pattern para componentes com múltiplas partes.

### Card Component

```tsx
// src/components/ui/card/card.tsx
import { cn } from "@/lib/utils";

function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        className
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function CardBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pt-0", className)} {...props} />;
}

function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  );
}

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Body = CardBody;
Card.Footer = CardFooter;

export { Card };
```

**Uso:**

```tsx
import { Card } from "@/components/ui/card/card";

<Card>
  <Card.Header>
    <Card.Title>Product Name</Card.Title>
    <Card.Description>Product description</Card.Description>
  </Card.Header>
  <Card.Body>
    <p>Product details...</p>
  </Card.Body>
  <Card.Footer>
    <Button>Add to Cart</Button>
  </Card.Footer>
</Card>
```

## Dialog Component

Modal/dialog usando Radix Dialog.

```tsx
// src/components/ui/dialog/dialog.tsx
import * as RadixDialog from "@radix-ui/react-dialog";
import { X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

function DialogRoot({ ...props }: RadixDialog.DialogProps) {
  return <RadixDialog.Root {...props} />;
}

function DialogTrigger({ ...props }: RadixDialog.DialogTriggerProps) {
  return <RadixDialog.Trigger {...props} />;
}

function DialogPortal({ ...props }: RadixDialog.DialogPortalProps) {
  return <RadixDialog.Portal {...props} />;
}

function DialogOverlay({ className, ...props }: RadixDialog.DialogOverlayProps) {
  return (
    <RadixDialog.Overlay
      className={cn(
        "fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-fade-in",
        className
      )}
      {...props}
    />
  );
}

function DialogContent({ className, children, ...props }: RadixDialog.DialogContentProps) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <RadixDialog.Content
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-background p-6 shadow-lg",
          "data-[state=open]:animate-slide-in",
          className
        )}
        {...props}
      >
        {children}
        <RadixDialog.Close className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100">
          <X className="h-4 w-4" />
        </RadixDialog.Close>
      </RadixDialog.Content>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
  );
}

function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
  );
}

function DialogTitle({ className, ...props }: RadixDialog.DialogTitleProps) {
  return (
    <RadixDialog.Title className={cn("text-lg font-semibold", className)} {...props} />
  );
}

function DialogDescription({ className, ...props }: RadixDialog.DialogDescriptionProps) {
  return (
    <RadixDialog.Description className={cn("text-sm text-muted-foreground", className)} {...props} />
  );
}

const Dialog = {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Content: DialogContent,
  Header: DialogHeader,
  Footer: DialogFooter,
  Title: DialogTitle,
  Description: DialogDescription,
};

export { Dialog };
```

**Uso:**

```tsx
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

## Input Components

### Input

```tsx
import { Input } from "@/components/ui/input/input";

<Input
  type="text"
  placeholder="Digite seu nome"
  value={name}
  onChange={(e) => setName(e.target.value)}
/>
```

### Input File

```tsx
import { InputFile } from "@/components/ui/input-file/input-file";

<InputFile
  accept="image/*"
  multiple
  onChange={(files) => setFiles(files)}
/>
```

### Label

```tsx
import { Label } from "@/components/ui/label/label";
import { Input } from "@/components/ui/input/input";

<div>
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" />
</div>
```

### Checkbox

```tsx
import { Checkbox } from "@/components/ui/checkbox/checkbox";

<div className="flex items-center gap-2">
  <Checkbox
    id="terms"
    checked={accepted}
    onCheckedChange={setAccepted}
  />
  <Label htmlFor="terms">Aceito os termos</Label>
</div>
```

## Dropdown Menu

```tsx
import { DropdownMenu } from "@/components/ui/dropdown-menu/dropdown-menu";
import { Button } from "@/components/ui/button/button";

<DropdownMenu.Root>
  <DropdownMenu.Trigger asChild>
    <Button variant="outline">Options</Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Item onClick={handleEdit}>
      Edit
    </DropdownMenu.Item>
    <DropdownMenu.Item onClick={handleDelete}>
      Delete
    </DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
```

## Pagination Component

```tsx
import { Pagination } from "@/components/ui/pagination/pagination";
import { usePagination } from "@/shared/hooks/usePagination";

function ProductsList() {
  const pagination = usePagination({
    page: 1,
    size: 10,
    total: 100,
    totalPages: 10,
    hasNextPage: true,
    hasPreviousPage: false,
    onPageChange: (newPage) => setPage(newPage),
  });

  return (
    <div>
      {/* Content */}
      <Pagination>
        <Pagination.Info {...pagination} />
        <Pagination.Controls {...pagination} />
      </Pagination>
    </div>
  );
}
```

## Feedback Screen

```tsx
import { FeedbackScreen } from "@/components/ui/feedback-screen/feedback-screen";

<FeedbackScreen
  variant="success"
  title="Pedido Confirmado!"
  description="Seu pedido foi enviado para a cozinha"
/>

<FeedbackScreen
  variant="error"
  title="Erro ao Processar"
  description="Tente novamente mais tarde"
/>

<FeedbackScreen
  variant="loading"
  title="Processando..."
  description="Aguarde enquanto processamos seu pedido"
/>
```

## Logo Component

```tsx
import { Logo } from "@/components/ui/logo/logo";

<Logo variant="default" size="md" />
<Logo variant="white" size="lg" />
```

## Theme Toggle

```tsx
import { ThemeToggle } from "@/components/ui/theme-toggle/theme-toggle";

<ThemeToggle />
```

## Language Selector

```tsx
import { LanguageSelector } from "@/components/ui/language-selector/language-selector";

<LanguageSelector />
```

## Padrões de Código

### 1. Sempre usar cn() para Classes

```tsx
// ✅ CORRETO
import { cn } from "@/lib/utils";

<div className={cn("base-class", isActive && "active-class", className)} />

// ❌ INCORRETO
<div className={`base-class ${isActive ? "active-class" : ""} ${className}`} />
```

### 2. Export Component e Types

```tsx
// ✅ CORRETO
export { Button };
export type { ButtonProps };

// ❌ INCORRETO
export default Button;
```

### 3. asChild Pattern (Radix Slot)

```tsx
import { Slot } from "@radix-ui/react-slot";

function Button({ asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp {...props} />;
}

// Uso
<Button asChild>
  <Link to="/dashboard">Go to Dashboard</Link>
</Button>
```

### 4. Variants com CVA

```typescript
import { cva } from "class-variance-authority";

export const componentVariants = cva(
  "base-styles", // Base classes
  {
    variants: {
      variant: {
        default: "default-styles",
        primary: "primary-styles",
      },
      size: {
        sm: "small-styles",
        md: "medium-styles",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);
```

### 5. data-slot Attribute

```tsx
// ✅ CORRETO - Útil para debugging
<button data-slot="button" />
<div data-slot="card-header" />

// ❌ INCORRETO - Sem identificação
<button />
```

## Testing

Testes em `__tests__/*.spec.js`:

```javascript
import { test, expect } from "@playwright/test";

test.describe("Button Component", () => {
  test("should render with primary variant", async ({ page }) => {
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

## Dependências

- **@radix-ui/react-*** - Primitives acessíveis
- **class-variance-authority** - Gerenciamento de variantes
- **@radix-ui/react-slot** - Slot component para asChild
- **@phosphor-icons/react** - Ícones
- **vaul** - Drawer component

## Referências

- shadcn/ui: https://ui.shadcn.com
- Radix UI: https://www.radix-ui.com
- CVA: https://cva.style
- Phosphor Icons: https://phosphoricons.com

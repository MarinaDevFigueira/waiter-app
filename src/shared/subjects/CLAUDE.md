# Subjects Module (RxJS State Management)

State management usando RxJS BehaviorSubjects ao invés de Redux ou Context API.

## Filosofia

- **Reactive** - Estado reativo com observables
- **Encapsulated** - BehaviorSubjects encapsulados para controle de acesso
- **Simple** - Sem boilerplate de Redux (actions, reducers, etc)
- **Type-safe** - TypeScript com tipos inferidos
- **Subscription-based** - Subscribe em useEffect, unsubscribe no cleanup

## Subjects Disponíveis

```
src/shared/subjects/
├── auth.ts                    # Autenticação (user, profile, token)
├── cart.subject.ts            # Carrinho e order session
├── categories.ts              # Categorias de produtos
├── foods.ts                   # Produtos/foods (legacy)
├── kitchen-orders.subject.ts  # Pedidos da cozinha
├── language.subject.ts        # Idioma selecionado
├── order.ts                   # Pedido atual
├── orders-view.subject.ts     # Visualização de pedidos (grid/table)
├── products-filters.subject.ts # Filtros de produtos
└── theme.ts                   # Tema claro/escuro
```

## Padrão BehaviorSubject Encapsulado

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

**Benefícios:**
- Controle total sobre quem pode modificar o estado
- API clara e consistente
- Evita vazamento de implementação
- Facilita testing e mocking

## Auth Subject

Estado de autenticação do usuário.

```typescript
// src/shared/subjects/auth.ts
import { BehaviorSubject } from "rxjs";

export interface AuthData {
  token: string;
  profile: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

const authSubject = new BehaviorSubject<AuthData | null>(null);

export const authObservable = {
  subscribe: (callback: (value: AuthData | null) => void) =>
    authSubject.subscribe(callback),
  getValue: (): AuthData | null => authSubject.getValue(),
  setAuth: (auth: AuthData): void => authSubject.next(auth),
  clearAuth: (): void => authSubject.next(null),
};
```

**Uso:**

```typescript
import { authObservable } from "@/shared/subjects/auth";

// Login
authObservable.setAuth({
  token: "jwt-token",
  profile: "CUSTOMER",
  user: { id: "1", email: "user@example.com", name: "John" },
});

// Logout
authObservable.clearAuth();

// Check auth
const auth = authObservable.getValue();
const isAuthenticated = auth !== null;
```

## Cart Subject

Carrinho de compras e order session.

```typescript
// src/shared/subjects/cart.subject.ts
import { BehaviorSubject } from "rxjs";

export interface CartItem {
  productId: string;
  productName: string;
  productPrice: number;
  productImageUrl?: string;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  orderSessionId: string | null;
}

const initialCart: Cart = {
  items: [],
  orderSessionId: null,
};

const cartSubject = new BehaviorSubject<Cart>(initialCart);

export const cartObservable = {
  subscribe: (callback: (value: Cart) => void) => cartSubject.subscribe(callback),
  getValue: (): Cart => cartSubject.getValue(),

  addItem: (item: CartItem): void => {
    const cart = cartSubject.getValue();
    const existingItemIndex = cart.items.findIndex(i => i.productId === item.productId);
    const itemExists = existingItemIndex !== -1;

    if (itemExists) {
      const updatedItems = [...cart.items];
      updatedItems[existingItemIndex].quantity += item.quantity;
      cartSubject.next({ ...cart, items: updatedItems });
    } else {
      cartSubject.next({ ...cart, items: [...cart.items, item] });
    }
  },

  removeItem: (productId: string): void => {
    const cart = cartSubject.getValue();
    const filteredItems = cart.items.filter(i => i.productId !== productId);
    cartSubject.next({ ...cart, items: filteredItems });
  },

  updateQuantity: (productId: string, quantity: number): void => {
    const cart = cartSubject.getValue();
    const updatedItems = cart.items.map(item =>
      item.productId === productId ? { ...item, quantity } : item
    );
    cartSubject.next({ ...cart, items: updatedItems });
  },

  setOrderSessionId: (sessionId: string): void => {
    const cart = cartSubject.getValue();
    cartSubject.next({ ...cart, orderSessionId: sessionId });
  },

  clearCart: (): void => {
    cartSubject.next(initialCart);
  },
};
```

**Uso:**

```typescript
import { cartObservable } from "@/shared/subjects/cart.subject";

// Adicionar item
cartObservable.addItem({
  productId: "1",
  productName: "Pizza Margherita",
  productPrice: 45.90,
  productImageUrl: "https://example.com/pizza.jpg",
  quantity: 2,
});

// Remover item
cartObservable.removeItem("1");

// Atualizar quantidade
cartObservable.updateQuantity("1", 3);

// Limpar carrinho
cartObservable.clearCart();
```

## Theme Subject

Tema claro/escuro da aplicação.

```typescript
// src/shared/subjects/theme.ts
import { BehaviorSubject } from "rxjs";

type Theme = "light" | "dark" | "system";

const themeSubject = new BehaviorSubject<Theme>("system");

export const themeObservable = {
  subscribe: (callback: (value: Theme) => void) => themeSubject.subscribe(callback),
  getValue: (): Theme => themeSubject.getValue(),
  setTheme: (theme: Theme): void => {
    themeSubject.next(theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  },
};
```

## Language Subject

Idioma selecionado da aplicação.

```typescript
// src/shared/subjects/language.subject.ts
import { BehaviorSubject } from "rxjs";
import { TranslationsEnum } from "@/shared/enums/translations.enum";

const languageSubject = new BehaviorSubject<string>(TranslationsEnum.PT_BR);

export const languageObservable = {
  subscribe: (callback: (value: string) => void) => languageSubject.subscribe(callback),
  getValue: (): string => languageSubject.getValue(),
  setLanguage: (language: string): void => {
    languageSubject.next(language);
    document.documentElement.lang = language;
  },
};
```

## Orders View Subject

Visualização de pedidos (grid ou table).

```typescript
// src/shared/subjects/orders-view.subject.ts
import { BehaviorSubject } from "rxjs";
import { OrdersViewEnum } from "@/shared/enums/orders-view.enum";

const ordersViewSubject = new BehaviorSubject<OrdersViewEnum>(OrdersViewEnum.GRID);

export const ordersViewObservable = {
  subscribe: (callback: (value: OrdersViewEnum) => void) =>
    ordersViewSubject.subscribe(callback),
  getValue: (): OrdersViewEnum => ordersViewSubject.getValue(),
  setView: (view: OrdersViewEnum): void => ordersViewSubject.next(view),
};
```

## Products Filters Subject

Filtros de produtos.

```typescript
// src/shared/subjects/products-filters.subject.ts
import { BehaviorSubject } from "rxjs";

export interface ProductsFilters {
  search?: string;
  categoria?: string[];
  precoMin?: number;
  precoMax?: number;
  somenteEmEstoque?: boolean;
  estoqueMin?: number;
  status?: string[];
}

const filtersSubject = new BehaviorSubject<ProductsFilters>({});

export const productsFiltersObservable = {
  subscribe: (callback: (value: ProductsFilters) => void) =>
    filtersSubject.subscribe(callback),
  getValue: (): ProductsFilters => filtersSubject.getValue(),
  setFilters: (filters: ProductsFilters): void => filtersSubject.next(filters),
  clearFilters: (): void => filtersSubject.next({}),
};
```

## Subscription Pattern

**SEMPRE** fazer subscribe em useEffect e unsubscribe no cleanup:

```typescript
import { useEffect, useState } from "react";
import { authObservable } from "@/shared/subjects/auth";

function useAuth() {
  const [auth, setAuth] = useState(authObservable.getValue());

  useEffect(() => {
    const subscription = authObservable.subscribe(setAuth);
    return () => subscription.unsubscribe();
  }, []);

  return { auth, isAuthenticated: auth !== null };
}
```

**IMPORTANTE:** Se não fazer unsubscribe, causa memory leak.

## Custom Hooks Pattern

**SEMPRE** criar custom hooks para encapsular lógica de subjects:

```typescript
// src/shared/hooks/useCart.ts
import { useEffect, useState, useCallback } from "react";
import { cartObservable, type Cart, type CartItem } from "@/shared/subjects/cart.subject";

export function useCart() {
  const [cart, setCart] = useState<Cart>(cartObservable.getValue());

  useEffect(() => {
    const subscription = cartObservable.subscribe(setCart);
    return () => subscription.unsubscribe();
  }, []);

  const addItem = useCallback(async (item: CartItem, quantity: number) => {
    const itemWithQuantity = { ...item, quantity };
    cartObservable.addItem(itemWithQuantity);
  }, []);

  const removeItem = useCallback((productId: string) => {
    cartObservable.removeItem(productId);
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    cartObservable.updateQuantity(productId, quantity);
  }, []);

  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    cart,
    addItem,
    removeItem,
    updateQuantity,
    itemCount,
  };
}
```

**Uso:**

```tsx
import { useCart } from "@/shared/hooks/useCart";

function CartButton() {
  const { cart, itemCount, addItem } = useCart();

  const handleAddItem = async () => {
    await addItem({
      productId: "1",
      productName: "Pizza",
      productPrice: 45.90,
      quantity: 1,
    });
  };

  return (
    <button onClick={handleAddItem}>
      Cart ({itemCount})
    </button>
  );
}
```

## Persistence Pattern

Persistir state no localStorage:

```typescript
// src/shared/subjects/cart.subject.ts
import { BehaviorSubject } from "rxjs";
import { STORAGE_KEYS } from "@/shared/constants/storage-keys";

function loadCartFromStorage(): Cart {
  const stored = localStorage.getItem(STORAGE_KEYS.CART);
  const hasStored = stored !== null;
  if (hasStored) {
    try {
      return JSON.parse(stored);
    } catch {
      return initialCart;
    }
  }
  return initialCart;
}

const cartSubject = new BehaviorSubject<Cart>(loadCartFromStorage());

// Subscribe para persistir mudanças
cartSubject.subscribe((cart) => {
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
});

export const cartObservable = {
  subscribe: (callback: (value: Cart) => void) => cartSubject.subscribe(callback),
  getValue: (): Cart => cartSubject.getValue(),
  // ... outros métodos
};
```

## Testing

Mock subjects em testes:

```typescript
// __tests__/useAuth.spec.js
import { authObservable } from "@/shared/subjects/auth";

test("should update when auth changes", () => {
  const mockAuth = {
    token: "token",
    profile: "CUSTOMER",
    user: { id: "1", email: "test@test.com", name: "Test" },
  };

  authObservable.setAuth(mockAuth);
  const auth = authObservable.getValue();

  expect(auth).toEqual(mockAuth);
});
```

## Padrões de Código

### 1. Sempre Encapsular BehaviorSubjects

```typescript
// ✅ CORRETO
const subject = new BehaviorSubject<T>(initialValue);
export const observable = {
  subscribe: (callback) => subject.subscribe(callback),
  getValue: () => subject.getValue(),
  setValue: (value) => subject.next(value),
};

// ❌ INCORRETO
export const subject = new BehaviorSubject<T>(initialValue);
// Exposição direta permite modificação sem controle
```

### 2. Sempre Unsubscribe

```typescript
// ✅ CORRETO
useEffect(() => {
  const subscription = observable.subscribe(callback);
  return () => subscription.unsubscribe();
}, []);

// ❌ INCORRETO
useEffect(() => {
  observable.subscribe(callback);
  // Memory leak!
}, []);
```

### 3. Usar Custom Hooks

```typescript
// ✅ CORRETO
const { cart, addItem } = useCart();

// ❌ INCORRETO
const [cart, setCart] = useState(cartObservable.getValue());
useEffect(() => {
  const sub = cartObservable.subscribe(setCart);
  return () => sub.unsubscribe();
}, []);
```

### 4. Nomenclatura Consistente

```typescript
// ✅ CORRETO
const cartSubject = new BehaviorSubject(...);
export const cartObservable = { ... };

// ❌ INCORRETO
const cart = new BehaviorSubject(...);
export const cartSubject = { ... };
```

## Vantagens sobre Redux

1. **Menos boilerplate** - Sem actions, reducers, dispatch
2. **Simples** - Apenas subject.next() para atualizar
3. **Type-safe** - TypeScript direto sem action types
4. **Reactive** - Subscribers recebem updates automaticamente
5. **Flexível** - Não precisa de provider/context

## Quando Usar

- **Global state** - Auth, theme, cart, etc
- **Shared state** - State compartilhado entre componentes
- **Reactive updates** - Quando múltiplos componentes precisam reagir a mudanças

## Quando NÃO Usar

- **Local state** - Use useState
- **Form state** - Use React Hook Form
- **Server state** - Use TanStack Query

## Dependências

- **rxjs** - Biblioteca reativa

## Referências

- RxJS: https://rxjs.dev
- BehaviorSubject: https://rxjs.dev/api/index/class/BehaviorSubject

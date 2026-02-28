---
name: spec:use-translation-pattern
description: "useTranslation Pattern"
---

# useTranslation Pattern

Hook para usar traduções de forma reativa nos componentes.

## Hook useTranslation

```javascript
import { useTranslation } from "@/shared/hooks/useTranslation";

function MyComponent() {
  const { t, language } = useTranslation();

  return <h1>{t("foods.welcome")}</h1>;
}
```

## Como Funciona

1. `useTranslation()` consome `useLanguage()` internamente
2. Quando idioma muda via `LanguageSelector`, `language` muda
3. Mudança de `language` força re-render do componente
4. Na re-renderização, `t()` é chamado com novo idioma ativo

## Traduções Simples

```jsx
// Antes
<h1>Bem vindo(a) ao WAITERAPP</h1>

// Depois
const { t } = useTranslation();
<h1>{t("foods.welcome")} WAITERAPP</h1>
```

## Traduções com Interpolação

```jsx
// Antes
<p>Não encontramos pedidos com "{searchQuery}"</p>

// Depois
const { t } = useTranslation();
<p>{t("orders.kitchen.emptyState.noResultsDescription", { query: searchQuery })}</p>
```

## Traduções em Validações (Zod)

```jsx
// Antes
const schema = z.object({
  query: z.string().min(1, { message: "Digite algo para buscar" }),
});

// Depois
const { t } = useTranslation();
const schema = z.object({
  query: z.string().min(1, { message: t("common.validation.searchRequired") }),
});
```

## Traduções Condicionais

```jsx
const { t } = useTranslation();

<h3>
  {isSearching
    ? t("orders.kitchen.emptyState.noResults")
    : t("orders.kitchen.emptyState.noOrders")}
</h3>
```

## Componentes Já Refatorados

✅ Title (foods page)
✅ DefaultNotFound
✅ DashboardNotFoundPage
✅ KitchenEmptyState
✅ SearchBar (orders)
✅ KitchenOrdersPage
✅ LoginForm
✅ ProductsPage
✅ ProductsFilters
✅ ProductsTable
✅ DashboardLayout

## Componentes Pendentes

- AppLayout (logout, user info - baixa prioridade)
- Categories (foods - labels hardcoded)
- Foods (aria-label)

## Regras

- Sempre usar `useTranslation()` para strings visíveis ao usuário
- Nunca usar strings hardcoded em português/inglês
- Validações Zod devem usar `t()` para mensagens de erro
- Placeholders de inputs devem usar `t()`
- Labels de status/botões devem usar `t()`

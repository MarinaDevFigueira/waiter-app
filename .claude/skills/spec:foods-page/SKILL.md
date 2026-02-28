---
name: spec:foods-page
description: "Foods Page - Especificação"
---

# Foods Page - Especificação

## Visão Geral

A página de produtos (`FoodsPage`) exibe os produtos disponíveis agrupados por categoria, com suporte a responsividade em múltiplos breakpoints.

## Componentes

### `Foods`

Componente principal da lista. Aceita os seguintes props:

- `items: Product[]` - Lista de produtos a exibir
- `onAddItem: (product: Product) => void` - Callback ao adicionar produto ao carrinho
- `categories?: Category[]` - Lista de categorias para montagem dos cabeçalhos
- `showCategoryHeaders?: boolean` - Quando `true`, exibe divisores por categoria (default: `false`)

### `FoodOption`

Card individual de produto. Responsável por exibir imagem, nome, descrição, preço e botão de adicionar.

## Responsividade

### Mobile (< 640px)

- Layout: lista vertical (`flex flex-col gap-3`)
- Item: horizontal (`flex items-start gap-3 min-h-16`)
- Imagem do produto: `h-16` (64px de altura), proporção `aspect-video`, `rounded-md`
- Nome do produto: `text-xs`
- Descrição: `text-xs`, `line-clamp-1`
- Preço: `text-xs`
- Botão adicionar: ícone `w-4 h-4`
- Espaçamento entre itens: `gap-3`
- Altura mínima do item: `min-h-16`

### Tablet (>= 640px)

- Layout: grid de 3 colunas (`sm:grid sm:grid-cols-3 sm:gap-4`)
- Item: card vertical (`sm:flex-col sm:items-stretch sm:border sm:rounded-lg sm:shadow-sm sm:overflow-hidden`)
- Imagem do produto: `sm:h-auto sm:w-full`, proporção `sm:aspect-[4/3]`, sem bordas arredondadas (`sm:rounded-none`)
- Nome do produto: `text-sm`
- Descrição: `text-xs`, `sm:line-clamp-2`
- Preço: `text-sm`
- Botão adicionar: ícone `sm:w-5 sm:h-5`
- Padding interno do conteúdo: `sm:py-3 sm:px-3`

### Desktop médio (>= 768px)

- Layout: grid de 4 colunas (`md:grid-cols-4`)

### Desktop grande (>= 1024px)

- Layout: grid de 5 colunas (`lg:grid-cols-5`)

### Desktop XL (>= 1280px)

- Layout: grid de 6 colunas (`xl:grid-cols-6`)

## Botão de Adicionar

- **Cor:** `text-green-600` (verde)
- **Motivo:** Verde comunica claramente uma ação de adição, evitando confusão com ações destrutivas ou de remoção (vermelho)
- **Ícone:** `PlusCircle` da biblioteca `lucide-react`
- **Estados interativos:**
  - Hover: `hover:opacity-80`
  - Active/pressed: `active:opacity-60`
  - Cursor: `hover:cursor-pointer`
- **Acessibilidade:** `aria-label` com nome do produto via i18n (`foods.actions.addToOrder`)
- **Seleção em testes:** `data-testid="add-product-{id}"`

## Categorias

### Divisor Visual

Cada grupo de categoria é precedido de um separador com o seguinte layout:

```
──────────── NOME DA CATEGORIA ────────────
```

Implementado com:

```jsx
<div className="w-full flex items-center gap-3">
  <div className="flex-1 h-px bg-border" />
  <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider shrink-0">
    {categoryName}
  </h2>
  <div className="flex-1 h-px bg-border" />
</div>
```

### Ordenação

As categorias são ordenadas pelo campo `sortOrder` da entidade `Category`. Categorias sem `sortOrder` definido ficam ao final (valor `999`).

### Agrupamento

Os produtos são agrupados pelo campo `categoryId`. Produtos sem categoria correspondente são exibidos com o label `"Outros"`.

## Estado Vazio

Quando `items` está vazio, exibe mensagem centralizada com:

- Título: `foods.emptyState.noProducts` (i18n)
- Subtítulo: `foods.emptyState.noProductsDescription` (i18n)

## Fluxo de Adicionar ao Carrinho

1. Usuário visualiza lista de produtos
2. Clica no botão `+` (verde) do produto desejado
3. `FoodOption` dispara `onAddClick(product)`
4. `Foods` propaga via `onAddItem(product)`
5. A página pai (`FoodsPage`) recebe o produto e atualiza o estado do pedido
6. O carrinho reflete o novo item adicionado

## Fluxo de Order Session

A order-session permanece aberta durante toda a visita da mesa, independentemente de quantos pedidos forem confirmados.

| Ação | Método | Order Session | Itens | orderSessionId |
|------|--------|---------------|-------|----------------|
| **Confirmar Pedido** | `confirmOrder()` | Permanece aberta | Limpos | Mantido |
| **Cancelar Pedido** | `clearCart()` | Fechada | Limpos | Removido |
| **Pedir a Conta** | `closeSession()` | Fechada | Limpos | Removido |

### Detalhes do fluxo

1. Mesa adiciona produtos ao carrinho — order-session é aberta automaticamente
2. Mesa clica "Confirmar Pedido":
   - Pedido é criado via `POST /orders`
   - Itens do carrinho são limpos (`clearItems()`)
   - `orderSessionId` é mantido no carrinho
   - Order-session permanece aberta
3. Mesa pode adicionar mais produtos na mesma sessão
4. Quando terminar, clica "Pedir a Conta":
   - Order-session é fechada
   - Carrinho é completamente esvaziado (incluindo `orderSessionId`)

## Imagens

- Produtos com `imageUrl` preenchido exibem a imagem remota
- Produtos sem `imageUrl` exibem `/placeholder-food.png`
- Imagens com `object-cover` e fundo `bg-muted` enquanto carregam

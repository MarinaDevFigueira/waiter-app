---
name: spec:mathematical-calculations
description: "Mathematical Calculations Pattern"
---

# Mathematical Calculations Pattern

## Princípio

NUNCA faca calculos matematicos de precos ou valores monetarios usando operadores nativos do JavaScript (`+`, `-`, `*`, `/`).

## Biblioteca Obrigatoria

Usar **big.js** para TODOS os calculos matematicos envolvendo:
- Precos
- Valores monetarios
- Subtotais
- Totais
- Descontos
- Taxas

## Razao

JavaScript usa ponto flutuante (IEEE 754) que causa imprecisoes:

```js
// ERRADO
0.1 + 0.2 // = 0.30000000000004

// CORRETO
import Big from 'big.js';
new Big(0.1).plus(0.2).toNumber() // = 0.3
```

## Como Usar

```js
import Big from 'big.js';

// Adicao
const total = new Big(10.5).plus(5.25); // 15.75

// Subtracao
const discount = new Big(100).minus(10); // 90

// Multiplicacao
const subtotal = new Big(price).times(quantity);

// Divisao
const average = new Big(total).div(count);

// Converter para numero
const value = new Big(10.5).toNumber(); // 10.5

// Converter para string formatada
const formatted = new Big(10.5).toFixed(2); // "10.50"
```

## Padrao no Projeto

1. Instalar: `npm install big.js`
2. Utility: `src/lib/math.ts` com funcoes helper
3. SEMPRE usar big.js para calculos de precos
4. NUNCA usar operadores matematicos nativos em valores monetarios

## Funcoes Helper Disponiveis

```typescript
import { add, subtract, multiply, divide, toFixed } from '@/lib/math';

// Adicao
const total = add(10.5, 5.25); // 15.75

// Subtracao
const discount = subtract(100, 10); // 90

// Multiplicacao
const subtotal = multiply(price, quantity);

// Divisao
const average = divide(total, count);

// Formatacao com casas decimais
const formatted = toFixed(10.5, 2); // "10.50"
```

## Exemplos de Violacao

### NUNCA FAZER

```js
const total = price * quantity;
const subtotal = item1.price + item2.price;
const discount = total - (total * 0.1);
const itemTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
```

### SEMPRE FAZER

```js
import { multiply, add, subtract } from '@/lib/math';

const total = multiply(price, quantity);
const subtotal = add(item1.price, item2.price);
const discount = subtract(total, multiply(total, 0.1));
const itemTotal = items.reduce((sum, item) => add(sum, multiply(item.price, item.quantity)), 0);
```

## Escopo

Aplica-se a:
- `src/shared/subjects/cart.subject.ts` (calculateTotal)
- `src/pages/foods/components/cart-drawer/cart-drawer.tsx` (itemTotal)
- `src/pages/foods/components/order-session-summary/order-session-summary.tsx` (totalAmount, itemTotal)
- `src/pages/orders/admin-orders/components/orders-table/orders-table.tsx` (total, subtotal)
- Qualquer novo arquivo que manipule valores monetarios

## Excecoes

Operacoes matematicas que NAO envolvem dinheiro (ex: contadores, indices, paginacao) podem usar operadores nativos normalmente.

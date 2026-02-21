# TanStack Table Pattern

Use TanStack Table (@tanstack/react-table) para tabelas com dados tabulares que precisam de funcionalidades como sorting, filtering e pagination.

## Quando Usar

- Tabelas com dados tabulares complexos
- Necessidade de sorting (ordenação por colunas)
- Necessidade de filtering (filtros personalizados)
- Pagination para grandes volumes de dados
- Tabelas interativas com seleção de linhas

**Não usar** para listas simples sem interatividade - nesses casos, um map direto é suficiente.

## Instalação

```bash
npm install @tanstack/react-table
```

## Estrutura Básica

### 1. Imports Necessários

```javascript
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
```

### 2. Definir Colunas

Sempre usar `useMemo` para evitar re-criação desnecessária:

```javascript
const columns = useMemo(() => [
  {
    accessorKey: 'nome',
    header: 'Nome',
    // sorting automático para strings
  },
  {
    accessorKey: 'preco',
    header: 'Preço',
    cell: (info) => formatCurrency(info.getValue()),
    // sorting automático para numbers
  },
  {
    accessorKey: 'status',
    header: 'Status',
    sortingFn: customStatusSortFn, // custom sorting
  },
  {
    accessorFn: (row) => `${row.firstName} ${row.lastName}`,
    id: 'fullName',
    header: 'Nome Completo',
    // usar accessorFn para campos computados
  },
], []);
```

### 3. Configurar Tabela com Sorting

```javascript
const [sorting, setSorting] = useState([]);

const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(), // habilita sorting
  onSortingChange: setSorting,
  state: { sorting },
});
```

### 4. Renderizar Tabela

Usar `flexRender` para renderizar headers e cells:

```jsx
<table>
  <thead>
    {table.getHeaderGroups().map((headerGroup) => (
      <tr key={headerGroup.id}>
        {headerGroup.headers.map((header) => (
          <th
            key={header.id}
            className={cn(
              header.column.getCanSort() ? "cursor-pointer select-none" : ""
            )}
            onClick={header.column.getToggleSortingHandler()}
          >
            {header.isPlaceholder
              ? null
              : flexRender(header.column.columnDef.header, header.getContext())}

            {/* Indicador de sorting */}
            {{
              asc: ' 🔼',
              desc: ' 🔽',
            }[header.column.getIsSorted()] ?? null}
          </th>
        ))}
      </tr>
    ))}
  </thead>
  <tbody>
    {table.getRowModel().rows.map((row) => (
      <tr key={row.id}>
        {row.getVisibleCells().map((cell) => (
          <td key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        ))}
      </tr>
    ))}
  </tbody>
</table>
```

## Sorting Patterns

### Sorting Básico

TanStack Table detecta automaticamente o tipo de sorting:
- **Strings**: alfabético (a-z)
- **Numbers**: numérico (crescente/decrescente)
- **Dates**: cronológico

### Custom Sorting Function

Para campos que precisam de lógica customizada:

```javascript
const sortStatusFn = (rowA, rowB, _columnId) => {
  const statusA = rowA.original.status;
  const statusB = rowB.original.status;
  const statusOrder = ['ativo', 'inativo', 'excluído'];
  return statusOrder.indexOf(statusA) - statusOrder.indexOf(statusB);
};

// Usar na definição da coluna
{
  accessorKey: 'status',
  header: 'Status',
  sortingFn: sortStatusFn,
}
```

### Opções de Sorting na Coluna

```javascript
{
  accessorKey: 'campo',
  header: 'Campo',
  sortUndefined: 'last', // força undefined para o fim
  sortDescFirst: false, // primeira ordenação será ascendente
  invertSorting: true, // inverte ordem (útil para rankings)
  enableSorting: false, // desabilita sorting nesta coluna
}
```

## Cell Rendering

### Formatação Customizada

```javascript
{
  accessorKey: 'preco',
  header: 'Preço',
  cell: (info) => {
    const preco = info.getValue();
    return formatCurrency(preco);
  },
}
```

### Renderização Condicional

```javascript
{
  accessorKey: 'status',
  header: 'Status',
  cell: (info) => {
    const status = info.getValue();
    return (
      <span
        data-status={status}
        className="data-[status=ativo]:text-green-600 data-[status=inativo]:text-gray-500"
      >
        {status}
      </span>
    );
  },
}
```

## Integração com Tailwind CSS

Manter classes Tailwind CSS do projeto:

```javascript
<table className="w-full rounded-lg border border-border bg-card shadow-sm">
  <thead className="bg-muted/50 border-b border-border">
    <tr>
      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
        {/* header content */}
      </th>
    </tr>
  </thead>
  <tbody className="divide-y divide-border">
    <tr className="hover:bg-muted/30 transition-colors">
      <td className="px-4 py-3 text-sm text-foreground">
        {/* cell content */}
      </td>
    </tr>
  </tbody>
</table>
```

## Estado e Multi-Sorting

### Multi-Sorting (padrão)

Por padrão, segurar `Shift` + clicar permite sorting em múltiplas colunas:

```javascript
// Configuração padrão já habilita multi-sorting
const table = useReactTable({
  // ...
  enableMultiSort: true, // padrão: true
  maxMultiSortColCount: 3, // limita a 3 colunas (padrão: Infinity)
});
```

### Desabilitar Multi-Sorting

```javascript
const table = useReactTable({
  // ...
  enableMultiSort: false,
});
```

## Acessibilidade

- Usar `cursor-pointer` em headers sortable
- Usar `select-none` para evitar seleção de texto ao clicar
- Adicionar `title` nos headers com informação de sorting:

```jsx
<th
  onClick={header.column.getToggleSortingHandler()}
  title={
    header.column.getCanSort()
      ? header.column.getNextSortingOrder() === 'asc'
        ? 'Ordenar crescente'
        : header.column.getNextSortingOrder() === 'desc'
          ? 'Ordenar decrescente'
          : 'Remover ordenação'
      : undefined
  }
>
```

## Anti-Patterns

### ❌ ERRADO - Não usar useMemo

```javascript
// Cria novas instâncias a cada render
const columns = [
  { accessorKey: 'name', header: 'Nome' }
];
```

### ✅ CORRETO - Usar useMemo

```javascript
const columns = useMemo(() => [
  { accessorKey: 'name', header: 'Nome' }
], []);
```

### ❌ ERRADO - Renderizar sem flexRender

```javascript
<td>{cell.column.columnDef.cell}</td>
```

### ✅ CORRETO - Usar flexRender

```javascript
<td>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
```

## Exemplo Completo

```jsx
import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";

export function ProductsTable({ products }) {
  const [sorting, setSorting] = useState([]);

  const columns = useMemo(() => [
    {
      accessorKey: 'nome',
      header: 'Nome',
    },
    {
      accessorKey: 'preco',
      header: 'Preço',
      cell: (info) => formatCurrency(info.getValue()),
    },
    {
      accessorKey: 'estoque',
      header: 'Estoque',
    },
  ], []);

  const table = useReactTable({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
  });

  return (
    <table className="w-full">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                className={header.column.getCanSort() ? "cursor-pointer select-none" : ""}
                onClick={header.column.getToggleSortingHandler()}
              >
                {flexRender(header.column.columnDef.header, header.getContext())}
                {{
                  asc: ' 🔼',
                  desc: ' 🔽',
                }[header.column.getIsSorted()] ?? null}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

## Referências

- **Documentação Oficial**: https://tanstack.com/table/latest/docs/framework/react/examples/sorting
- **Context7 Library ID**: `/websites/tanstack_table`
- **Benchmark Score**: 89.3 (High quality)
- **Code Snippets**: 1692 exemplos disponíveis

## Notas Adicionais

- TanStack Table é **headless** - você controla 100% do HTML/CSS
- Suporta **server-side sorting** com `manualSorting: true`
- Altamente performático mesmo com milhares de linhas
- Funciona com React 18+ e suporta Concurrent Mode

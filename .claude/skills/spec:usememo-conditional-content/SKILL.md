---
name: spec:usememo-conditional-content
description: "Spec: useMemo with Early Returns for Conditional Content"
---

# Spec: useMemo with Early Returns for Conditional Content

## Regra

Quando um componente precisa renderizar conteúdo diferente baseado em múltiplas condições (loading, empty, success), **SEMPRE** use `useMemo` com early returns. **NUNCA** use ternários aninhados.

## Motivo

- **Legibilidade**: Cada condição é claramente separada em seu próprio bloco
- **Manutenibilidade**: Fácil adicionar/modificar/remover condições
- **Debugging**: Breakpoints podem ser colocados em condições específicas
- **Evita ternários horríveis**: Ternários aninhados são difíceis de ler e manter
- **Performance**: useMemo evita recálculos desnecessários

## Quando Aplicar

- Componentes que renderizam estados diferentes (loading, empty, error, success)
- Dropdowns/Combobox com estados de carregamento e lista vazia
- Listas com diferentes estados
- Qualquer renderização condicional com mais de 2 condições

## Incorreto

```tsx
const dropdownContent = shouldShowLoading
  ? loadingState
  : shouldShowEmpty
    ? emptyState
    : shouldShowList
      ? businessList
      : null;
```

Este padrão é **PROIBIDO** por ser:
- Difícil de ler
- Difícil de debugar
- Propenso a erros ao adicionar novas condições

## Correto

```tsx
const dropdownContent = useMemo(() => {
  if (shouldShowLoading) {
    return loadingState;
  }
  if (shouldShowEmpty) {
    return emptyState;
  }
  if (shouldShowList) {
    return businessList;
  }
  return null;
}, [shouldShowLoading, shouldShowEmpty, shouldShowList, loadingState, emptyState, businessList]);
```

## Padrão Completo

```tsx
function MyCombobox() {
  const { data, isLoading } = useQuery({ ... });

  const items = data ?? [];
  const isEmptyList = items.length === 0;

  const shouldShowLoading = isLoading;
  const shouldShowEmpty = isEmptyList && !isLoading;
  const shouldShowList = !isLoading && !isEmptyList;

  const loadingState = (
    <div className="px-3 py-2 text-center text-sm text-muted-foreground">
      {t("common.loading")}
    </div>
  );

  const emptyState = (
    <div className="px-3 py-2 text-center text-sm text-muted-foreground">
      {emptyMessage}
    </div>
  );

  const itemsList = useMemo(() => {
    return items.map((item) => (
      <button key={item.id} onClick={() => handleSelect(item.id)}>
        {item.name}
      </button>
    ));
  }, [items]);

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

  return (
    <div className="dropdown">
      {dropdownContent}
    </div>
  );
}
```

## Benefícios do Padrão

1. **Variáveis booleanas nomeadas** (`shouldShowLoading`, `shouldShowEmpty`, `shouldShowList`) tornam a intenção clara
2. **Estados extraídos** (`loadingState`, `emptyState`) mantêm o JSX limpo
3. **useMemo com early returns** organiza a lógica de forma legível
4. **Dependency array explícito** garante performance e previsibilidade

## Comparação Visual

### Ternário Aninhado (PROIBIDO)
```
condition1 ? value1 : condition2 ? value2 : condition3 ? value3 : default
```
Leitura: horizontal, confusa, difícil de seguir

### useMemo com Early Returns (APROVADO)
```
if (condition1) return value1;
if (condition2) return value2;
if (condition3) return value3;
return default;
```
Leitura: vertical, clara, fácil de seguir

## Exceções

Nenhuma. Ternários aninhados para conteúdo condicional são sempre proibidos.

## Relacionado

- `no-chained-ternaries.spec.md` — Proíbe ternários encadeados
- `early-return-pattern.spec.md` — Padrão de early return para componentes
- `prefer-use-memo.spec.md` — Preferir useMemo para valores derivados
- `named-variables-in-conditionals.spec.md` — Variáveis nomeadas em condicionais

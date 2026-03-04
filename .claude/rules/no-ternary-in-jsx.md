# Spec: No Ternary in JSX/TSX

## Regra
Nunca use operadores ternários diretamente dentro de JSX/TSX. Sempre extraia a lógica condicional para constantes ou `useMemo`.

## Motivo
- Melhora legibilidade do código
- Facilita debug e testes
- Separa lógica de apresentação
- Permite reutilização da lógica

## ❌ Incorreto

```tsx
<div>
  {isLoading ? "Carregando..." : data?.name || "Sem nome"}
</div>

<Button className={isActive ? "bg-primary" : "bg-secondary"}>
  {count > 0 ? `${count} itens` : "Vazio"}
</Button>

{open && (
  <Modal>
    {hasData ? <Content /> : <EmptyState />}
  </Modal>
)}
```

## ✅ Correto

```tsx
// Extrair para const
const displayText = isLoading ? "Carregando..." : data?.name || "Sem nome";

<div>
  {displayText}
</div>

// Usar useMemo para lógica mais complexa
const buttonText = useMemo(() => {
  return count > 0 ? `${count} itens` : "Vazio";
}, [count]);

<Button className={isActive ? "bg-primary" : "bg-secondary"}>
  {buttonText}
</Button>

// Extrair componentes condicionais
const modalContent = hasData ? <Content /> : <EmptyState />;

const modal = useMemo(() => {
  if (!open) return null;

  return (
    <Modal>
      {modalContent}
    </Modal>
  );
}, [open, modalContent]);

return <div>{modal}</div>;
```

## Exceções permitidas

### 1. Classes CSS com `data-*` attributes (preferido)
```tsx
// ✅ Melhor solução
<Button
  data-active={isActive}
  className="data-[active=true]:bg-primary data-[active=false]:bg-secondary"
/>
```

### 2. Ternários em props (apenas quando inevitável)
```tsx
// ✅ Aceitável apenas em props simples
<Input
  type="text"
  disabled={isLoading}
  aria-invalid={hasError ? true : undefined}
/>
```

### 3. Ternários muito simples em expressões de texto (evitar quando possível)
```tsx
// ⚠️ Tolerável mas não ideal
<span>{count} {count === 1 ? "item" : "itens"}</span>

// ✅ Melhor
const itemLabel = count === 1 ? "item" : "itens";
<span>{count} {itemLabel}</span>
```

## Casos especiais

### Renderização condicional de componentes
```tsx
// ❌ Incorreto
{user ? <Dashboard user={user} /> : <Login />}

// ✅ Correto
const content = user ? <Dashboard user={user} /> : <Login />;
return <div>{content}</div>;
```

### Múltiplas condições
```tsx
// ❌ Incorreto
{status === "loading" ? <Spinner /> : status === "error" ? <Error /> : <Data />}

// ✅ Correto
const getContent = () => {
  if (status === "loading") return <Spinner />;
  if (status === "error") return <Error />;
  return <Data />;
};

const content = getContent();
return <div>{content}</div>;
```

## Checklist de revisão

- [ ] Não há ternários diretamente em JSX?
- [ ] Condições complexas foram extraídas para funções/constantes?
- [ ] Renderizações condicionais usam constantes ou `useMemo`?
- [ ] Classes CSS condicionais usam `data-*` attributes quando possível?
- [ ] Código está mais legível após a refatoração?

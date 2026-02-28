---
name: spec:early-return-pattern
description: "Spec: Early Return Pattern"
---

# Spec: Early Return Pattern

## Regra

Quando um componente React renderiza diferentes estruturas baseadas em uma condição (ex: mobile vs desktop), **NUNCA** use ternário inline no return. Use o padrão de **early return**.

## Motivo

- **Legibilidade**: Cada branch é claramente separada
- **Manutenibilidade**: Fácil adicionar/modificar branches específicas
- **Debugging**: Breakpoints podem ser colocados em branches específicas
- **Evita ternários aninhados**: Estrutura mais plana e limpa

## Quando Aplicar

- Componentes que renderizam estruturas completamente diferentes baseado em condição
- Mobile vs Desktop layouts
- Autenticado vs Não-autenticado views
- Loading vs Error vs Success states
- Diferentes tipos de usuário/perfil

## Incorreto

```tsx
function BusinessSelector() {
  const isMobile = useIsMobile();

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open</Button>
      {isMobile ? (
        <Drawer open={isOpen}>
          <Drawer.Content>
            <Header />
            <Content />
          </Drawer.Content>
        </Drawer>
      ) : (
        <Dialog open={isOpen}>
          <Dialog.Content>
            <Header />
            <Content />
          </Dialog.Content>
        </Dialog>
      )}
    </>
  );
}
```

## Correto

```tsx
function BusinessSelector() {
  const isMobile = useIsMobile();

  const triggerButton = (
    <Button onClick={() => setIsOpen(true)}>Open</Button>
  );

  if (isMobile) {
    return (
      <>
        {triggerButton}
        <Drawer open={isOpen}>
          <Drawer.Content>
            <Header />
            <Content />
          </Drawer.Content>
        </Drawer>
      </>
    );
  }

  return (
    <>
      {triggerButton}
      <Dialog open={isOpen}>
        <Dialog.Content>
          <Header />
          <Content />
        </Dialog.Content>
      </Dialog>
    </>
  );
}
```

## Padrão para Elementos Compartilhados

Quando elementos são compartilhados entre branches, extraia para uma constante antes do early return:

```tsx
function ResponsiveComponent() {
  const isMobile = useIsMobile();

  const sharedHeader = (
    <Header title={title} description={description} />
  );

  const sharedContent = (
    <Content data={data} />
  );

  if (isMobile) {
    return (
      <MobileLayout>
        {sharedHeader}
        {sharedContent}
      </MobileLayout>
    );
  }

  return (
    <DesktopLayout>
      {sharedHeader}
      {sharedContent}
    </DesktopLayout>
  );
}
```

## Multiple Conditions

Para múltiplas condições, use múltiplos early returns:

```tsx
function StatusDisplay({ status }) {
  if (status === "loading") {
    return <LoadingSpinner />;
  }

  if (status === "error") {
    return <ErrorMessage />;
  }

  if (status === "empty") {
    return <EmptyState />;
  }

  return <DataDisplay />;
}
```

## Exceções

1. **Condições simples com valores pequenos**: Quando apenas um valor/prop muda, usar ternário em variável é aceitável:

```tsx
const buttonSize = isMobile ? "sm" : "lg";
return <Button size={buttonSize}>Click</Button>;
```

2. **Conteúdo condicional dentro de estrutura fixa**: Quando a estrutura externa é a mesma:

```tsx
const content = hasData ? <DataList /> : <EmptyState />;

return (
  <Card>
    <Card.Header>Title</Card.Header>
    <Card.Body>{content}</Card.Body>
  </Card>
);
```

## Checklist de Revisao

- [ ] Estruturas completamente diferentes usam early return?
- [ ] Elementos compartilhados foram extraídos antes do early return?
- [ ] Não há ternários inline no JSX retornado?
- [ ] Cada branch é facilmente identificável e modificável?

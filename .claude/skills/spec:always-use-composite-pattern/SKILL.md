---
name: spec:always-use-composite-pattern
description: "Always Use Composite Pattern"
---

# Always Use Composite Pattern

Always structure components using the Composite Pattern. Never pass multiple props for different sections - use compound components instead.

## Rule

- **ALWAYS** use Composite Pattern for components with multiple sections
- **NEVER** use props to pass content for different sections
- **ALWAYS** export sub-components as properties of main component
- **ALWAYS** use dot notation to access sub-components
- Apply to cards, modals, layouts, forms, tables, and any multi-section component

## Why

- **Flexibility**: Users compose components how they need
- **Readability**: Component structure is visible in JSX
- **Maintainability**: No prop drilling for different sections
- **Discoverability**: Autocomplete shows available sub-components
- **Extensibility**: Easy to add new sections without breaking changes

## Structure

```jsx
// component-name.jsx
function ComponentName({ children, ...props }) {
  return <div {...props}>{children}</div>;
}

function ComponentNameHeader({ children, ...props }) {
  return <header {...props}>{children}</header>;
}

function ComponentNameBody({ children, ...props }) {
  return <div {...props}>{children}</div>;
}

function ComponentNameFooter({ children, ...props }) {
  return <footer {...props}>{children}</footer>;
}

ComponentName.Header = ComponentNameHeader;
ComponentName.Body = ComponentNameBody;
ComponentName.Footer = ComponentNameFooter;

export { ComponentName };
```

## Examples

### Example 1: Card Component

```jsx
// ❌ WRONG - props for sections
export function ProductCard({ title, description, price, image, onBuy }) {
  return (
    <div className="card">
      <img src={image} alt={title} />
      <h3>{title}</h3>
      <p>{description}</p>
      <span>{price}</span>
      <button onClick={onBuy}>Comprar</button>
    </div>
  );
}

// Usage - rigid structure
<ProductCard
  title="Pizza"
  description="Deliciosa pizza"
  price="R$ 35,00"
  image="/pizza.jpg"
  onBuy={handleBuy}
/>

// ✅ CORRECT - composite pattern
function ProductCard({ children, className, ...props }) {
  return <div className={cn("card", className)} {...props}>{children}</div>;
}

function ProductCardImage({ src, alt, ...props }) {
  return <img src={src} alt={alt} {...props} />;
}

function ProductCardHeader({ children, ...props }) {
  return <header {...props}>{children}</header>;
}

function ProductCardTitle({ children, ...props }) {
  return <h3 {...props}>{children}</h3>;
}

function ProductCardDescription({ children, ...props }) {
  return <p {...props}>{children}</p>;
}

function ProductCardFooter({ children, ...props }) {
  return <footer {...props}>{children}</footer>;
}

function ProductCardPrice({ children, ...props }) {
  return <span {...props}>{children}</span>;
}

function ProductCardActions({ children, ...props }) {
  return <div {...props}>{children}</div>;
}

ProductCard.Image = ProductCardImage;
ProductCard.Header = ProductCardHeader;
ProductCard.Title = ProductCardTitle;
ProductCard.Description = ProductCardDescription;
ProductCard.Footer = ProductCardFooter;
ProductCard.Price = ProductCardPrice;
ProductCard.Actions = ProductCardActions;

export { ProductCard };

// Usage - flexible composition
<ProductCard>
  <ProductCard.Image src="/pizza.jpg" alt="Pizza" />
  <ProductCard.Header>
    <ProductCard.Title>Pizza Margherita</ProductCard.Title>
    <ProductCard.Description>Deliciosa pizza</ProductCard.Description>
  </ProductCard.Header>
  <ProductCard.Footer>
    <ProductCard.Price>R$ 35,00</ProductCard.Price>
    <ProductCard.Actions>
      <Button onClick={handleBuy}>Comprar</Button>
    </ProductCard.Actions>
  </ProductCard.Footer>
</ProductCard>
```

### Example 2: Modal Component

```jsx
// ❌ WRONG - props for sections
export function Modal({ isOpen, title, content, footer, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-header">
        <h2>{title}</h2>
        <button onClick={onClose}>×</button>
      </div>
      <div className="modal-content">{content}</div>
      <div className="modal-footer">{footer}</div>
    </div>
  );
}

// ✅ CORRECT - composite pattern
function Modal({ children, isOpen, ...props }) {
  const shouldRender = isOpen;

  if (!shouldRender) return null;

  return <div className="modal" {...props}>{children}</div>;
}

function ModalHeader({ children, ...props }) {
  return <header {...props}>{children}</header>;
}

function ModalTitle({ children, ...props }) {
  return <h2 {...props}>{children}</h2>;
}

function ModalClose({ onClose, ...props }) {
  return <button onClick={onClose} {...props}>×</button>;
}

function ModalBody({ children, ...props }) {
  return <div {...props}>{children}</div>;
}

function ModalFooter({ children, ...props }) {
  return <footer {...props}>{children}</footer>;
}

Modal.Header = ModalHeader;
Modal.Title = ModalTitle;
Modal.Close = ModalClose;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

export { Modal };

// Usage
<Modal isOpen={isOpen}>
  <Modal.Header>
    <Modal.Title>Confirmar pedido</Modal.Title>
    <Modal.Close onClose={handleClose} />
  </Modal.Header>
  <Modal.Body>
    <OrderSummary items={items} />
  </Modal.Body>
  <Modal.Footer>
    <Button onClick={handleConfirm}>Confirmar</Button>
    <Button onClick={handleClose}>Cancelar</Button>
  </Modal.Footer>
</Modal>
```

### Example 3: Form Component

```jsx
// ❌ WRONG - props for fields
export function LoginForm({ email, password, onEmailChange, onPasswordChange, onSubmit }) {
  return (
    <form onSubmit={onSubmit}>
      <input value={email} onChange={onEmailChange} />
      <input value={password} onChange={onPasswordChange} type="password" />
      <button type="submit">Entrar</button>
    </form>
  );
}

// ✅ CORRECT - composite pattern
function Form({ children, onSubmit, ...props }) {
  return <form onSubmit={onSubmit} {...props}>{children}</form>;
}

function FormField({ children, ...props }) {
  return <div {...props}>{children}</div>;
}

function FormLabel({ children, htmlFor, ...props }) {
  return <label htmlFor={htmlFor} {...props}>{children}</label>;
}

function FormInput({ ...props }) {
  return <input {...props} />;
}

function FormActions({ children, ...props }) {
  return <div {...props}>{children}</div>;
}

Form.Field = FormField;
Form.Label = FormLabel;
Form.Input = FormInput;
Form.Actions = FormActions;

export { Form };

// Usage
<Form onSubmit={handleSubmit}>
  <Form.Field>
    <Form.Label htmlFor="email">Email</Form.Label>
    <Form.Input
      id="email"
      type="email"
      value={email}
      onChange={handleEmailChange}
    />
  </Form.Field>
  <Form.Field>
    <Form.Label htmlFor="password">Senha</Form.Label>
    <Form.Input
      id="password"
      type="password"
      value={password}
      onChange={handlePasswordChange}
    />
  </Form.Field>
  <Form.Actions>
    <Button type="submit">Entrar</Button>
  </Form.Actions>
</Form>
```

### Example 4: Table Component

```jsx
// ❌ WRONG - props for structure
export function DataTable({ headers, rows, onRowClick }) {
  return (
    <table>
      <thead>
        <tr>
          {headers.map(h => <th key={h}>{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map(row => (
          <tr key={row.id} onClick={() => onRowClick(row)}>
            {row.cells.map(cell => <td key={cell}>{cell}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ✅ CORRECT - composite pattern
function Table({ children, ...props }) {
  return <table {...props}>{children}</table>;
}

function TableHeader({ children, ...props }) {
  return <thead {...props}>{children}</thead>;
}

function TableBody({ children, ...props }) {
  return <tbody {...props}>{children}</tbody>;
}

function TableFooter({ children, ...props }) {
  return <tfoot {...props}>{children}</tfoot>;
}

function TableRow({ children, ...props }) {
  return <tr {...props}>{children}</tr>;
}

function TableHead({ children, ...props }) {
  return <th {...props}>{children}</th>;
}

function TableCell({ children, ...props }) {
  return <td {...props}>{children}</td>;
}

Table.Header = TableHeader;
Table.Body = TableBody;
Table.Footer = TableFooter;
Table.Row = TableRow;
Table.Head = TableHead;
Table.Cell = TableCell;

export { Table };

// Usage
<Table>
  <Table.Header>
    <Table.Row>
      <Table.Head>Nome</Table.Head>
      <Table.Head>Preço</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {products.map(product => (
      <Table.Row key={product.id}>
        <Table.Cell>{product.nome}</Table.Cell>
        <Table.Cell>{product.preco}</Table.Cell>
      </Table.Row>
    ))}
  </Table.Body>
</Table>
```

## Naming Convention

Sub-components should be named: `ParentComponentChildComponent`

```jsx
// Component: ProductCard
ProductCard.Header → ProductCardHeader
ProductCard.Title → ProductCardTitle
ProductCard.Footer → ProductCardFooter

// Component: Modal
Modal.Header → ModalHeader
Modal.Body → ModalBody
Modal.Footer → ModalFooter
```

## File Organization

All sub-components in the same file:

```
src/components/product-card/
└── product-card.jsx  // Contains ProductCard and all sub-components
```

Or separate files if complex:

```
src/components/product-card/
├── product-card.jsx
├── product-card-header.jsx
├── product-card-body.jsx
└── product-card-footer.jsx
```

## When to Use

Use Composite Pattern when component has:
- Multiple distinct sections (header, body, footer)
- Flexible content arrangement
- Optional sections
- Different layouts for different use cases
- More than 2-3 content props

## Benefits

1. **No prop drilling**: Content passed directly where it belongs
2. **Flexible ordering**: Users decide section order
3. **Optional sections**: Render only what's needed
4. **Type safety**: Each sub-component has its own props
5. **Composition over configuration**: Combine components, don't configure them

## Anti-Pattern

Never use render props or slots pattern instead of composite:

```jsx
// ❌ WRONG - render props
<Card
  renderHeader={() => <h2>Title</h2>}
  renderBody={() => <p>Content</p>}
  renderFooter={() => <button>Action</button>}
/>

// ❌ WRONG - slots
<Card
  header={<h2>Title</h2>}
  body={<p>Content</p>}
  footer={<button>Action</button>}
/>

// ✅ CORRECT - composite
<Card>
  <Card.Header><h2>Title</h2></Card.Header>
  <Card.Body><p>Content</p></Card.Body>
  <Card.Footer><button>Action</button></Card.Footer>
</Card>
```

## Exceptions

Simple components with single purpose don't need composite pattern:

```jsx
// ✅ OK - single purpose component
export function Button({ children, variant, ...props }) {
  return <button {...props}>{children}</button>;
}

// ✅ OK - simple wrapper
export function Container({ children, ...props }) {
  return <div {...props}>{children}</div>;
}
```

Use Composite Pattern for any component with multiple distinct sections or flexible content structure.

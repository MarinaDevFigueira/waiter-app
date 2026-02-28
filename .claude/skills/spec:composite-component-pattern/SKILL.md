---
name: spec:composite-component-pattern
description: "Composite Component Pattern"
---

# Composite Component Pattern

Complex components must use the composite pattern for flexibility and reusability.

## Rule

Break complex components into composable sub-components instead of monolithic implementations.

**Structure:**
```
ComponentName (root container)
ComponentName.Part1
ComponentName.Part2
ComponentName.Part3
```

Each sub-component handles its own rendering and can be used independently or composed together.

## When to Use

Use composite pattern when:
- Component has multiple distinct visual sections (header, body, footer)
- Component needs flexible customization
- Component will be reused with different content arrangements
- Component has more than 50 lines of JSX

## Implementation

### 1. Create Root Component

```jsx
export function Card({ children, className, ...props }) {
  return (
    <div className={cn("card-base", className)} {...props}>
      {children}
    </div>
  );
}
```

### 2. Create Sub-Components

```jsx
function CardHeader({ children, className, ...props }) {
  return (
    <div className={cn("card-header", className)} {...props}>
      {children}
    </div>
  );
}

function CardBody({ children, className, ...props }) {
  return (
    <div className={cn("card-body", className)} {...props}>
      {children}
    </div>
  );
}

function CardFooter({ children, className, ...props }) {
  return (
    <div className={cn("card-footer", className)} {...props}>
      {children}
    </div>
  );
}
```

### 3. Attach as Properties

```jsx
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
```

### 4. Export Root

```jsx
export { Card };
```

## Usage

```jsx
<Card>
  <Card.Header>
    <h2>Title</h2>
  </Card.Header>
  <Card.Body>
    <p>Content here</p>
  </Card.Body>
  <Card.Footer>
    <button>Action</button>
  </Card.Footer>
</Card>
```

## Complete Example

```jsx
import { cn } from "@/lib/utils";

// Root component
export function OrderCard({ children, className, orderId, status, ...props }) {
  return (
    <div
      className={cn("flex flex-col bg-card border rounded-lg overflow-hidden", className)}
      data-order-id={orderId}
      data-status={status}
      {...props}
    >
      {children}
    </div>
  );
}

// Sub-components
function OrderCardHeader({ children, className, ...props }) {
  return (
    <div
      className={cn("bg-primary/5 border-b px-4 py-3 flex items-center justify-between", className)}
      {...props}
    >
      {children}
    </div>
  );
}

function OrderCardItems({ children, className, ...props }) {
  return (
    <div
      className={cn("flex-1 overflow-y-auto px-4 py-3 space-y-2", className)}
      {...props}
    >
      {children}
    </div>
  );
}

function OrderCardFooter({ children, className, ...props }) {
  return (
    <div
      className={cn("px-4 py-2 border-t flex items-center justify-between", className)}
      {...props}
    >
      {children}
    </div>
  );
}

// Attach to root
OrderCard.Header = OrderCardHeader;
OrderCard.Items = OrderCardItems;
OrderCard.Footer = OrderCardFooter;

// Usage
<OrderCard orderId={order.id} status={order.status}>
  <OrderCard.Header>
    <h3>{order.table}</h3>
    <span>{time}</span>
  </OrderCard.Header>
  <OrderCard.Items>
    {order.items.map(item => <Item key={item.id} {...item} />)}
  </OrderCard.Items>
  <OrderCard.Footer>
    <StatusBadge status={order.status} />
    <ActionsMenu />
  </OrderCard.Footer>
</OrderCard>
```

## Benefits

- **Flexibility**: Each part can be customized independently
- **Reusability**: Sub-components can be used in different combinations
- **Maintainability**: Each part has single responsibility
- **Readability**: Clear component structure in JSX
- **Testability**: Test each part independently

## Naming Convention

```
ComponentName          // Root (e.g., OrderCard)
ComponentName.Part     // Sub-component (e.g., OrderCard.Header)
```

**NEVER** use different base names:
```jsx
// ❌ WRONG
OrderCard
OrderHeader  // Different base name

// ✅ CORRECT
OrderCard
OrderCard.Header  // Same base name
```

## File Structure

```
order-card/
├── order-card.jsx           # Root + all sub-components in one file
└── __tests__/
    └── order-card.spec.js
```

**NEVER** split sub-components into separate files. Keep them together for cohesion.

## Why

- Follows React best practices (similar to Radix UI, Headless UI)
- Enables flexible composition without prop drilling
- Maintains component cohesion while allowing customization
- Improves code organization and readability

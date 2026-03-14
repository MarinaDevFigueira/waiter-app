## Composite Pattern
All multi-section components use composite pattern. Never props for sections.

```jsx
function Card({ children }) { return <div>{children}</div>; }
Card.Header = function CardHeader({ children }) { return <header>{children}</header>; };
// Usage: <Card><Card.Header>Title</Card.Header></Card>
```

Sub-components in same file. Named `ParentNameSubName`. Attached as properties.
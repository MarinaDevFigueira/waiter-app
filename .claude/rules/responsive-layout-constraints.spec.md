# Responsive layout with max content constraints

All pages must use full viewport with centered content limited to max dimensions.

## Rule

- Pages use full viewport: `w-screen` and `h-screen` or `min-h-screen`
- Content container: `max-w-7xl` (1280px) and `max-h-[720px]`
- Content always centered: `flex items-center justify-center`
- Responsive design: content scales down on smaller screens

### w-screen vs w-full

- **Use `w-screen`**: For top-level containers rendered by router or when parent width is unknown
- **Use `w-full`**: For nested components where parent width is controlled
- **Why**: `w-full` (100%) depends on parent width; `w-screen` (100vw) uses viewport width

Router-rendered components (like `defaultNotFoundComponent`) MUST use `w-screen` because TanStack Router may wrap them in containers without explicit width.

## Example

```jsx
// WRONG - no viewport constraints, content not centered
<div className="container mx-auto">
  <Card>...</Card>
</div>

// WRONG - hardcoded max-width
<div className="w-full max-w-[1280px]">
  <Card>...</Card>
</div>

// WRONG - using w-full on router-rendered component (parent width unknown)
export function DefaultNotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <Card>...</Card>
    </div>
  );
}

// CORRECT - Router-rendered components (NotFound, Login, etc.)
export function DefaultNotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen w-screen bg-background p-4">
      <Card className="w-full max-w-md">
        {/* w-screen on outer div, w-full on Card (parent width controlled) */}
      </Card>
    </div>
  );
}

// CORRECT - Login/Auth pages
<div className="min-h-screen w-screen flex items-center justify-center bg-secondary/30 p-4">
  <div className="w-full h-full max-w-7xl max-h-[720px] flex items-center justify-center">
    <Card className="w-full max-w-md">
      {/* Content */}
    </Card>
  </div>
</div>

// CORRECT - App pages with layout
export function AppLayout({ children }) {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-start bg-background">
      <div className="w-full h-full max-w-7xl max-h-[720px] flex flex-col">
        <header>{/* Header */}</header>
        <main className="w-full flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
```

## Why

- **max-w-7xl**: Equivalent to 1280px, optimal content width for desktop viewing
- **max-h-[720px]**: Optimal content height, prevents excessive scrolling
- **Centered content**: Professional appearance, works across screen sizes
- **Full viewport**: Ensures consistent layout regardless of screen size
- **Responsive**: Content naturally scales down on mobile without breaking

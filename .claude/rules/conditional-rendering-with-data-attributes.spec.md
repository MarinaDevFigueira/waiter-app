# Conditional Rendering with Data Attributes

## When to Use

Use `data-*` attributes for conditional styling instead of ternary operators or conditional class strings.

**Use data attributes when:**
- Element styling changes based on state/props
- You need multiple conditional variants
- Styles depend on boolean or enum values
- You want declarative, readable conditional styles

**Do NOT use data attributes for:**
- Conditional rendering (use `&&` or ternary operators)
- Showing/hiding elements (use conditional rendering instead)

## Pattern

### Basic Conditional Styling

```tsx
// ❌ BAD - Ternary operator in className
<Button
  className={isSuccess ? "bg-white text-primary" : "bg-primary text-white"}
/>

// ✅ GOOD - data attribute
<Button
  data-success={isSuccess}
  className="data-[success=true]:bg-white data-[success=true]:text-primary data-[success=false]:bg-primary data-[success=false]:text-white"
/>
```

### Multiple States

```tsx
// ❌ BAD - Complex ternary logic
<div
  className={`
    ${status === "pending" ? "bg-yellow-500" : ""}
    ${status === "success" ? "bg-green-500" : ""}
    ${status === "error" ? "bg-red-500" : ""}
  `}
/>

// ✅ GOOD - data attribute with enum
<div
  data-status={status}
  className="data-[status=pending]:bg-yellow-500 data-[status=success]:bg-green-500 data-[status=error]:bg-red-500"
/>
```

### Multiple Conditions

```tsx
// ❌ BAD - Multiple ternaries
<Card
  className={`
    ${isActive ? "border-primary" : "border-muted"}
    ${isHovered ? "shadow-lg" : "shadow-sm"}
    ${isDisabled ? "opacity-50" : "opacity-100"}
  `}
/>

// ✅ GOOD - Multiple data attributes
<Card
  data-active={isActive}
  data-hovered={isHovered}
  data-disabled={isDisabled}
  className="data-[active=true]:border-primary data-[active=false]:border-muted data-[hovered=true]:shadow-lg data-[hovered=false]:shadow-sm data-[disabled=true]:opacity-50 data-[disabled=false]:opacity-100"
/>
```

## Naming Conventions

### Data Attribute Names
- Use `camelCase` for data attributes: `data-isActive`, `data-isSelected`
- Use descriptive names: `data-status`, `data-variant`, `data-size`
- Avoid abbreviations: `data-isSelected` not `data-sel`

### Values
- **Boolean states:** `true` or `false` (always strings)
- **Enum states:** specific strings (`"pending"`, `"success"`, `"error"`)
- **Never use numbers** directly (convert to strings if needed)

## Examples from Codebase

### Category Tab Selection
```tsx
<li
  data-selected={selected}
  onClick={handleSelect}
  className="data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground data-[selected=false]:text-muted-foreground"
>
  {label}
</li>
```

### Button Variants
```tsx
<Button
  data-variant={variant}
  className="data-[variant=primary]:bg-primary data-[variant=secondary]:bg-secondary data-[variant=ghost]:bg-transparent"
/>
```

### Order Status Badge
```tsx
<Badge
  data-status={order.status}
  className="data-[status=pending]:bg-yellow-100 data-[status=preparing]:bg-blue-100 data-[status=ready]:bg-green-100"
>
  {order.status}
</Badge>
```

## Best Practices

### ✅ DO

- **Use data attributes for styling** - Keep styling logic in className
- **Use meaningful names** - `data-isSelected` not `data-sel`
- **Keep values simple** - Boolean (`true`/`false`) or enum strings
- **Group related styles** - All variants for one attribute together
- **Use with Tailwind** - Leverage `data-[*]:` modifier classes

### ❌ DON'T

- **Don't use for conditional rendering** - Use `{condition && <Element />}` instead
- **Don't use complex values** - Keep to booleans or simple enums
- **Don't nest ternaries** - Use data attributes to avoid this
- **Don't mix patterns** - Don't combine ternaries with data attributes
- **Don't use for show/hide** - Use conditional rendering instead

## Common Patterns

### Toggle States

```tsx
// Toggle button (on/off)
<button
  data-toggled={isToggled}
  className="data-[toggled=true]:bg-primary data-[toggled=false]:bg-muted"
>
  {isToggled ? "On" : "Off"}
</button>
```

### Loading States

```tsx
// Loading button
<Button
  data-loading={isLoading}
  disabled={isLoading}
  className="data-[loading=true]:opacity-50 data-[loading=true]:cursor-not-allowed"
>
  {isLoading ? "Loading..." : "Submit"}
</Button>
```

### Size Variants

```tsx
// Size variants
<div
  data-size={size}
  className="data-[size=sm]:text-sm data-[size=md]:text-base data-[size=lg]:text-lg data-[size=sm]:p-2 data-[size=md]:p-4 data-[size=lg]:p-6"
>
  Content
</div>
```

### Hover/Focus States

```tsx
// Hover state tracked in component
const [isHovered, setIsHovered] = useState(false);

<div
  data-hovered={isHovered}
  onMouseEnter={() => setIsHovered(true)}
  onMouseLeave={() => setIsHovered(false)}
  className="data-[hovered=true]:shadow-lg data-[hovered=false]:shadow-sm transition-shadow"
>
  Hover me
</div>
```

## Migration Guide

### From Ternary to Data Attribute

```tsx
// BEFORE
<div className={isActive ? "bg-primary text-white" : "bg-muted text-muted-foreground"}>

// AFTER
<div
  data-active={isActive}
  className="data-[active=true]:bg-primary data-[active=true]:text-white data-[active=false]:bg-muted data-[active=false]:text-muted-foreground"
>
```

### From cn() Template to Data Attribute

```tsx
// BEFORE
<div className={cn("base-class", isSelected && "selected-class", isDisabled && "disabled-class")}>

// AFTER
<div
  data-selected={isSelected}
  data-disabled={isDisabled}
  className="base-class data-[selected=true]:selected-class data-[disabled=true]:disabled-class"
>
```

## TypeScript Support

```tsx
interface ButtonProps {
  variant: "primary" | "secondary" | "ghost";
  size: "sm" | "md" | "lg";
  isLoading?: boolean;
}

function Button({ variant, size, isLoading = false }: ButtonProps) {
  return (
    <button
      data-variant={variant}
      data-size={size}
      data-loading={isLoading}
      className="data-[variant=primary]:bg-primary data-[size=sm]:text-sm data-[loading=true]:opacity-50"
    />
  );
}
```

## Testing

Data attributes make testing easier:

```tsx
// Test file
const button = screen.getByRole("button");

// Check data attribute
expect(button).toHaveAttribute("data-active", "true");

// Or use data-testid
expect(screen.getByTestId("submit-button")).toHaveAttribute("data-loading", "false");
```

## Performance

Data attributes with Tailwind are optimized:
- **No runtime className concatenation** - All classes are static in className string
- **PurgeCSS friendly** - Unused variants are removed in production
- **CSS specificity** - Data attribute selectors have consistent specificity
- **No JavaScript overhead** - Pure CSS, no conditional logic in render

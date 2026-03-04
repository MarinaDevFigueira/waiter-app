# Use named variables instead of inline conditionals

Always extract conditional expressions into named variables instead of using them directly in JSX.

## Rule

- **NEVER** use ternary operators (`? :`) directly in JSX
- **NEVER** use logical AND (`&&`) for conditional rendering in JSX
- **NEVER** use nullish coalescing (`??`) directly in JSX
- **ALWAYS** create a descriptive named variable or useMemo for the result
- Variable name should describe WHAT it is, not HOW it's calculated
- Apply to all conditional values: strings, booleans, numbers, objects, components
- Use `if` statements, object maps, or helper functions instead

## Why

- **Readability**: Named variables explain intent at a glance
- **Debuggability**: Can inspect variable values during debugging
- **Maintainability**: Logic changes only affect variable declaration
- **Testability**: Variables can be unit tested independently
- **Self-documenting**: Variable name serves as inline documentation

## Examples

### Example 1: Variant Selection

```jsx
// WRONG — inline ternary
<Button variant={isSuccess ? "outline" : "default"}>
  Submit
</Button>

// CORRECT — named variable
const buttonVariant = isSuccess ? "outline" : "default";

<Button variant={buttonVariant}>
  Submit
</Button>
```

### Example 2: className Conditionals

```jsx
// WRONG — inline ternary
<div className={isActive ? "bg-primary text-white" : "bg-secondary text-foreground"}>
  Content
</div>

// CORRECT — named variable
const containerStyles = isActive ? "bg-primary text-white" : "bg-secondary text-foreground";

<div className={containerStyles}>
  Content
</div>
```

### Example 3: Icon Selection

```jsx
// WRONG — inline ternary
<Button>
  {isDark ? <SunIcon /> : <MoonIcon />}
</Button>

// CORRECT — named variable
const ThemeIcon = isDark ? SunIcon : MoonIcon;

<Button>
  <ThemeIcon />
</Button>
```

### Example 4: Text Content

```jsx
// WRONG — inline ternary
<Button aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}>
  Toggle
</Button>

// CORRECT — named variable
const ariaLabel = isDark ? "Switch to light mode" : "Switch to dark mode";

<Button aria-label={ariaLabel}>
  Toggle
</Button>
```

### Example 5: Complex Conditionals

```jsx
// WRONG — nested ternaries
<Card variant={isSuccess ? "primary" : isWarning ? "warning" : "default"}>
  Content
</Card>

// CORRECT — named variable with clear logic
const cardVariant = isSuccess ? "primary"
  : isWarning ? "warning"
  : "default";

<Card variant={cardVariant}>
  Content
</Card>

// BETTER — if-else for complex logic
let cardVariant = "default";
if (isSuccess) {
  cardVariant = "primary";
} else if (isWarning) {
  cardVariant = "warning";
}

<Card variant={cardVariant}>
  Content
</Card>
```

### Example 6: Logical AND (&&) - Conditional Rendering

```jsx
// WRONG — inline &&
<div>
  {user && <UserProfile user={user} />}
  {orders.length > 0 && <OrdersList orders={orders} />}
</div>

// STILL WRONG — boolean variable with &&
const shouldShowProfile = Boolean(user);
const shouldShowOrders = orders.length > 0;

<div>
  {shouldShowProfile && <UserProfile user={user} />}
  {shouldShowOrders && <OrdersList orders={orders} />}
</div>

// CORRECT — useMemo determines content
const profileContent = useMemo(() => {
  if (!user) return null;
  return <UserProfile user={user} />;
}, [user]);

const ordersContent = useMemo(() => {
  if (orders.length === 0) return null;
  return <OrdersList orders={orders} />;
}, [orders]);

<div>
  {profileContent}
  {ordersContent}
</div>
```

### Example 7: Nullish Coalescing (??) - Default Values

```jsx
// WRONG — inline ??
<div className={theme ?? "light"}>
  <span>{username ?? "Guest"}</span>
</div>

// CORRECT — named variables
const effectiveTheme = theme ?? "light";
const displayName = username ?? "Guest";

<div className={effectiveTheme}>
  <span>{displayName}</span>
</div>
```

## Exceptions

**NO EXCEPTIONS.** All conditional logic must be extracted.

- NO ternaries (`? :`) in JSX
- NO logical AND (`&&`) in JSX - even with boolean variables
- NO nullish coalescing (`??`) in JSX

Use `useMemo`, helper functions, or pre-computed variables instead.

## Enforcement

During code review, any conditional operator (`? :`, `&&`, `??`) in JSX must be extracted. The JSX should only render variables, never contain logic.

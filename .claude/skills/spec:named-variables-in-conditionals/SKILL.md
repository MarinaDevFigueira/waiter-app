---
name: spec:named-variables-in-conditionals
description: "Use named variables in if conditions"
---

# Use named variables in if conditions

Always use named variables in if statements instead of inline validation expressions. The variable name should describe WHAT is being checked, not HOW.

## Rule

- **NEVER** use inline expressions in if conditions
- **NEVER** use compound boolean logic directly in if statements
- **ALWAYS** extract condition to a descriptive named variable
- Variable name should describe the INTENT, not the implementation
- Apply to if, else if, while, for conditions

## Why

- **Readability**: Named variables explain intent immediately
- **Debuggability**: Can inspect boolean value during debugging
- **Self-documenting**: Variable name serves as inline documentation
- **Maintainability**: Logic changes don't affect control flow structure
- **Testability**: Conditions can be unit tested independently

## Examples

### Example 1: Simple Validation

```jsx
// ❌ WRONG - inline validation
if (user && user.role === 'admin') {
  return <AdminPanel />;
}

// ✅ CORRECT - named variable
const canAccessAdminPanel = user && user.role === 'admin';

if (canAccessAdminPanel) {
  return <AdminPanel />;
}
```

### Example 2: Compound Conditions

```jsx
// ❌ WRONG - complex inline expression
if (products.length === 0 && !isLoading && !error) {
  return <EmptyState />;
}

// ✅ CORRECT - named variable
const shouldShowEmptyState = products.length === 0 && !isLoading && !error;

if (shouldShowEmptyState) {
  return <EmptyState />;
}
```

### Example 3: Multiple Conditions

```jsx
// ❌ WRONG - inline checks
if (user && !user.isVerified) {
  return <VerificationRequired />;
}

if (user && user.subscription && user.subscription.status === 'active') {
  return <PremiumFeatures />;
}

// ✅ CORRECT - named variables
const needsVerification = user && !user.isVerified;
const hasPremiumAccess = user && user.subscription && user.subscription.status === 'active';

if (needsVerification) {
  return <VerificationRequired />;
}

if (hasPremiumAccess) {
  return <PremiumFeatures />;
}
```

### Example 4: State Checks

```jsx
// ❌ WRONG - inline state validation
if (isLoading) {
  return <LoadingSkeleton />;
}

if (products.length === 0) {
  return <EmptyState />;
}

// ✅ CORRECT - descriptive names
const isLoadingData = isLoading;
const hasNoProducts = products.length === 0;

if (isLoadingData) {
  return <LoadingSkeleton />;
}

if (hasNoProducts) {
  return <EmptyState />;
}
```

### Example 5: Negation

```jsx
// ❌ WRONG - inline negation
if (!isAuthenticated || !hasPermission) {
  return <AccessDenied />;
}

// ✅ CORRECT - positive variable name
const canAccessPage = isAuthenticated && hasPermission;

if (!canAccessPage) {
  return <AccessDenied />;
}
```

### Example 6: Array/Object Checks

```jsx
// ❌ WRONG - inline length check
if (table.getRowModel().rows.length === 0) {
  return <EmptyTable />;
}

// ✅ CORRECT - check source data with named variable
const hasNoData = products.length === 0;

if (hasNoData) {
  return <EmptyTable />;
}
```

## Pattern

Always extract condition logic:

```jsx
function Component({ data, isLoading, error }) {
  const isLoadingData = isLoading;
  const hasError = Boolean(error);
  const hasNoData = data.length === 0;
  const shouldShowContent = !isLoadingData && !hasError && !hasNoData;

  if (isLoadingData) return <Skeleton />;
  if (hasError) return <Error />;
  if (hasNoData) return <Empty />;
  if (shouldShowContent) return <Content data={data} />;

  return null;
}
```

## Naming Convention

Use descriptive prefixes:
- `can...` - permission/ability checks (canAccessPanel, canEditPost)
- `should...` - decision logic (shouldShowModal, shouldRedirect)
- `has...` - existence checks (hasPermission, hasData)
- `is...` - state checks (isLoading, isEmpty, isValid)
- `needs...` - requirement checks (needsVerification, needsUpdate)

## Exceptions

NO EXCEPTIONS. All conditions must be named variables.

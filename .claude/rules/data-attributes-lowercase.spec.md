# Data Attributes Must Be Lowercase

Custom data attributes in React must be all lowercase.

## Rule

All custom `data-*` attributes must use **lowercase only** (no camelCase, no PascalCase).

React will throw a warning if data attributes use uppercase letters.

## Example

```jsx
// ❌ WRONG - React will warn
<div data-isSuccess={true} className="data-[isSuccess=true]:bg-green">
<div data-userId={id} className="data-[userId='123']:hidden">
<div data-showModal={open} className="data-[showModal=true]:block">

// ✅ CORRECT - All lowercase
<div data-issuccess={true} className="data-[issuccess=true]:bg-green">
<div data-userid={id} className="data-[userid='123']:hidden">
<div data-showmodal={open} className="data-[showmodal=true]:block">
```

## Naming Convention

Use lowercase with hyphens if needed for readability:

```jsx
// ✅ Good - single word lowercase
<div data-active={isActive}>
<div data-status={status}>

// ✅ Good - hyphenated lowercase
<div data-is-success={isSuccess}>
<div data-user-id={userId}>
<div data-show-modal={showModal}>
```

## In Tailwind Classes

Remember to update Tailwind classes to match:

```jsx
// Both attribute AND selector must match
<div
  data-issuccess={isSuccess}
  className="data-[issuccess=true]:text-green data-[issuccess=false]:text-red"
>
```

## Why

React's DOM validation enforces this rule to maintain consistency with HTML standards. Custom attributes in HTML are case-insensitive, so React requires lowercase to avoid confusion and ensure proper attribute matching.

## Common Mistakes

```jsx
// ❌ Copying from JavaScript variable names
const isActive = true;
<div data-isActive={isActive}>  // Wrong!

// ✅ Convert to lowercase
const isActive = true;
<div data-isactive={isActive}>  // Correct!
```

---
name: spec:component-isolation-no-duplication
description: "Never duplicate UI code - isolate into reusable components"
---

# Never duplicate UI code - isolate into reusable components

Extract repeated UI patterns into dedicated components instead of duplicating code.

## Rule

- If the same UI code appears in 2+ places, create a component
- Component should live in `src/components/ui/` for shared UI elements
- Component should accept `className` prop for styling customization
- Use descriptive component names that describe what it is, not where it's used
- Never copy-paste component markup between files

## Example

```jsx
// WRONG — duplicated logo code
// dashboard-layout.jsx
<h1 className="text-lg font-bold font-title uppercase">
  <span className="text-primary">Waiter</span>
  <span className="font-extralight">App</span>
</h1>

// app-layout.jsx
<h1 className="text-xl font-bold font-title uppercase">
  <span className="text-primary">Waiter</span>
  <span className="font-extralight">App</span>
</h1>

// CORRECT — isolated component
// components/ui/logo/logo.jsx
export function Logo({ className = "" }) {
  return (
    <h1 className={`font-bold font-title uppercase ${className}`}>
      <span className="text-primary">Waiter</span>
      <span className="font-extralight">App</span>
    </h1>
  )
}

// dashboard-layout.jsx
import { Logo } from "@/components/ui/logo/logo"

<Logo className="text-lg" />

// app-layout.jsx
import { Logo } from "@/components/ui/logo/logo"

<Logo className="text-xl" />
```

## Why

Component isolation eliminates duplication, ensures consistency, makes updates easier (change once, apply everywhere), and follows DRY (Don't Repeat Yourself) principle. Accepting className prop enables context-specific styling while maintaining shared structure.

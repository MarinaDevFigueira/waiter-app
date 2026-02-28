---
name: spec:group-data-attribute-pattern
description: "Use group with data attributes for nested element styling"
---

# Use group with data attributes for nested element styling

When child elements need to respond to a parent's data attribute state, use Tailwind's `group` pattern.

## Rule

- Add `group` class to the parent element that has the data attribute
- Use `group-data-[attr=value]:class` on child elements to style based on parent's state
- Never use ternaries for conditional styling - always use data attributes
- Apply the pattern consistently across all nested elements

## Example

```jsx
// WRONG — ternary for conditional styling
<Link className={isActive ? "bg-primary" : ""}>
  <Icon className={isActive ? "text-white" : "text-foreground"} />
  <span className={isActive ? "text-white" : "text-foreground"}>Label</span>
</Link>

// WRONG — data attributes without group (won't work on nested elements)
<Link data-active={isActive} className="data-[active=true]:bg-primary">
  <Icon className="data-[active=true]:text-white" />
  <span className="data-[active=true]:text-white">Label</span>
</Link>

// CORRECT — group with data attributes
<Link
  data-active={isActive}
  className="group data-[active=true]:bg-primary"
>
  <Icon className="group-data-[active=true]:text-white" />
  <span className="group-data-[active=true]:text-white">Label</span>
</Link>
```

## Why

The `group` pattern allows child elements to access parent's data attribute state. Without `group`, `data-[active=true]:text-white` on child elements won't work because they check their own data attributes, not the parent's. The `group-data-[active=true]:class` syntax specifically targets the parent's data attribute state.

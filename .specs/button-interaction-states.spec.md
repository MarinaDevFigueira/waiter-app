# Button interaction states

All buttons must have proper cursor and visual feedback for user interactions.

## Rule

- Buttons MUST have `cursor-pointer` on hover
- Buttons MUST have visible shadow or visual feedback on `:active` state
- Use Tailwind classes: `hover:cursor-pointer` and `active:shadow-*` or `active:scale-*`
- Apply to all clickable elements: `<button>`, custom Button components, clickable divs

## Example

```jsx
// WRONG - no cursor pointer, no active feedback
<button className="bg-primary text-white px-4 py-2 rounded">
  Click me
</button>

// WRONG - has hover but no active state
<Button className="hover:cursor-pointer">
  Click me
</Button>

// CORRECT - cursor pointer and active shadow
<button className="bg-primary text-white px-4 py-2 rounded hover:cursor-pointer active:shadow-lg">
  Click me
</button>

// CORRECT - cursor pointer and active scale
<Button className="hover:cursor-pointer active:scale-95">
  Click me
</Button>

// CORRECT - using Tailwind utilities
<button className="bg-primary hover:cursor-pointer active:shadow-inner transition-all">
  Click me
</button>
```

## Why

Proper cursor and visual feedback improve UX by clearly indicating interactive elements and providing tactile response when clicked. The cursor pointer shows the element is clickable, and active state feedback confirms the interaction was registered.

## No Chained Ternaries
Use object map instead:
```jsx
// ✅
const STATUS_COLORS = { success: "green", error: "red", default: "gray" };
const color = STATUS_COLORS[status] ?? STATUS_COLORS.default;
```
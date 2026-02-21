# No Comments

Code must be self-documenting. Never add comments.

## Rule

**NEVER** add comments to code. No exceptions.

```javascript
// ❌ WRONG - has comments
function OrderCard() {
  // Root component
  return (
    <div>
      {/* Header section */}
      <div>...</div>
    </div>
  );
}

// ✅ CORRECT - no comments
function OrderCard() {
  return (
    <div>
      <div>...</div>
    </div>
  );
}
```

## Why

- Comments become outdated and misleading
- Good code is self-explanatory through:
  - Descriptive variable names
  - Small, focused functions
  - Clear component structure
  - Proper naming conventions
- If code needs a comment to be understood, refactor it instead

## What to Do Instead

Instead of comments, use:

1. **Descriptive names**
   ```javascript
   // ❌ WRONG
   const x = data.filter(i => i.s === 'active'); // Get active items

   // ✅ CORRECT
   const activeItems = data.filter(item => item.status === 'active');
   ```

2. **Extract to functions**
   ```javascript
   // ❌ WRONG
   // Calculate total price with discount
   const total = items.reduce((sum, item) => sum + item.price, 0) * 0.9;

   // ✅ CORRECT
   const calculateTotalWithDiscount = (items) => {
     const subtotal = items.reduce((sum, item) => sum + item.price, 0);
     const discountRate = 0.9;
     return subtotal * discountRate;
   };
   const total = calculateTotalWithDiscount(items);
   ```

3. **Component structure**
   ```javascript
   // ❌ WRONG
   <div>
     {/* User info section */}
     <div>{user.name}</div>
     {/* Actions section */}
     <div>...</div>
   </div>

   // ✅ CORRECT - use composite pattern
   <Card>
     <Card.UserInfo name={user.name} />
     <Card.Actions>...</Card.Actions>
   </Card>
   ```

## Types of Comments to Avoid

**All of them:**
- Inline comments (`// comment`)
- Block comments (`/* comment */`)
- JSX comments (`{/* comment */}`)
- Section headers (`// ===== Section =====`)
- TODOs (`// TODO: fix this`)
- Function descriptions
- Parameter descriptions
- Variable explanations

## Enforcement

During code review, any comment found must be removed and the code refactored for clarity.

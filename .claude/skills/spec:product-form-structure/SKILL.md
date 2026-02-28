---
name: spec:product-form-structure
description: "Product Form Component Structure"
---

# Product Form Component Structure

## File Organization
```
src/pages/products/components/product-form-dialog/
├── product-form-dialog.tsx - Main form logic
├── product-form-dialog.interface.ts - TypeScript interfaces
├── language-switcher.tsx - Language selection UI
├── unsaved-changes-dialog.tsx - Confirmation dialog
├── fields.tsx - Form field wrappers
└── footer.tsx - Form footer with buttons
```

## Separation of Concerns
- Interfaces centralized in .interface.ts
- Each component in separate file
- No inline components in main file
- Follows project structure conventions

## Named Exports
All components use named exports (not default exports)

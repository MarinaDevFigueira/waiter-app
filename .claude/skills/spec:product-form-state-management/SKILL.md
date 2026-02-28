---
name: spec:product-form-state-management
description: "Product Form State Management"
---

# Product Form State Management

## State Variables
- `allTranslations` - All translations across languages
- `editingLanguage` - Current language being edited
- `showUnsavedDialog` - Controls unsaved changes modal
- `pendingLanguage` - Language user wants to switch to
- `hasInitializedRef` - Prevents re-initialization loop

## Preventing Infinite Loops
- NEVER add `language` to useEffect dependencies that call reset()
- Use setValue() instead of reset() for language switching
- Use hasInitializedRef to control one-time initialization

## TanStack Query
- useQuery for fetching translations (edit mode only)
- useMutation for create and update operations
- Proper cache invalidation after mutations

## Form Submission
- Collects current translation from form fields
- Merges with allTranslations state
- Filters translations without name
- Validates at least one complete translation exists

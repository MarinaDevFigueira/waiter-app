## Variants with Data Attributes
Use `data-*` for conditional styling — never ternaries in `className`.
- Data attributes MUST be lowercase: `data-isactive` not `data-isActive`.
- Parent state → children: add `group` to parent, use `group-data-[*]:` on children.

```jsx
<Button data-variant={variant} data-loading={isLoading}
  className="data-[variant=primary]:bg-primary data-[loading=true]:opacity-50" />
```
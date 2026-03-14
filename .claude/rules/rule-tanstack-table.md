## TanStack Table
- Define columns with `useMemo`. Use `flexRender` for headers/cells.
- Parent handles loading/empty — table only renders data.
- `{name}TableSkeleton` with `animate-pulse` for loading. Check source data in parent, not `table.getRowModel().rows.length`.
- Sorting: `getSortedRowModel()` + `[sorting, setSorting]` state.
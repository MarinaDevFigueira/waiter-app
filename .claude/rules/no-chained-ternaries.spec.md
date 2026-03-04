# No Chained Ternaries

Never use chained ternary operators. Use if-else statements or object maps instead.

## Rule

- **NEVER** chain more than one ternary operator
- **NEVER** use nested ternaries
- **ALWAYS** use if-else statements for multiple conditions
- **ALWAYS** use object/map lookup for value selection
- Ternaries are only acceptable for simple binary choices

## Why

- **Readability**: Chained ternaries are hard to parse mentally
- **Maintainability**: Adding conditions to ternaries is error-prone
- **Debugging**: Can't set breakpoints in ternary branches
- **Clarity**: if-else makes the logic flow explicit

## Examples

### Example 1: Multiple Conditions

```jsx
// ❌ WRONG - chained ternaries
const sortTitle = !canSort ? undefined
  : nextSortOrder === "asc" ? "Ordenar crescente"
  : nextSortOrder === "desc" ? "Ordenar decrescente"
  : "Remover ordenação";

// ✅ CORRECT - if-else with named variables
let sortTitle = undefined;

const isSortable = canSort;
const isSortAscending = nextSortOrder === "asc";
const isSortDescending = nextSortOrder === "desc";
const hasNoSortOrder = !nextSortOrder;

if (isSortable && isSortAscending) {
  sortTitle = "Ordenar crescente";
}

if (isSortable && isSortDescending) {
  sortTitle = "Ordenar decrescente";
}

if (isSortable && hasNoSortOrder) {
  sortTitle = "Remover ordenação";
}

// ✅ BETTER - object map
const SORT_TITLES = {
  asc: "Ordenar crescente",
  desc: "Ordenar decrescente",
  default: "Remover ordenação",
};

const defaultSortTitle = SORT_TITLES.default;
const sortTitle = canSort ? (SORT_TITLES[nextSortOrder] || defaultSortTitle) : undefined;
```

### Example 2: Status Selection

```jsx
// ❌ WRONG - nested ternaries
const status = isSuccess ? "success"
  : isWarning ? "warning"
  : isError ? "error"
  : "default";

// ✅ CORRECT - if-else with early assignment
let status = "default";

if (isSuccess) {
  status = "success";
}

if (isWarning) {
  status = "warning";
}

if (isError) {
  status = "error";
}

// ✅ BETTER - early returns (if in function)
function getStatus() {
  if (isSuccess) return "success";
  if (isWarning) return "warning";
  if (isError) return "error";
  return "default";
}

const status = getStatus();
```

### Example 3: Icon Selection

```jsx
// ❌ WRONG - chained ternaries
const Icon = isSortedAsc ? ArrowUpIcon
  : isSortedDesc ? ArrowDownIcon
  : UnsortedIcon;

// ✅ CORRECT - object map
const SORT_ICONS = {
  asc: ArrowUpIcon,
  desc: ArrowDownIcon,
  unsorted: UnsortedIcon,
};

const sortDirection = isSortedAsc ? "asc" : isSortedDesc ? "desc" : "unsorted";
const Icon = SORT_ICONS[sortDirection];
```

## Acceptable Ternary Use

Single, simple ternaries are acceptable:

```jsx
// ✅ OK - simple binary choice
const buttonText = isLoading ? "Carregando..." : "Enviar";
const className = isActive ? "text-primary" : "text-muted";
const Icon = isOpen ? ChevronUpIcon : ChevronDownIcon;
```

## Pattern: Object Map Lookup

For multiple value selections:

```jsx
const VALUE_MAP = {
  option1: "value1",
  option2: "value2",
  option3: "value3",
  default: "defaultValue",
};

const defaultValue = VALUE_MAP.default;
const value = VALUE_MAP[key] || defaultValue;
```

## Pattern: If-Else with Named Variables

For complex conditions:

```jsx
let result;

const meetsFirstCondition = condition1;
const meetsSecondCondition = condition2;
const meetsThirdCondition = condition3;

if (meetsFirstCondition) {
  result = value1;
}

if (meetsSecondCondition) {
  result = value2;
}

if (meetsThirdCondition) {
  result = value3;
}

if (!meetsFirstCondition && !meetsSecondCondition && !meetsThirdCondition) {
  result = defaultValue;
}
```

## Exceptions

NO EXCEPTIONS. Chained ternaries are never acceptable. Use if-else or object maps.

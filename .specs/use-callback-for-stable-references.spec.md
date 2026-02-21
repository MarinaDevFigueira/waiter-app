# Use useCallback for Stable Function References

Always use useCallback to memoize functions that need stable references across renders. Prevents unnecessary re-renders and maintains referential equality.

## Rule

- **ALWAYS** use useCallback for functions passed as props to child components
- **ALWAYS** use useCallback for functions used in dependency arrays (useEffect, useMemo, useCallback)
- **ALWAYS** use useCallback for event handlers that create closures over props/state
- **NEVER** create inline functions in JSX if the component might re-render frequently
- Declare all dependencies explicitly in the dependency array

## Why

- **Performance**: Prevents child components from re-rendering unnecessarily
- **Referential Equality**: Same function reference across renders
- **Dependency Arrays**: Stable references prevent infinite loops in useEffect
- **Predictability**: Clear dependencies make behavior explicit

## When to Use

### Always Use useCallback

1. **Functions passed as props to memoized components**
2. **Functions in useEffect/useMemo/useCallback dependency arrays**
3. **Event handlers in lists/mapped components**
4. **Functions that create closures over props/state**
5. **Callback functions passed to context providers**

### Can Skip useCallback

1. **Top-level component event handlers (onClick on buttons in root component)**
2. **Functions that don't close over props/state**
3. **Functions only used once in component body (not in dependencies)**
4. **Performance-insensitive components**

## Examples

### Example 1: Event Handler with Dependencies

```jsx
// ❌ WRONG - recreated every render
function ProductsFilters() {
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = () => {
    productsFiltersObservable.updateFilter("search", searchValue);
  };

  return <Button onClick={handleSearch}>Buscar</Button>;
}

// ✅ CORRECT - stable reference
function ProductsFilters() {
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = useCallback(() => {
    productsFiltersObservable.updateFilter("search", searchValue);
  }, [searchValue]);

  return <Button onClick={handleSearch}>Buscar</Button>;
}
```

### Example 2: Function in useEffect Dependency

```jsx
// ❌ WRONG - causes infinite loop
function ProductsList() {
  const fetchProducts = () => {
    return api.getProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]); // fetchProducts changes every render!
}

// ✅ CORRECT - stable reference
function ProductsList() {
  const fetchProducts = useCallback(() => {
    return api.getProducts();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
}
```

### Example 3: Function Passed to Child

```jsx
// ❌ WRONG - child re-renders unnecessarily
function ParentComponent() {
  const [count, setCount] = useState(0);

  const handleClick = (id) => {
    console.log("Clicked", id);
  };

  return <ChildComponent onClick={handleClick} />;
}

// ✅ CORRECT - child only re-renders when needed
function ParentComponent() {
  const [count, setCount] = useState(0);

  const handleClick = useCallback((id) => {
    console.log("Clicked", id);
  }, []);

  return <ChildComponent onClick={handleClick} />;
}
```

### Example 4: Multiple Dependencies

```jsx
// ❌ WRONG - missing dependencies
function FilterForm({ filters, onApply }) {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleApply = useCallback(() => {
    onApply(localFilters);
  }, []); // Missing localFilters and onApply!

  return <Button onClick={handleApply}>Apply</Button>;
}

// ✅ CORRECT - all dependencies declared
function FilterForm({ filters, onApply }) {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleApply = useCallback(() => {
    onApply(localFilters);
  }, [localFilters, onApply]);

  return <Button onClick={handleApply}>Apply</Button>;
}
```

### Example 5: Toggle Functions

```jsx
// ❌ WRONG - recreated every render
function MultiSelect({ value, onChange }) {
  const handleToggle = (item) => {
    const isSelected = value.includes(item);
    const newValue = isSelected
      ? value.filter((v) => v !== item)
      : [...value, item];
    onChange(newValue);
  };

  return items.map(item => (
    <Checkbox key={item} onClick={() => handleToggle(item)} />
  ));
}

// ✅ CORRECT - memoized with dependencies
function MultiSelect({ value, onChange }) {
  const handleToggle = useCallback((item) => {
    const isSelected = value.includes(item);
    const newValue = isSelected
      ? value.filter((v) => v !== item)
      : [...value, item];
    onChange(newValue);
  }, [value, onChange]);

  return items.map(item => (
    <Checkbox key={item} onClick={() => handleToggle(item)} />
  ));
}
```

### Example 6: Form Handlers

```jsx
// ❌ WRONG - no memoization
function ProductsFilters() {
  const handleClearFilters = () => {
    productsFiltersObservable.resetFilters();
    reset();
    setIsModalOpen(false);
  };

  const handleApplyFilters = (data) => {
    productsFiltersObservable.setFilters(data);
    setIsModalOpen(false);
  };

  return (
    <form onSubmit={handleSubmit(handleApplyFilters)}>
      <Button onClick={handleClearFilters}>Clear</Button>
      <Button type="submit">Apply</Button>
    </form>
  );
}

// ✅ CORRECT - all handlers memoized
function ProductsFilters() {
  const handleClearFilters = useCallback(() => {
    productsFiltersObservable.resetFilters();
    reset();
    setIsModalOpen(false);
  }, [reset]);

  const handleApplyFilters = useCallback((data) => {
    productsFiltersObservable.setFilters(data);
    setIsModalOpen(false);
  }, []);

  return (
    <form onSubmit={handleSubmit(handleApplyFilters)}>
      <Button onClick={handleClearFilters}>Clear</Button>
      <Button type="submit">Apply</Button>
    </form>
  );
}
```

## Pattern: Extract to Module Scope

If a function doesn't depend on props/state, declare it outside the component:

```jsx
// ✅ BEST - no useCallback needed
const formatCurrency = (value) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

function ProductCard({ price }) {
  const formattedPrice = formatCurrency(price);
  return <span>{formattedPrice}</span>;
}
```

## Dependency Array Rules

1. **Include ALL variables** from component scope used in the function
2. **Include props** that are used
3. **Include state** that is used
4. **Include other callbacks** that are called
5. **Omit** only:
   - Dispatch functions from useReducer/useState (stable)
   - Ref objects from useRef (stable)
   - Functions declared outside component

## Common Mistake: Empty Dependencies

```jsx
// ❌ WRONG - stale closure
const handleClick = useCallback(() => {
  console.log(count); // Always logs initial count!
}, []);

// ✅ CORRECT - fresh closure
const handleClick = useCallback(() => {
  console.log(count);
}, [count]);
```

## Performance Note

useCallback itself has a cost. Only use it when:
- Function is passed to memoized child components
- Function is in dependency arrays
- Profiling shows measurable performance issue

Don't prematurely optimize every function. Focus on functions that cause issues.

## Pattern: useCallback with React Hook Form

```jsx
function MyForm() {
  const { handleSubmit, reset } = useForm();

  const onSubmit = useCallback((data) => {
    api.saveData(data);
  }, []);

  const onClear = useCallback(() => {
    reset();
  }, [reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Button type="submit">Save</Button>
      <Button onClick={onClear}>Clear</Button>
    </form>
  );
}
```

## Exceptions

Functions that genuinely don't need memoization:
- One-time setup functions in useEffect with empty dependencies
- Functions only used in render (not passed anywhere)
- Extremely simple inline handlers in non-critical paths

When in doubt, use useCallback. The cost is minimal compared to debugging stale closures or unnecessary re-renders.

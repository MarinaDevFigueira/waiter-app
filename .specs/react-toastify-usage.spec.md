# React Toastify Usage

Use toast notifications for user feedback. ALWAYS use toast for error/success messages instead of throwing errors in UI code.

## Installation

```bash
npm install --save react-toastify
```

## Setup

### 1. Import CSS in main.jsx

```javascript
import 'react-toastify/dist/ReactToastify.css';
```

### 2. Create ToastProvider Component

ALWAYS read theme from useTheme hook:

```jsx
// src/components/toast-provider/toast-provider.jsx
import { ToastContainer } from "react-toastify";
import { useTheme } from "@/shared/hooks/useTheme";

export function ToastProvider() {
  const { theme } = useTheme();

  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      closeOnClick
      pauseOnHover
      draggable
      theme={theme}
    />
  );
}
```

### 3. Add ToastProvider in main.jsx

```jsx
import { ToastProvider } from "./components/toast-provider/toast-provider";
import "react-toastify/dist/ReactToastify.css";

// In render:
<QueryClientProvider client={queryClient}>
  <RouterProvider router={router} />
  <ToastProvider />
</QueryClientProvider>
```

## Usage Pattern

### Basic Toast Types

```javascript
import { toast } from 'react-toastify';

// Success notification
toast.success("Operação realizada com sucesso!");

// Error notification
toast.error("Erro ao realizar operação");

// Warning notification
toast.warning("Atenção: verifique os dados");

// Info notification
toast.info("Processamento iniciado");
```

### With Custom Options

```javascript
toast.error("Erro ao buscar produtos", {
  position: "top-center",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
});
```

## Error Handling Pattern with Toast

When handling errors from services (that return `{ data }` or `{ error }`), ALWAYS show toast:

```javascript
import { toast } from 'react-toastify';

// ✅ CORRECT - show toast on error
const { data, isLoading, error, isError } = useQuery({
  queryKey: ["products", queryParams],
  queryFn: async () => {
    const result = await productsService.getAll(queryParams);
    const hasError = Boolean(result.error);

    if (hasError) {
      toast.error(result.error);
      return null;
    }

    return result.data;
  },
});

// ❌ WRONG - throwing error
const { data } = useQuery({
  queryFn: async () => {
    const result = await productsService.getAll(queryParams);
    if (result.error) {
      throw new Error(result.error); // Don't throw!
    }
    return result.data;
  },
});
```

## Default Configuration

Recommended default setup in `main.jsx` or root component:

```jsx
<ToastContainer
  position="top-right"
  autoClose={5000}
  hideProgressBar={false}
  closeOnClick
  pauseOnHover
  draggable
  theme="light"
/>
```

## Position Options

- `top-left`
- `top-center`
- `top-right` (default)
- `bottom-left`
- `bottom-center`
- `bottom-right`

## Theme Options

- `light` (default)
- `dark`
- `colored` - background matches toast type color

## Common Use Cases

### Service Error Handling

```javascript
const handleSubmit = async (data) => {
  const result = await productsService.create(data);
  const hasError = Boolean(result.error);

  if (hasError) {
    toast.error(result.error);
    return;
  }

  toast.success("Produto criado com sucesso!");
  // Continue with success flow
};
```

### Form Validation

```javascript
const onSubmit = (data) => {
  const validation = schema.safeParse(data);
  const validationFailed = !validation.success;

  if (validationFailed) {
    toast.error("Verifique os campos do formulário");
    return;
  }

  toast.success("Formulário enviado!");
};
```

### Async Operations

```javascript
const handleDelete = async (productId) => {
  const result = await productsService.delete(productId);
  const hasError = Boolean(result.error);

  if (hasError) {
    toast.error(result.error);
    return;
  }

  toast.success("Produto excluído com sucesso");
  refetch();
};
```

## Rules

- **ALWAYS** import from `react-toastify`
- **ALWAYS** show toast for user-facing errors
- **ALWAYS** use Portuguese messages
- **ALWAYS** read theme from `useTheme()` hook in ToastProvider
- **NEVER** throw errors in UI code - use toast instead
- **NEVER** hardcode theme - use current system theme
- Use `toast.error()` for errors
- Use `toast.success()` for success feedback
- Use `toast.warning()` for warnings
- Use `toast.info()` for informational messages

## Why

- **User feedback**: Users see clear success/error messages
- **Non-blocking**: Toasts don't interrupt user flow
- **Consistent UX**: All notifications look and behave the same
- **Error handling**: Errors become user feedback, not crashes
- **No try-catch**: Services return `{ error }`, UI shows toast

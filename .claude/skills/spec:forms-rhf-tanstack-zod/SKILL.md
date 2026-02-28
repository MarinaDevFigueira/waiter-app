---
name: spec:forms-rhf-tanstack-zod
description: "Forms with React Hook Form + TanStack Query + Zod"
---

# Forms with React Hook Form + TanStack Query + Zod

All forms must use React Hook Form with Zod validation and TanStack Query for server mutations.

## Stack

- **React Hook Form** - Form state and validation
- **Zod v4** - Schema validation
- **@hookform/resolvers** - Zod integration with RHF
- **TanStack Query** - Server mutations and state management

## Installation

```bash
npm install react-hook-form @hookform/resolvers zod @tanstack/react-query
```

## Pattern

### 1. Define Zod Schema

```javascript
import { z } from "zod";

// Zod v4 - use top-level validators (tree-shakable)
const loginSchema = z.object({
  username: z.string()
    .min(3, { error: "Mínimo 3 caracteres" })
    .max(20, { error: "Máximo 20 caracteres" }),
  password: z.string()
    .min(8, { error: "Mínimo 8 caracteres" }),
  email: z.email({ error: "Email inválido" }), // v4: top-level validator
});

// Infer TypeScript type (optional, not required for JS)
// type LoginFormData = z.infer<typeof loginSchema>;
```

### 2. Setup Form with React Hook Form

```javascript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      email: "",
    },
  });

  // ... mutation setup
}
```

### 3. Setup TanStack Query Mutation

```javascript
import { useMutation } from "@tanstack/react-query";

const loginMutation = useMutation({
  mutationFn: async (formData) => {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    return response.json();
  },
  onSuccess: (data) => {
    // Handle success (redirect, show message, etc.)
    console.log("Login successful:", data);
    reset(); // Reset form
  },
  onError: (error) => {
    // Handle error
    console.error("Login error:", error.message);
  },
});
```

### 4. Connect Form Submission

```javascript
const onSubmit = (validData) => {
  loginMutation.mutate(validData);
};

return (
  <form onSubmit={handleSubmit(onSubmit)}>
    {/* form fields */}
  </form>
);
```

### 5. Render Form Fields

```jsx
<form onSubmit={handleSubmit(onSubmit)}>
  <div>
    <input
      {...register("username")}
      placeholder="Username"
      disabled={loginMutation.isPending}
    />
    {errors.username && <span>{errors.username.message}</span>}
  </div>

  <div>
    <input
      type="password"
      {...register("password")}
      placeholder="Password"
      disabled={loginMutation.isPending}
    />
    {errors.password && <span>{errors.password.message}</span>}
  </div>

  <div>
    <input
      type="email"
      {...register("email")}
      placeholder="Email"
      disabled={loginMutation.isPending}
    />
    {errors.email && <span>{errors.email.message}</span>}
  </div>

  <button type="submit" disabled={loginMutation.isPending}>
    {loginMutation.isPending ? "Logging in..." : "Login"}
  </button>

  {loginMutation.isError && (
    <div className="error">{loginMutation.error.message}</div>
  )}
</form>
```

## Complete Example

```javascript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

// 1. Schema
const searchSchema = z.object({
  query: z.string()
    .min(1, { error: "Digite algo para buscar" }),
});

// 2. Component
export function SearchForm({ onSearchComplete }) {
  // 3. Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(searchSchema),
    defaultValues: { query: "" },
  });

  // 4. Mutation setup
  const searchMutation = useMutation({
    mutationFn: async (data) => {
      const res = await fetch(`/api/search?q=${data.query}`);
      if (!res.ok) throw new Error("Search failed");
      return res.json();
    },
    onSuccess: (results) => {
      onSearchComplete(results);
      reset();
    },
  });

  // 5. Submit handler
  const onSubmit = (validData) => {
    searchMutation.mutate(validData);
  };

  // 6. Render
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register("query")}
        placeholder="Search..."
        disabled={searchMutation.isPending}
      />
      {errors.query && <span>{errors.query.message}</span>}

      <button type="submit" disabled={searchMutation.isPending}>
        {searchMutation.isPending ? "Searching..." : "Search"}
      </button>

      {searchMutation.isError && (
        <div>{searchMutation.error.message}</div>
      )}
    </form>
  );
}
```

## Rules

### Schema Validation

- **ALWAYS** use Zod v4 top-level validators (`z.email()`, `z.uuid()`, etc.)
- **NEVER** use deprecated method forms (`z.string().email()`)
- Use `{ error: "message" }` for custom errors (not `message:`)
- Define schemas outside components for reusability

### Form State

- **ALWAYS** use `zodResolver` to integrate Zod with React Hook Form
- Provide `defaultValues` to prevent uncontrolled input warnings
- Use `formState.errors` for validation errors
- Use `mutation.isPending` for loading state (not `isSubmitting`)
- Disable inputs during mutation with `disabled={mutation.isPending}`

### Mutations

- **ALWAYS** use `useMutation` for form submissions
- Handle `onSuccess` and `onError` callbacks
- Use `mutation.isPending` for button disabled state
- Use `mutation.isError` to show error messages
- Reset form on success with `reset()`
- Invalidate queries on success if data changed:
  ```javascript
  const queryClient = useQueryClient();
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["data-key"] });
  }
  ```

### Error Display

- Show Zod validation errors: `errors.fieldName?.message`
- Show mutation errors: `mutation.error?.message`
- Both should be visible to user

### Loading States

- Button text changes: `isPending ? "Loading..." : "Submit"`
- Inputs disabled: `disabled={mutation.isPending}`
- **NEVER** rely on `isSubmitting` alone - use mutation state

## Zod v4 Changes

- Top-level validators: `z.email()`, `z.uuid()`, `z.url()`
- Error parameter: `{ error: "message" }` (not `message:`)
- Number validation stricter: no `Infinity`, `.int()` rejects floats
- String format validators are tree-shakable

## Why

- **Type-safe validation** - Zod validates at runtime, catches errors early
- **Server state management** - TanStack Query handles async, caching, retries
- **Minimal re-renders** - React Hook Form uses uncontrolled inputs
- **Better UX** - Immediate validation feedback, loading states, error handling
- **Separation of concerns** - Schema, form logic, server logic are separated

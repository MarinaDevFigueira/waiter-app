## Forms (React Hook Form + Zod v4 + TanStack Query)
```jsx
const form = useForm({ resolver: zodResolver(schema), defaultValues });
const mutation = useMutation({
  mutationFn,
  onSuccess: () => { queryClient.invalidateQueries(...); form.reset(); },
  onError: (err) => toast.error(err.message),
});
const onSubmit = form.handleSubmit((data) => mutation.mutate(data));
```
Zod v4: `{ error: "msg" }` not `{ message: "msg" }`. Use `mutation.isPending`. Disable inputs during mutation.
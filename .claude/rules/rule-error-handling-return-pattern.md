## Error Handling Return Pattern
ALL functions return `{ data }` or `{ error }`. ALWAYS wrap in try-catch.

```js
async function getAll(params) {
  try {
    const result = await api.get('/items', { params });
    if ('error' in result) return { error: result.error };
    return { data: result.data };
  } catch (error) {
    return { error: error?.message ?? 'Erro genérico' };
  }
}
// Consumer:
const { data, error } = await service.getAll(params);
if (error) { toast.error(error); logger.error('...', new Error(error)); return; }
```

On error ALWAYS: `toast.error(message)` AND `logger.error(message, error)`.
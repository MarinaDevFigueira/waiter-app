---
name: spec:error-display-toast-logger
description: "Error Display: Toast + Logger"
---

# Error Display: Toast + Logger

Sempre que um erro ocorrer (em hooks, handlers, queryFn, mutationFn), exibir `toast.error` e chamar `logger.error` com `error?.stack`.

## Rule

- **SEMPRE** chamar `toast.error(mensagem)` quando houver erro visível ao usuário
- **SEMPRE** chamar `logger.error(mensagem, error)` para registrar o erro com stack trace
- O `logger.error` já inclui `error.stack` automaticamente quando um `Error` é passado
- Aplicar em: `queryFn`, `mutationFn`, handlers assíncronos, catch blocks em hooks

## Pattern

```typescript
// ✅ CORRETO — toast + logger juntos
const result = await someService.doSomething();
const hasError = Boolean(result.error);

if (hasError) {
  const error = new Error(result.error);
  toast.error(result.error);
  logger.error("Falha ao executar operação", error);
  return null;
}
```

```typescript
// ✅ CORRETO — em catch block
} catch (error) {
  const message = error instanceof Error ? error.message : "Erro inesperado";
  toast.error(message);
  logger.error("Erro inesperado", error instanceof Error ? error : null, { context: "SomeHook" });
}
```

```typescript
// ❌ ERRADO — só toast, sem logger
if (hasError) {
  toast.error(result.error);
  return null;
}

// ❌ ERRADO — só logger, sem toast
if (hasError) {
  logger.error("Erro", new Error(result.error));
  return null;
}
```

## Imports sempre necessários

```typescript
import { toast } from "react-toastify";
import { logger } from "@/lib/logger";
```

## Why

- Toast garante feedback visível ao usuário
- Logger garante rastreabilidade com stack trace para debug
- Os dois juntos cobrem UX e observabilidade ao mesmo tempo

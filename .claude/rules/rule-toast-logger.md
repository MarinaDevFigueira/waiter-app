## Toast + Logger
On every error: BOTH `toast.error(message)` AND `logger.error(message, error)`.
```js
import { logger } from "@/lib/logger";
logger.error("msg", error); // never console.log, never log tokens/passwords
```
Setup: `<ToastContainer theme={theme} />` via `useTheme()` in `ToastProvider`.
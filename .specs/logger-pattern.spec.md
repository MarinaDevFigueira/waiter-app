# Logger Pattern

Logger centralizado para uso consistente de logs na aplicação.

## Uso Básico

```javascript
import { logger } from "@/lib/logger";

logger.debug("Debug message", { userId: 123 });
logger.info("User logged in", { username: "john" });
logger.warn("Deprecated API used", { endpoint: "/old-api" });
logger.error("Failed to fetch data", error, { url: "/api/products" });
```

## Níveis de Log

| Nível | Ambiente | Uso |
|-------|----------|-----|
| `DEBUG` | development | Logs detalhados para desenvolvimento |
| `INFO` | development | Informações gerais |
| `WARN` | production (padrão) | Avisos e deprecations |
| `ERROR` | production | Erros e exceções |
| `SILENT` | test | Sem logs |

## Contexto

Use contexto para agrupar logs de um módulo/feature:

```javascript
// Criar logger com contexto
const authLogger = logger.withContext("AUTH");
authLogger.info("User authentication started");

// Ou definir contexto global
logger.setContext("ORDERS");
logger.info("Processing order");
logger.clearContext();
```

## Formato de Log

```
2025-02-16T10:30:45.123Z INFO [AUTH] User logged in { username: "john" }
```

## Configuração

```javascript
import { logger, LogLevel } from "@/lib/logger";

// Mudar nível de log manualmente
logger.setLevel(LogLevel.DEBUG);
```

## Exemplos de Uso

### Em Serviços

```javascript
import { logger } from "@/lib/logger";

export class AuthService {
  async login(credentials) {
    const serviceLogger = logger.withContext("AuthService");

    serviceLogger.info("Login attempt", { username: credentials.username });

    try {
      const user = await this.authenticate(credentials);
      serviceLogger.info("Login successful", { userId: user.id });
      return user;
    } catch (error) {
      serviceLogger.error("Login failed", error, { username: credentials.username });
      throw error;
    }
  }
}
```

### Em Hooks

```javascript
import { logger } from "@/lib/logger";

export function useProducts() {
  useEffect(() => {
    logger.debug("Fetching products");

    fetchProducts()
      .then(() => logger.info("Products loaded"))
      .catch((error) => logger.error("Failed to load products", error));
  }, []);
}
```

### Em Error Boundaries

```javascript
import { logger } from "@/lib/logger";

class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    logger.error("React error boundary caught error", error, { errorInfo });
  }
}
```

## Regras

- Sempre usar o logger centralizado (nunca `console.log` direto)
- Adicionar contexto relevante no segundo parâmetro
- Para erros, passar o objeto `Error` como segundo parâmetro
- Em produção, evitar logs `DEBUG` e `INFO` excessivos
- Nunca logar informações sensíveis (senhas, tokens, dados pessoais)

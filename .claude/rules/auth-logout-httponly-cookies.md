## Logout: HttpOnly cookies requerem endpoint no backend

**Problema:** `access_token` e `refresh_token` são setados como HttpOnly pelo backend. JavaScript (`document.cookie`) não consegue remover cookies HttpOnly.

**Solução:** `authService.logout()` chama `authService.serverLogout()` primeiro, que faz `POST /auth/logout`. O backend responde com `Set-Cookie: access_token=; Max-Age=0` expirando os cookies. A limpeza local acontece independentemente do resultado do serverLogout.

**Padrão adotado:**
- `serverLogout()` — método dedicado que chama o endpoint, segue service result pattern, loga erros
- `logout()` — orquestra: chama serverLogout() (sem await de erro), depois limpa estado local

**Arquivo:** `src/services/auth/auth.service.ts`
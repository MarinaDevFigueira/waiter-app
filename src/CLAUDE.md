# Source Code Documentation Index

Documentação completa dos módulos do waiter-app. Cada módulo possui seu próprio CLAUDE.md com padrões, exemplos e melhores práticas.

## Estrutura de Módulos

```
src/
├── CLAUDE.md                        # Este arquivo (índice)
├── components/CLAUDE.md             # Componentes (UI, layouts, auth)
│   └── ui/CLAUDE.md                 # Componentes UI reutilizáveis
├── pages/CLAUDE.md                  # Páginas da aplicação
├── routes/CLAUDE.md                 # Rotas TanStack Router
├── services/CLAUDE.md               # Camada de serviços (API)
├── shared/CLAUDE.md                 # Código compartilhado
│   └── subjects/CLAUDE.md           # RxJS BehaviorSubjects
└── lib/CLAUDE.md                    # Utilitários e helpers
```

## Guia Rápido

### Começando um Novo Componente?
📖 Leia: [`components/CLAUDE.md`](./components/CLAUDE.md) e [`components/ui/CLAUDE.md`](./components/ui/CLAUDE.md)

**Padrões principais:**
- Composite Pattern para componentes complexos
- Imports diretos (sem index.js)
- Interfaces em arquivos `.interface.ts` separados
- Testes em `__tests__/*.spec.js`
- Sem valores hardcoded (exceto width/height)
- `data-*` attributes para variações condicionais

### Criando uma Nova Página?
📖 Leia: [`pages/CLAUDE.md`](./pages/CLAUDE.md)

**Estrutura:**
```
src/pages/{feature}/
├── page.tsx
├── page.interface.ts
├── components/
│   └── {component}/
└── __tests__/
```

**Padrões principais:**
- Componentes locais em `components/`
- Loading states com skeleton dedicado
- Sem client-side filtering (sempre via API)
- Multi-language translations para forms

### Adicionando uma Nova Rota?
📖 Leia: [`routes/CLAUDE.md`](./routes/CLAUDE.md)

**Padrões principais:**
- File-based routing (arquivos viram rotas)
- `beforeLoad` para protected routes
- Profile-based routing (mesma rota `/`, conteúdo diferente)
- `<Link>` para navegação do usuário
- `useNavigate()` para navegação programática
- Normalizar pathname (remover trailing slash)

### Integrando com a API?
📖 Leia: [`services/CLAUDE.md`](./services/CLAUDE.md)

**Padrões principais:**
- Service Result Pattern: `{ data: T } | { error: string }`
- Error handling em try-catch
- Write operations retornam `void`
- Validação com Zod schemas
- Mapping API → Domain schemas
- Co-located schemas (`*.schema.ts` no mesmo diretório)
- Invalidar cache manualmente após mutations

### Gerenciando Estado Global?
📖 Leia: [`shared/subjects/CLAUDE.md`](./shared/subjects/CLAUDE.md)

**Padrões principais:**
- RxJS BehaviorSubjects encapsulados
- Subscribe em useEffect, unsubscribe no cleanup
- Custom hooks para encapsular lógica
- Persistência em localStorage quando necessário

### Usando Utilitários?
📖 Leia: [`lib/CLAUDE.md`](./lib/CLAUDE.md)

**Utilitários disponíveis:**
- `cn()` - Merge de classes CSS
- `formatPrice()` - Formatação de preços em R$
- `logger` - Sistema de logging estruturado
- `cookies` - Gerenciamento de cookies HTTP
- `formatZodError()` - Formatação de erros Zod

### Usando Hooks, Schemas ou Constants?
📖 Leia: [`shared/CLAUDE.md`](./shared/CLAUDE.md)

**Recursos compartilhados:**
- Custom hooks (useAuth, useCart, useProducts, etc)
- Zod schemas (base-entity, product, category, order)
- Constants (storage keys, route map, user profiles)
- Enums (translations, sort direction, order by)
- API client com token refresh

## Arquitetura em Alto Nível

```
┌─────────────────────────────────────────────────────┐
│                    Routes                           │
│              (TanStack Router)                      │
│   File-based routing, code-splitting, protected    │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│                     Pages                           │
│         (page.tsx + local components)               │
│   Foods, Products, Categories, Orders, Login       │
└─────────────────────────────────────────────────────┘
                         ↓
         ┌───────────────┴───────────────┐
         ↓                               ↓
┌──────────────────┐          ┌──────────────────┐
│   Components     │          │    Services      │
│  (UI + Layouts)  │          │   (API Layer)    │
│                  │          │                  │
│ - Button         │          │ - products       │
│ - Dialog         │          │ - categories     │
│ - Card           │          │ - orders         │
│ - Input          │          │ - auth           │
│ - ...            │          │ - order-sessions │
└──────────────────┘          └──────────────────┘
         ↓                               ↓
┌─────────────────────────────────────────────────────┐
│                    Shared                           │
│  Subjects (RxJS) | Hooks | Schemas | Constants     │
│                                                     │
│ - authObservable    - useAuth      - productSchema │
│ - cartObservable    - useCart      - categorySchema│
│ - themeObservable   - useProducts  - orderSchema   │
│ - languageObservable- useTranslation               │
└─────────────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────────────┐
│                     Lib                             │
│         Utilities and Helpers                       │
│                                                     │
│ - cn()           - logger         - cookies        │
│ - formatPrice()  - formatZodError()                │
└─────────────────────────────────────────────────────┘
```

## Stack Tecnológico

### Core
- **React 19** - UI library
- **Vite** - Build tool
- **TypeScript** - Type safety

### Routing & Data
- **TanStack Router** - File-based routing
- **TanStack Query** - Server state management
- **RxJS** - Client state management (BehaviorSubjects)

### Forms & Validation
- **React Hook Form** - Form state
- **Zod v4** - Schema validation
- **@hookform/resolvers** - RHF + Zod integration

### UI & Styling
- **Tailwind CSS v4** - Utility-first CSS
- **Radix UI** - Accessible primitives
- **CVA** - Variant management
- **@phosphor-icons/react** - Icons

### Testing
- **Playwright** - E2E testing

### Other
- **react-toastify** - Notifications
- **clsx + tailwind-merge** - Class utilities

## Padrões Globais

### 1. No Comments
**NUNCA** adicionar comentários ao código. Use nomes descritivos de variáveis e funções.

### 2. No Hardcoded Values
**NUNCA** usar cores, espaçamentos ou tamanhos hardcoded (exceto width/height).
Use classes do Tailwind CSS ou variáveis do tema em `src/index.css`.

### 3. No Barrel Exports
**NUNCA** criar arquivos `index.js` para re-exportar.
**SEMPRE** importar do arquivo específico.

### 4. Named Variables
**SEMPRE** extrair expressões em variáveis nomeadas ao invés de inline.

### 5. Composite Pattern
**SEMPRE** usar composite pattern para componentes com múltiplas partes.

### 6. Error Handling
**SEMPRE** retornar `{ data: T } | { error: string }` em services.
**SEMPRE** isolar em try-catch.

### 7. Logger over Console
**SEMPRE** usar `logger` ao invés de `console.log/error/warn`.

### 8. No Client-Side Filtering
**NUNCA** usar `.filter()` no cliente. Sempre filtrar via API.

### 9. Subscription Cleanup
**SEMPRE** fazer unsubscribe de observables no cleanup do useEffect.

### 10. Testing
**SEMPRE** criar testes em `__tests__/*.spec.js` para componentes e features.

## Fluxo de Desenvolvimento

### 1. Criar Nova Feature

```bash
# 1. Criar rota
src/routes/{feature}.tsx

# 2. Criar página
src/pages/{feature}/
├── page.tsx
├── components/
└── __tests__/

# 3. Criar service (se necessário)
src/services/{feature}/
├── {feature}.service.ts
└── {feature}.schema.ts

# 4. Criar hooks/subjects (se necessário)
src/shared/hooks/use{Feature}.ts
src/shared/subjects/{feature}.subject.ts
```

### 2. Testar

```bash
# Testes unitários/E2E
npm run test

# Lint
npm run lint
```

### 3. Commit

```bash
git add .
npm run test  # Rodar testes afetados
git commit -m "feat: add {feature}"
```

## Troubleshooting

### Erro: "Cannot find module '@/...'
✅ Verificar que o path alias `@/` aponta para `src/` no `vite.config.js`

### Erro: "Zod validation failed"
✅ Verificar que o schema da API corresponde ao response do backend
✅ Usar `formatZodError()` para debug

### Erro: "Memory leak detected"
✅ Verificar que todos os observables têm unsubscribe no cleanup do useEffect

### Erro: "Component not found"
✅ Verificar que está importando do arquivo específico, não de index.js

### Página fica em branco após login
✅ Verificar profile-based routing em `src/routes/index.tsx`
✅ Verificar que `authObservable` tem o profile correto

## Referências Externas

- **TanStack Router**: https://tanstack.com/router
- **TanStack Query**: https://tanstack.com/query
- **React Hook Form**: https://react-hook-form.com
- **Zod**: https://zod.dev
- **Tailwind CSS**: https://tailwindcss.com
- **Radix UI**: https://www.radix-ui.com
- **RxJS**: https://rxjs.dev
- **Playwright**: https://playwright.dev
- **Phosphor Icons**: https://phosphoricons.com

## Contribuindo

Ao adicionar novos módulos ou fazer mudanças significativas:

1. Atualizar o CLAUDE.md do módulo afetado
2. Adicionar exemplos de código quando relevante
3. Documentar padrões específicos do módulo
4. Manter consistência com padrões globais
5. Atualizar este índice se necessário

---

**Última atualização:** 2024-01-22
**Versão do projeto:** waiter-app v1.0.0

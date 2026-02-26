# PRD: Owner Role Migration — Validação e Correção

## Introduction

O sistema de roles do waiter-app está sendo reestruturado. A role `ADMIN` anteriormente representava o dono do negócio. Agora, uma nova role `OWNER` foi introduzida para esse papel. A hierarquia atual é:

- **OWNER** — Dono do business (substitui o antigo ADMIN como dono do negócio)
- **ADMIN** — Administrador do sistema (pode acessar qualquer business via `businessId`)
- **ATTENDANT** — Pessoa de confiança do OWNER, com permissões reduzidas
- **COZINHA** — Perfil de cozinha
- **MESA** — Garçom/mesa
- **DELIVERY** — Entregador

As mudanças já iniciadas (uncommitted) incluem: enum `UserProfileEnum` com `OWNER`, remoção do `type UserProfile`, mapeamento `owner` no `roleToProfile`, e `RouteMap` com rotas do OWNER e ADMIN. Porém, vários arquivos ainda referenciam o padrão antigo e precisam ser corrigidos.

## Goals

- Completar a migração da role OWNER em todos os arquivos do frontend
- Remover todas as referências ao type `UserProfile` (removido, agora é `UserProfileEnum`)
- Garantir que OWNER, ADMIN e ATTENDANT acessem o dashboard corretamente
- Garantir que a lógica de permissões reflita a nova hierarquia
- Validar que todos os testes afetados continuam passando

## User Stories

### US-001: Corrigir `src/shared/mocks/users.ts`

**Description:** Como desenvolvedor, preciso que os mocks reflitam a nova estrutura de roles para que testes e desenvolvimento local funcionem.

**Acceptance Criteria:**
- [ ] Remover import de `type UserProfile` (tipo foi removido)
- [ ] Alterar `profile: UserProfile` para `profile: UserProfileEnum` na interface `MockUser`
- [ ] Alterar o mock user "iconsagrado" de `UserProfileEnum.ADMIN` para `UserProfileEnum.OWNER`
- [ ] Adicionar novo mock user ADMIN (ex: `{ username: "sysadmin", password: "123", profile: UserProfileEnum.ADMIN, name: "Administrador do Sistema" }`)
- [ ] Lint passa sem erros

### US-002: Corrigir `src/routes/index.tsx` — Profile-based routing

**Description:** Como usuário OWNER, ao fazer login, preciso ser redirecionado ao dashboard assim como ADMIN e ATTENDANT.

**Acceptance Criteria:**
- [ ] `hasDashboardAccess` inclui `UserProfileEnum.OWNER` (atualmente falta — tem ADMIN mas não OWNER)
- [ ] Remover cast desnecessário `(profile as UserProfileEnum)` na linha do COZINHA (profile já é tipado)
- [ ] A lógica de `hasDashboardAccess` fica: `OWNER || ADMIN || ATTENDANT || COZINHA`
- [ ] Lint passa sem erros

### US-003: Corrigir `src/routes/dashboard/route.tsx` — Allowed profiles

**Description:** Como usuário OWNER, preciso ter acesso à rota `/dashboard` via `ProtectedRoute`.

**Acceptance Criteria:**
- [ ] Adicionar `UserProfileEnum.OWNER` ao array `allowedProfiles`
- [ ] Array final: `[UserProfileEnum.OWNER, UserProfileEnum.ADMIN, UserProfileEnum.ATTENDANT, UserProfileEnum.COZINHA]`
- [ ] Lint passa sem erros

### US-004: Corrigir `src/components/layouts/dashboard-layout/dashboard-layout.tsx` — Menu visibility

**Description:** Como OWNER ou ADMIN, preciso ver os itens de menu administrativos (categories, users, settings) no sidebar.

**Acceptance Criteria:**
- [ ] `isAdmin` (linha 69) deve verificar: `userProfile === UserProfileEnum.OWNER || userProfile === UserProfileEnum.ADMIN`
- [ ] OWNER e ADMIN veem itens: categories, users, settings
- [ ] ATTENDANT e COZINHA veem apenas os itens base
- [ ] Lint passa sem erros

### US-005: Corrigir `src/pages/orders/page.tsx` — Orders admin view

**Description:** Como OWNER, ADMIN ou ATTENDANT, preciso ter acesso à view de admin dos pedidos (tabela).

**Acceptance Criteria:**
- [ ] `isAdmin` (linha 14) deve verificar: `OWNER || ADMIN || ATTENDANT`
- [ ] Código final: `const isAdmin = profile === UserProfileEnum.OWNER || profile === UserProfileEnum.ADMIN || profile === UserProfileEnum.ATTENDANT;`
- [ ] Lint passa sem erros

### US-006: Corrigir `src/pages/admin/page.tsx` — Full admin check

**Description:** Como OWNER, preciso ser identificado como "full admin" na página administrativa. ADMIN do sistema também deve ser full admin.

**Acceptance Criteria:**
- [ ] `isFullAdmin` deve verificar: `auth?.profile === UserProfileEnum.OWNER || auth?.profile === UserProfileEnum.ADMIN`
- [ ] OWNER e ADMIN veem seções extras (Configurações, Relatórios)
- [ ] Lint passa sem erros

### US-007: Validar testes afetados via Playwright

**Description:** Como desenvolvedor, preciso garantir que todos os testes que referenciam roles/profiles continuam passando após a migração.

**Acceptance Criteria:**
- [ ] Executar e validar: `src/pages/login/__tests__/auth-flow.spec.js`
- [ ] Executar e validar: `src/components/auth/__tests__/protected-route.spec.js`
- [ ] Executar e validar: `src/components/auth/__tests__/profile-routing.spec.js`
- [ ] Executar e validar: `src/components/layouts/dashboard-layout/__tests__/dashboard-layout.spec.js`
- [ ] Executar e validar: `src/pages/orders/__tests__/page.spec.js`
- [ ] Executar e validar: `src/pages/orders/__tests__/orders-api-flow.spec.js`
- [ ] Executar e validar: `src/shared/hooks/__tests__/useAuth.spec.js`
- [ ] Executar e validar: `src/shared/hooks/__tests__/useOrders.spec.js`
- [ ] Executar e validar: `src/pages/login/components/login-form/__tests__/login-form.spec.js`
- [ ] Se algum teste falhar por referenciar `UserProfile` (tipo antigo) ou `ADMIN` onde deveria ser `OWNER`, corrigir o teste
- [ ] Todos os 9 test files passam sem erros

## Functional Requirements

- FR-1: `UserProfileEnum.OWNER` deve existir no enum com valor `"Owner"` ✅ (já feito)
- FR-2: `roleToProfile` no auth service deve mapear `"owner"` para `UserProfileEnum.OWNER` ✅ (já feito)
- FR-3: `RouteMap` deve ter rotas para OWNER (dashboard, users, reports, settings, products) ✅ (já feito)
- FR-4: `RouteMap` deve ter rotas para ADMIN (dashboard, reports, users, business) ✅ (já feito)
- FR-5: Rota `/` deve redirecionar OWNER, ADMIN, ATTENDANT e COZINHA para `/dashboard`
- FR-6: `ProtectedRoute` do dashboard deve aceitar OWNER, ADMIN, ATTENDANT e COZINHA
- FR-7: Dashboard sidebar deve mostrar menu completo para OWNER e ADMIN
- FR-8: Orders page deve considerar OWNER, ADMIN e ATTENDANT como admin
- FR-9: Admin page deve considerar OWNER e ADMIN como "full admin"
- FR-10: Nenhum arquivo deve importar `type UserProfile` (tipo removido)
- FR-11: Mock users deve ter um user OWNER e um user ADMIN separados

## Non-Goals

- Não implementar seleção de `businessId` para ADMIN (será uma feature futura)
- Não criar novas telas/rotas para ADMIN (apenas garantir acesso correto às existentes)
- Não alterar a API backend (apenas frontend)
- Não alterar testes que não referenciam roles/profiles

## Technical Considerations

- `UserProfileEnum` mudou de `Object.freeze({})` para `enum` TypeScript — qualquer import de `type UserProfile` vai quebrar
- O `RouteMap` agora é `Record<UserProfileEnum, RouteRecord>` — precisa de uma entrada para cada valor do enum
- `ADMIN` no `RouteMap` tem uma rota `business: "/dashboard/business"` que é exclusiva (futura tela de seleção de business)
- Testes Playwright devem ser executados via MCP (`browser_navigate`, `browser_snapshot`) e NÃO via `npm run test`

## Success Metrics

- Zero referências a `type UserProfile` no codebase
- OWNER redireciona corretamente para `/dashboard` ao fazer login
- ADMIN redireciona corretamente para `/dashboard` ao fazer login
- Menu sidebar mostra itens completos para OWNER e ADMIN
- Todos os 9 test files afetados passam sem erros
- `npm run lint` passa sem erros

## Open Questions

- Quando será implementada a tela `/dashboard/business` para o ADMIN selecionar um business?
- O ADMIN deve ver algum indicador visual diferente do OWNER no sidebar (ex: badge "System Admin")?
- O ATTENDANT deve ter acesso a `/dashboard/products`? (atualmente não tem no RouteMap, mas na lógica de orders é tratado como admin)

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (Vite)
npm run build    # Production build
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

## Architecture

This is a React waiter/restaurant ordering app built with Vite and TanStack Router.

### Tech Stack
- **React 19** with JSX (no TypeScript for components)
- **TanStack Router** - File-based routing with auto code-splitting (`src/routes/`)
- **RxJS BehaviorSubjects** - State management via observables (`src/shared/subjects/`)
- **Tailwind CSS v4** - Styling with `@tailwindcss/vite` plugin
- **shadcn/ui pattern** - UI components using CVA + Radix primitives (`src/components/ui/`)

### Project Structure
- `src/routes/` - TanStack Router file-based routes (auto-generates `routeTree.gen.ts`)
- `src/pages/` - Page components with their local components in subdirectories
- `src/shared/subjects/` - RxJS BehaviorSubjects for reactive state (foods, categories, orders)
- `src/shared/constants/` - Constantes compartilhadas (storage keys, etc.)
- `src/shared/mocks/` - Mock data
- `src/components/ui/` - Reusable UI components (shadcn/ui style)
- `src/lib/utils.js` - Utility functions (includes `cn()` for class merging)

### State Management Pattern
Uses RxJS BehaviorSubjects instead of Redux/Context. Subscribe in useEffect and unsubscribe on cleanup:
```jsx
useEffect(() => {
  const subscription = someSubject.subscribe(setData);
  return () => subscription.unsubscribe();
}, []);
```

### Path Aliases
Use `@/` to import from `src/` directory (configured in vite.config.js).

### ESLint Config
Unused variables starting with uppercase or underscore are allowed (`varsIgnorePattern: '^[A-Z_]'`).

## Figma Design

**Link:** https://www.figma.com/design/PFza25fTu8s9WLjrFxk7lq/WAITERAPP--Copy-?node-id=11-195

### Telas do App
1. **Splash Screen** - Logo WAITERAPP com ilustração de garçons
2. **Home (Lista de produtos)** - Header "Bem vindo ao WAITERAPP", categorias (Pizzas, Bebidas, Lanches, Promoções), lista de produtos com imagem, nome, descrição e preço
3. **Modal de produto** - Imagem grande, nome, descrição, ingredientes com ícones, preço e botão "Adicionar ao pedido"
4. **Modal informar mesa** - Input para número da mesa
5. **Tela de Pedido** - Lista de itens do pedido com quantidade, botão cancelar pedido, total e "Confirmar pedido"
6. **Modal pedido confirmado** - Feedback de sucesso
7. **Estado vazio** - Ilustração quando não há produtos

### Design Tokens
- **Cor primária:** Vermelho (#D73035 aproximadamente)
- **Texto:** Cinza escuro para títulos, cinza médio para descrições
- **Background:** Branco
- **Bordas:** Arredondadas (rounded)
- **Preços:** Formato "R$ XX,00"

## Testing

### Playwright E2E Tests
- **Config:** `playwright.config.js` com `testMatch: "**/__tests__/**/*.spec.js"`
- **Estrutura:** Testes dentro de `__tests__/` na pasta do componente/rota
- **Comandos:**
  - `npm run test` - Executa todos os testes
  - `npm run test:ui` - Interface visual do Playwright

### Padrões de Teste
- Testes de componente devem ser **unitários e isolados** (não dependem de rotas)
- Usar `data-testid` para selecionar elementos nos testes
- Estrutura de pastas:
  ```
  src/components/ui/meu-componente/
  ├── meu-componente.jsx
  └── __tests__/
      └── meu-componente.spec.js
  ```

## Code Style

### Imports
- **Nunca usar arquivos `index.js`** para re-exportar componentes ou módulos
- Importar diretamente do arquivo específico:
  ```jsx
  // ✅ Correto
  import { SplashScreen } from "@/components/splash-screen/splash-screen";

  // ❌ Incorreto
  import { SplashScreen } from "@/components/splash-screen"; // via index.js
  ```

### Colors and Values
- **NUNCA usar valores hardcoded** (cores, espaçamentos, tamanhos, etc.)
- **Prioridade de uso:**
  1. Classes nativas do Tailwind CSS (ex: `bg-red-500`, `p-4`, `w-full`)
  2. Cores/valores do tema em `src/index.css` (ex: `bg-primary`, `text-foreground`)
  3. **Apenas em último caso:** adicionar nova variável em `:root` e `.dark` em `src/index.css`
- Usar classes do Tailwind CSS:
  ```jsx
  // ✅ Correto
  className="bg-primary text-white p-4 rounded-md"

  // ❌ Incorreto
  className="bg-[#D73035] text-[#FFFFFF] p-[16px] rounded-[8px]"
  ```

### CI/CD
- GitHub Action em `.github/workflows/test.yml`
- Executa `npm run test` em PRs para `main`

## Workflow

### Ao alterar arquivos
Sempre execute:
1. `npm run lint` - Verificar erros de lint
2. `npm run test` - Executar testes Playwright

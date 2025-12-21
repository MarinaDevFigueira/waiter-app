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

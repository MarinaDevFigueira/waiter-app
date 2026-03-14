## TanStack Router
- Routes in `src/routes/` — never edit `routeTree.gen.ts`.
- Layout routes MUST use `<Outlet />`. `notFoundComponent` MUST be `() => <Component />`.
- `beforeLoad` for auth guards — throw `redirect()`.
- Navigation: `<Link>` for clicks, `useNavigate()` for programmatic. Never `window.location`.
- Normalize pathnames: remove trailing slash (except `/`).
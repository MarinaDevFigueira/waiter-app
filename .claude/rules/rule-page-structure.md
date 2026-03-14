## Page Structure
```
src/pages/{feature}/{view}/
├── page.tsx / page.interface.ts
└── components/{name}/{name}.tsx / {name}.interface.ts
```
- Interfaces always in `.interface.ts` — never inside `.tsx`.
- Never create components inside page files.
- Multiple role views: `{feature}/page.tsx` (dispatcher) → `{feature}/{role}-{feature}/page.tsx`.
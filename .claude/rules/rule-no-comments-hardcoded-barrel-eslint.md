## No Comments — No Hardcoded Values — No Barrel Exports — No ESLint Disable
- Code self-documents via descriptive names.
- No hardcoded colors/spacing/fonts (except `w-[px]` / `h-[px]`).
- Priority: Tailwind classes → theme variables `src/index.css` → add to `:root`/`.dark`.
- Never `index.js` re-exports. Import from specific file: `@/components/foo/foo`.
- Never `eslint-disable`. Refactor instead.
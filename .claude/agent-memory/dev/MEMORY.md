# Dev Agent Memory

## Project Setup
- Playwright is already installed with browsers (`chromium --with-deps`)
- Dev server typically runs on port 5173
- Never run `npx playwright install` - it's already set up

## Testing Workflow
- Use MCP Playwright tools (browser_navigate, browser_snapshot, browser_click, etc.)
- Dev server must be running before testing
- Check port 5173 with: `lsof -i :5173 | grep LISTEN`

## Common Patterns
- Users table follows TanStack Table pattern
- Badge components use colored backgrounds with text (e.g., `bg-purple-500/10 text-purple-600`)
- Status badges follow pattern: active/enabled = green, disabled/deleted = red
- Translation keys follow nested structure (e.g., `users.table.columns.disabled`)

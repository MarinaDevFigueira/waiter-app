## Playwright MCP — Mandatory After Every Frontend Change
1. `browser_navigate` → page
2. `browser_snapshot` → verify structure (prefer over screenshot)
3. `browser_take_screenshot` → verify visual
4. `browser_console_messages(level: "error")` → check errors
5. Fix issues, repeat until clean

Test mobile (375px) and desktop (1280px) for layout changes.
Never use `npm run test` during development.
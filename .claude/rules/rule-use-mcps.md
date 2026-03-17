## Available MCPs — When to Use

### playwright
Browser automation for frontend verification.
- After every frontend change: navigate → snapshot → screenshot → console errors
- Use `browser_snapshot` (prefer over screenshot for structure checks)
- Use `browser_take_screenshot` for visual verification
- Use `browser_console_messages(level: "error")` to check runtime errors
- Test mobile (375px) and desktop (1280px) for layout changes

### context7
Up-to-date library documentation and code examples.
- Before implementing with any library/framework: resolve ID → query docs
- Use when unsure about API signatures, breaking changes, or best practices
- Call `resolve-library-id` first, then `query-docs` with the resolved ID
- Max 3 calls per question

### sequential-thinking
Structured multi-step reasoning for complex problems.
- Use for: breaking down complex tasks, planning with room for revision, problems where scope is unclear upfront
- Use before implementing non-trivial features or debugging hard problems
- Allows branching, backtracking, and revising previous thoughts
- Set `nextThoughtNeeded: false` only when a satisfactory answer is reached

### github
GitHub operations: issues, PRs, commits, branches, files, reviews.
- Use for all GitHub tasks instead of `gh` CLI when available
- Create PRs: `create_pull_request` with branch name as title (per naming rules)
- Review PRs: `pull_request_read` → `pull_request_review_write`
- File operations: `get_file_contents`, `create_or_update_file`, `push_files`
- Search: `search_code`, `search_issues`, `search_pull_requests`

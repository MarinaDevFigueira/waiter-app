# /commit — Branch, Commit & PR Workflow

When the user invokes `/commit`, follow this workflow:

## Steps

1. **Check current branch** — run `git branch --show-current`
2. **If on `main`**, create a new branch:
   - Analyze staged/unstaged changes to determine branch name
   - Use convention: `feat/`, `fix/`, `refactor/`, `style/`, `chore/`, `docs/`
   - Run `git checkout -b {branch-name}`
3. **Stage changes** — run `git status` and `git diff` to understand changes
4. **Create commit(s)** — with descriptive message following repo conventions
5. **Push branch** — `git push -u origin {branch-name}`
6. **Create PR** — use `gh pr create` pointing to `main` with:
   - Short title (under 70 chars)
   - Body with `## Summary` and `## Test plan`
   - No AI attribution
7. **Return PR URL** to the user

## Rules

- **NEVER** commit or push directly to `main`
- **NEVER** add AI attribution (Co-Authored-By, "Generated with Claude", etc.)
- **ALWAYS** create a new branch from current HEAD
- **ALWAYS** create a Pull Request to `main`
- If already on a feature branch, commit and push there, then create PR if none exists
- Use HEREDOC for commit messages to preserve formatting

## Example

```bash
git checkout -b feat/add-order-filters
git add src/pages/orders/
git commit -m "$(cat <<'EOF'
feat: add order status filters

Add dropdown filters for pending, preparing, and ready statuses.
EOF
)"
git push -u origin feat/add-order-filters
gh pr create --title "Add order status filters" --base main --body "$(cat <<'EOF'
## Summary
- Add status filter dropdown to orders page
- Filter options: pending, preparing, ready

## Test plan
- [ ] Verify each filter shows correct orders
- [ ] Verify clearing filter shows all orders
EOF
)"
```

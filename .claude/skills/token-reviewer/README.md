
# token-reviewer skill

## Install (Claude Code)
1. Create the directory `~/.claude/skills/token-reviewer/` if it does not exist.
2. Place `SKILL.md` here. (Optional) Place `evals/evals.json` for testing.
3. Restart Claude Code or run `/reload skills` if available.
4. Invoke with `/token-reviewer [optional: path/to/tokens.json] [optional: glob for CSS]`.

## Install (project-scoped)
1. Add the folder to your repo at `.claude/skills/token-reviewer/`.
2. Commit it with your app. Claude Code auto-discovers nested `.claude/skills/` directories.

## Output
The skill writes a single file at the workspace root: `token-report.md`. Version is appended as `vN` (v1 on first run).

# Context strategy

The Context Gate minimizes tokens without sacrificing evidence. Start with:

```text
AGENTS.md -> ai:route -> owner docs -> entry point -> direct dependencies
```

Apply these rules in order: search before read; symbol before file; range before full file; diff before repository; summary before raw log; owner doc before neighboring docs. Expand only when the current question remains unresolved.

The router returns maximum source and emitted-line budgets by tier. They are exploration defaults, not permission to omit evidence needed for correctness. Use `--limit`, `--max`, or a wider range explicitly when the hypothesis requires it.

Bounded helpers:

- `ai:search`: ripgrep with generated/native/lockfile exclusions and 50-result default.
- `ai:read`: 160-line default; supports `--lines START:END` and `--around TEXT`.
- `ai:diff`: stat by default; `--full` or path scope is explicit.
- `ai:log`: 8 commits by default, capped at 50.

Do not preload all docs, all source, lockfiles, generated/native files, full logs, or all tests. For long tasks, write durable facts to the ignored `.ai/state/current-task.md`; never copy conversation history or secrets.

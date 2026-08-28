# Context strategy

Context is loaded progressively. The goal is enough evidence for correctness, not maximum repository coverage.

## Order

```text
AGENTS.md
owner document
source entry point
direct dependencies and callers
nearest relevant tests
broader context only when unresolved
```

Use search before read, symbol before file, range before full file, diff before repository, and summary before raw log.

## Default budgets

These are exploration defaults, not hard limits:

| Tier | Sources | Emitted lines |
| --- | ---: | ---: |
| FAST | 2 | 160 |
| BALANCED | 6 | 600 |
| DEEP | 10 | 1200 |
| CRITICAL | 16 | 2000 |

Count owner docs, source files, tests, and external references as sources. Expand only when the current hypothesis remains unresolved or correctness requires more evidence.

## Repository tools

- Use `rg` or `rg --files` for discovery.
- Read a relevant range with `sed -n` instead of dumping large files.
- Scope `git diff` to task-owned paths when the tree contains unrelated work.
- Exclude `bun.lock`, generated output, `ios/`, and `android/` unless the task directly owns them.

## Stop rules

Stop expanding context when the entry point, ownership, affected callers, failure mode, and verification path are known. Do not preload the full docs tree, all of `src`, every test, full Git history, or every available skill.

For long sessions, retain durable decisions and discard repeated narration or raw output. Caveman can reduce response prose but does not replace selective context loading.

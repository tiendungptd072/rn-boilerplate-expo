---
name: git-finish
description: Safely verify, commit, and push only task-owned changes on a topic branch.
---

# Git finish

Use only after implementation and review are complete and commit/push is authorized.

1. Recheck `git status --short --branch` and identify pre-existing user changes.
2. Run verification required by the routed tier and inspect `bun run ai:diff` plus `git diff --check`.
3. List only task-owned files. Never stage the entire tree unless ownership is certain.
4. Run `bun run git:auto -- --message "<conventional commit>" --paths <files>`.
5. Confirm the topic branch, commit, and remote push. Never merge or push a protected branch.

Complete when verification passed, only owned files were committed, the remote topic branch exists, and unrelated working changes remain untouched.

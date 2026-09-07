# Git flow

Use a short-lived topic branch and a reviewed pull request for every production change. Preserve unrelated local work throughout the workflow.

## Branches

Protected branches are `main`, `master`, `develop`, `production`, and `prod`. Never commit or push directly to them.

Create a branch with one of these prefixes:

- `feat/` for product capabilities
- `fix/` for defects
- `refactor/` for behavior-preserving restructuring
- `perf/` for measured performance work
- `docs/`, `test/`, `build/`, or `chore/` for the matching maintenance scope

Use a concise kebab-case description, for example `feat/profile-screen` or `fix/session-refresh-race`.

## Start safely

1. Run `git status --short --branch` and identify pre-existing changes.
2. Update remote references with `git fetch origin` when network access is available.
3. Create a topic branch from the intended base branch.
4. Do not stash, discard, or absorb unrelated work without its owner's approval.

If the working tree is already dirty, confirm that switching branches will not mix another task into the new branch. Keep a written list of task-owned paths.

## Commit

Stage explicit paths only:

```bash
git add docs/engineering/coding-standards.md src/features/profile/screens/profile-screen.tsx
git diff --cached --check
git diff --cached
```

Do not use `git add .` when the tree contains pre-existing or untracked user work.

Use Conventional Commits:

```text
feat(profile): add account screen
fix(auth): serialize token refresh
docs: add screen creation guide
```

Each commit should represent one reviewable outcome. Before committing, run the validation required by the changed code and inspect the staged diff for secrets and unintended files.

## Synchronize and push

- Rebase onto the updated base only when the topic branch is private and rewriting it is safe.
- For a shared branch, merge the base or coordinate before rewriting history.
- Push the topic branch and open a pull request; do not merge it automatically.
- Never force-push, hard-reset, clean untracked files, delete a remote branch, or rewrite shared history automatically.

If a hook, test, commit, or push fails, leave the working tree recoverable. Unstage only task-owned paths when necessary, fix the cause, rerun validation, and do not bypass hooks with `--no-verify`.

## Pull request checklist

- The title follows Conventional Commits and describes the user-visible outcome.
- The description states scope, validation, screenshots for UI work, risks, and known limitations.
- Dependency and lockfile changes are intentional and compatible with Expo SDK 57.
- Security, privacy, accessibility, and platform-specific behavior were reviewed when relevant.
- The branch contains no unrelated files, secrets, generated output, or native changes outside the task.

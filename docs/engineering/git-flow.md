# Automated Git Flow

The safe lifecycle is status/ownership capture, verification, explicit-path staging, secret guard, Conventional Commit, topic-branch push, and handoff.

Run once per clone:

```bash
bun run git:setup
bun run git:doctor
```

Start work with `bun run git:start -- "<task>"`. On `main`, `master`, `develop`, `production`, or `prod`, it creates a typed topic branch (`feat/`, `fix/`, `refactor/`, `perf/`, `docs/`, or `chore/`). On an existing topic branch it preserves that branch.

Finish only after review:

```bash
bun run git:auto -- \
  --message "fix(auth): serialize token refresh" \
  --paths src/lib/api-client.ts src/lib/auth/session.ts
```

The command refuses pre-staged changes, validates the message, scans owned files for common secrets, runs tiered verification, creates a topic branch when required, stages only explicit paths, commits, and pushes with upstream tracking. `--all` is reserved for a fully owned tree.

Before commit failure it safely unstages automation-owned paths, preserves the working tree, does not push, and tries to return from a temporary topic branch. It never force-pushes, hard-resets, cleans files, rewrites history, deletes remote branches, merges protected branches, or releases production.

The hooks enforce commit format and protected-branch push safety. CI should independently enforce branch protection and comprehensive secret scanning.

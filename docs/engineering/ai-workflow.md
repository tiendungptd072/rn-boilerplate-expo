# AI-assisted development workflow

The workflow keeps simple work fast and applies more evidence only as risk increases. `AGENTS.md` is the entry point; this document owns lifecycle details.

## Fast lane

Answer direct questions that do not require repository evidence without Git status, planning, owner docs, skills, or verification.

For a trivial localized edit such as a typo or formatting correction:

1. Check the target file and current working-tree ownership.
2. Make the smallest change.
3. Run a focused format or diff check.
4. Skip planning, broad repository search, checkpoints, and Git automation.

Fast lane never bypasses security, data-loss, auth, release, migration, accessibility, or trust-boundary review.

## Repository change lifecycle

For non-trivial changes:

1. Record `git status --short --branch` and preserve pre-existing work.
2. Classify task type, domain, scope, and minimum risk tier using the [Model gate](model-gate.md).
3. Select one owner document through the [wiki index](../README.md).
4. Search for the entry point, direct callers, and nearest relevant tests.
5. Plan only when required by risk or blast radius.
6. Implement the smallest edge-case-correct change in the owning layer.
7. Review the scoped diff and verify using [Testing](testing.md).
8. Report changed paths, checks run, limitations, and remaining risks.

## Authorization boundaries

- Answer, explain, diagnose, review, or plan: inspect and report; do not implement unless asked.
- Change, build, or fix: make in-scope local edits and run non-destructive validation.
- Ask before destructive actions, external writes, releases, purchases, or material scope expansion.
- Commit and push only when explicitly requested or already authorized for the task.

## Long tasks

Preserve only durable facts: goal, confirmed findings, files changed, decisions, verification, risks, and next action. Do not copy full conversation history, raw logs, or secrets into repository files.

Checkpoint automation is not currently installed. If added later, its state must be ignored by Git and remain optional.

## Automation contract

Future deterministic tooling may expose `ai:route`, `ai:doctor`, and checkpoint commands. Those tools must not call another LLM, weaken safety floors, or become mandatory for direct questions and trivial edits. Until implementation exists, do not invoke or document them as available commands.

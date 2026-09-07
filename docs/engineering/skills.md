# Agent skills

Skills package reusable task workflows. They should contain non-obvious procedure, references, or deterministic scripts—not duplicate repository policy.

## Current status

The repository does not currently contain `.agents/skills`. Codex may expose user-level or system skills, but project correctness must not depend on a personal installation. Caveman is optional and documented separately.

## Selection rules

- Load a skill only when the task or user explicitly names it.
- Prefer one primary skill. Add another only when the task crosses a real boundary.
- Keep global invariants in `AGENTS.md`, detailed standards in owner docs, and repeatable workflows in skills.
- Never load all skills for discovery; their metadata should be enough to select one.
- A skill may raise verification or safety requirements but must not weaken repository rules.

## Minimal future set

When repository-local skills are implemented, start with:

| Skill | Scope |
| --- | --- |
| `rn-feature` | Screen, route, and product capability implementation |
| `bug-fix` | Root-cause diagnosis and regression protection |
| `ui-component` | Shared component and design-system behavior |
| `api-integration` | Typed remote endpoint and trust-boundary work |
| `code-review` | Scoped correctness and regression review |
| `git-finish` | Explicit-path verification, commit, and push safety |

Add dependency, performance, or refactor skills only after repeated tasks justify them.

## Skill contract

Each skill should have a concise `SKILL.md` with clear trigger metadata, required workflow, verification, and references. Put detailed variants in directly linked reference files. Avoid README files, duplicated examples, generated boilerplate, or scripts that are never executed.

Validate skills independently and benchmark representative tasks before making them default. Missing optional skills should degrade to owner docs and normal engineering judgment, not block the task.

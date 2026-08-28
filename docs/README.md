# Engineering wiki

`AGENTS.md` is the compact repository entry point. This wiki owns detailed project decisions; read only the page needed for the current task.

## Task routing

| Task | Primary document | Supporting document when needed |
| --- | --- | --- |
| Project structure or dependency ownership | [Architecture](architecture.md) | [Coding standards](engineering/coding-standards.md) |
| General implementation or review | [Coding standards](engineering/coding-standards.md) | [Testing](engineering/testing.md) |
| Add or change a screen | [Add a screen](guides/add-a-screen.md) | [Architecture](architecture.md) |
| Shared UI, theme, tokens, or components | [Design system](design-system.md) | [Component visual QA](engineering/component-visual-qa.md) |
| API integration or error handling | [API and errors](engineering/api-and-errors.md) | [Security](engineering/security.md) |
| Auth, sensitive data, permissions, or deep links | [Security](engineering/security.md) | [State and storage](engineering/state-and-storage.md) |
| Client state, server state, or persistence | [State and storage](engineering/state-and-storage.md) | [Testing](engineering/testing.md) |
| Translation or accessibility | [i18n and accessibility](engineering/i18n-accessibility.md) | [Design system](design-system.md) |
| Startup performance | [Cold-start performance](cold-start-performance.md) | [Testing](engineering/testing.md) |
| Branch, commit, push, or pull request | [Git flow](engineering/git-flow.md) | None |
| AI execution lifecycle | [AI workflow](engineering/ai-workflow.md) | [Model gate](engineering/model-gate.md) |
| AI context selection | [Context strategy](engineering/context-strategy.md) | [Skills](engineering/skills.md) |
| Optional response compression | [Caveman](engineering/caveman.md) | [Context strategy](engineering/context-strategy.md) |
| Template distribution or consumer upgrade | [Distribution](distribution.md) | [Migrations](migrations/) |
| Architecture decision | [ADR index](adr/) | [ADR template](adr/0000-adr-template.md) |

## Reading rules

1. Open one primary owner document, then inspect the relevant source entry point.
2. Open a supporting document only when the task crosses that boundary.
3. Source code, tests, and versioned platform documentation override stale examples.
4. Update the owning document when a durable decision changes; do not duplicate the rule elsewhere.

## Release and planning

| Page | Owns |
| --- | --- |
| [Distribution](distribution.md) | Release contract, consumer upgrade path, and package-extraction threshold |
| [Migrations](migrations/) | One guide per breaking base version |
| [Changelog](../CHANGELOG.md) | Changes in each version |
| [Feature plan template](_TEMPLATE_FEATURE_PLAN.md) | Plan prepared before non-trivial work |

## Automation status

The repository provides deterministic AI routing, context selection, verification tiers, Git hooks, and topic-branch automation. These gates do not call another LLM. Use the scripts documented in [AI workflow](engineering/ai-workflow.md) and [Git flow](engineering/git-flow.md).

## Adding a document

Add its row to this index in the same commit. Prefer extending an existing owner page over creating a sibling. If the page introduces an agent rule, also update the compact rule or documentation map in `AGENTS.md`.

# Documentation index

[AGENTS.md](../AGENTS.md) at the repository root is the single source of truth for how work is done here: hard invariants, the plan gate, and the verification loop. These pages hold the detail behind it.

## Engineering

| Page | Owns |
| --- | --- |
| [architecture.md](architecture.md) | Source layout, dependency boundaries, route rule, state and persistence choices |
| [design-system.md](design-system.md) | Atomic layers, the three-tier color contract, theme usage, token system rules |
| [cold-start-performance.md](cold-start-performance.md) | Startup baseline, performance budget, and how cold start is measured |

## Release

| Page | Owns |
| --- | --- |
| [distribution.md](distribution.md) | Release contract, consumer upgrade path, package-extraction threshold |
| [migrations/](migrations/) | One guide per breaking base version |
| [../CHANGELOG.md](../CHANGELOG.md) | What changed in each version |

## Decisions

| Page | Owns |
| --- | --- |
| [adr/](adr/) | Architecture decision records — the *why* behind boundaries that are expensive to reverse |
| [adr/0000-adr-template.md](adr/0000-adr-template.md) | Template for a new ADR |

## Planning

| Page | Owns |
| --- | --- |
| [\_TEMPLATE\_FEATURE\_PLAN.md](_TEMPLATE_FEATURE_PLAN.md) | The plan written and approved before non-trivial work starts |

## Adding a doc

Add the row to this index in the same commit that adds the page. An unindexed page is invisible to both humans and agents, and it drifts because nobody knows it is there.

Before adding one, check whether the content belongs in an existing page instead. Prefer extending a page over creating a sibling. If the new page states a rule that agents must follow, add the rule to `AGENTS.md §Hard invariants` and the page to `AGENTS.md §Documentation map` as well — otherwise it will not be read.

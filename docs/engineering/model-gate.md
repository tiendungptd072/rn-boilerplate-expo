# Model and risk gate

The gate selects the minimum investigation and verification depth. It is a risk policy, not a requirement to call an API or switch models automatically.

## Tiers

| Tier | Typical work | Plan | Verification |
| --- | --- | --- | --- |
| FAST | Direct answer, typo, documentation, tiny known rename | No | Focused check |
| BALANCED | Normal feature, known bug, screen, shared UI | Optional | Lint, typecheck, relevant tests |
| DEEP | Unknown bug, performance, architecture, broad refactor | Required | BALANCED plus broader relevant tests |
| CRITICAL | Auth, security, sensitive data, migration, signing, release | Required | Maximum appropriate checks and explicit risk review |

## Safety floors

Semantic risk wins over prompt length or numeric scoring:

- Auth, credentials, session handling, security, sensitive data, migration, signing, and production release are CRITICAL.
- Unknown/intermittent defects, race conditions, performance investigations, architecture changes, and broad refactors are at least DEEP.
- Product features, known defects, shared UI components, and dependency changes are at least BALANCED.
- Documentation and low-risk maintenance may remain FAST.

Accessibility and data-loss risk may raise any task above its default tier.

## Plan gate

A plan is required for DEEP and CRITICAL work, multi-module changes, migrations, unclear blast radius, and release/signing operations. BALANCED work uses a short plan only when it reduces uncertainty. FAST work needs no ceremony.

## Model selection

Model names and reasoning controls vary by agent surface and change over time. Keep any mapping in one future configuration file, verify it against the active surface, and benchmark it on representative tasks. A deterministic router may recommend a tier but must not silently invoke a model or lower the safety floor.

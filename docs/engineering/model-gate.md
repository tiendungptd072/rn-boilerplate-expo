# Deterministic Model Gate

`bun run ai:gate -- "<task>"` classifies without calling an LLM. It combines a deterministic score with a semantic minimum safety floor; the higher tier wins. Model identifiers and reasoning effort live only in `config/ai-flow.json`.

| Tier | Typical work | Minimum reasoning |
| --- | --- | --- |
| FAST | Typo, documentation, tiny rename | low |
| BALANCED | Normal feature, known bug, UI component | medium |
| DEEP | Unknown bug, architecture, performance, broad refactor | high |
| CRITICAL | Auth, security, sensitive data, migration, signing, release | xhigh |

Numeric scoring cannot downgrade a semantic safety floor. DEEP and CRITICAL require a plan. Model names are recommendations for compatible agent surfaces, not an API invocation by the router; operators can update the central config and benchmark the change without rewriting docs.

Current OpenAI model choice should be checked against the [official model guidance](https://developers.openai.com/api/docs/guides/latest-model) before changing the central mapping.

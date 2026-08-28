# Coding and comment standards

Use strict TypeScript, precise domain names, focused components/hooks, and explicit boundaries. Prefer existing repository and platform APIs before writing helpers or adding dependencies. Product code follows the dependency rules in [architecture](../architecture.md).

Keep code boring and local until a second real use justifies sharing. Do not introduce placeholder directories, global stores, generic repositories, or wrappers for possible future needs. Export the smallest useful surface and make invalid states hard to construct.

## Comments

Comments explain why: an invariant, trade-off, platform constraint, security boundary, or non-obvious failure mode. Never narrate obvious mechanics. Update or remove comments with the code they describe.

- `NOTE:` records durable context.
- `WARNING:` identifies behavior that could cause data loss, security incidents, or production failure.
- `TODO(owner-or-issue):` tracks concrete follow-up with ownership; unowned TODOs are not allowed.
- `ponytail:` records an accepted temporary ceiling and its upgrade path.

Use TSDoc only when an exported API, component, hook, side effect, lifecycle, or error contract is not already clear from its name and TypeScript signature. Never place credentials, personal data, or internal secret values in comments.

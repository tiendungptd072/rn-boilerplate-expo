# Optional Caveman compression

Caveman is an optional compression overlay, never the source of project behavior. The repository, `AGENTS.md`, router config, owner docs, and skills must work when Caveman is absent.

Use it only for long tasks where measured context cost is material and the compressed output preserves requirements, confirmed facts, decisions, file ownership, verification, and known risks. Do not use it for short tasks, exact code/config payloads, secrets, security-critical evidence, or when compression obscures provenance.

For Claude Code or Codex, apply Caveman after deterministic routing and owner-doc selection, then retain a human-readable checkpoint for durable state. Installation and invocation are operator-owned because upstream interfaces can change.

Never claim a fixed saving percentage. Treat upstream results as upstream claims and compare the same representative tasks using `.ai/benchmarks/tasks.json`. Record exact token metrics only when the agent surface exposes them; otherwise mark them `unavailable` and use proxy metrics.

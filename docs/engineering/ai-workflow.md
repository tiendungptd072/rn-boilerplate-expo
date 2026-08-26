# AI-assisted development workflow

The AI Flow is deterministic developer tooling shared by Codex and Claude Code. Caveman is optional. No gate calls another LLM.

```text
task -> classifier -> model -> context -> skill -> plan -> investigate
-> build -> review -> verify -> checkpoint/compaction -> Git -> handoff -> metrics
```

## Setup

```bash
bun install
bun run git:setup
bun run ai:doctor
bun run git:doctor
```

For every task, capture Git status and run `bun run ai:route -- "<task>"`. Follow its safety floor, selected skill, owner docs, likely search paths, avoid list, context budget, and Plan Gate result. Keep exploration progressive and use bounded tools. A checkpoint contains compressed durable state only.

Codex uses `AGENTS.md` and repository skills directly. Claude Code uses `CLAUDE.md`, which points to the same canonical entry, then opens only the routed skill. Neither surface should maintain a duplicate policy file.

After verification, use `git:auto` with explicit owned paths. Record benchmark metrics only when exposed; use proxy metrics otherwise. See [model gate](model-gate.md), [context strategy](context-strategy.md), [skills](skills.md), [Git Flow](git-flow.md), and [Caveman](caveman.md).

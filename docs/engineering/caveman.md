# Caveman

[Caveman](https://github.com/JuliusBrussee/caveman) is an optional response-compression skill for coding agents. It removes conversational filler while preserving technical terms, code, commands, numbers, and exact error messages.

Caveman is not a source of project behavior. `AGENTS.md`, owner documentation, source code, and tests remain authoritative. The repository, CI, and application must work without Caveman installed.

## Installation

Install the primary `caveman` skill at the user level. Codex normally discovers it at:

```text
~/.codex/skills/caveman
```

The skill becomes discoverable in a new Codex turn. It is not an application dependency, so it must not be added to `package.json` or `bun.lock`. The repository must continue to work when it is absent.

## Codex usage

Start a new turn, then invoke one of these modes:

```text
/caveman lite
/caveman
/caveman full
/caveman ultra
/caveman wenyan-lite
/caveman wenyan-full
/caveman wenyan-ultra
```

Use `/caveman off` or say `normal mode` to stop. Prefer `lite` for normal engineering work; increase compression only when the result remains unambiguous.

For installation or updates on another machine, use a trusted skill installer with the GitHub source `JuliusBrussee/caveman` and path `skills/caveman`. Review the remote `SKILL.md` before installing or updating it.

## Claude Code usage

When Claude Code is installed, follow the upstream plugin instructions:

```bash
claude plugin marketplace add JuliusBrussee/caveman
claude plugin install caveman@caveman
```

This project does not require that plugin and must not fail when Claude Code or Caveman is absent.

## When to use

- Routine implementation summaries and status updates.
- Long debugging or review sessions where concise output preserves useful context.
- Repeated command/result loops where narration adds no value.
- Controlled token benchmarks comparing the same task and model settings.

## When not to use

Caveman's auto-clarity behavior should return to normal prose for:

- Security warnings and sensitive-data decisions.
- Destructive or irreversible action confirmations.
- Ordered multi-step procedures where fragments could change meaning.
- User confusion or repeated requests for clarification.

Do not use compressed prose in persisted code comments, documentation, commit messages, issues, pull requests, release notes, or user-facing product copy unless that artifact has its own explicit style requirement.

## Benchmarking

Do not present upstream percentages as guaranteed project savings. Measure locally with representative tasks:

1. Run the same prompt, model, reasoning level, tool set, and repository state with Caveman off and on.
2. Record input tokens, output tokens, tool calls, elapsed time, task correctness, and verification results when the agent exposes them.
3. Repeat enough times to reduce run-to-run variance.
4. Keep Caveman only when token or latency improvement does not reduce correctness, clarity, or safety.

The response skill primarily changes generated prose. Treat any proxy, MCP compression, or skill-conversion feature from the upstream project as a separate opt-in evaluation with its own security and quality review.

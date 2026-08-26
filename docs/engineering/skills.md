# Agent skills

Skills under `.agents/skills` are concise procedures loaded only when routed. `AGENTS.md` and owner docs remain the source of project behavior; skills reference them instead of copying standards.

| Route | Skill |
| --- | --- |
| New screen, route, component, feature | `rn-feature` |
| Known or unknown defect | `bug-fix` |
| Endpoint/query/mutation | `api-integration` |
| Requested review or small maintenance | `code-review` |
| Broad internal restructure | `refactor` |
| Expo/package upgrade | `dependency-upgrade` |
| Measured performance issue | `performance` |
| Shared UI or Design System component | `ui-component` |
| Verified task completion | `git-finish` |

`ai:route` returns only task-relevant skills and names `git-finish` separately as the completion skill. Codex discovers repository skills through `.agents/skills`; Claude Code reads the same canonical `AGENTS.md` through `CLAUDE.md` and can follow the routed skill path directly.

Each skill must have clear entry/completion conditions, remain procedural and short, and avoid embedding model names or duplicated engineering policy.

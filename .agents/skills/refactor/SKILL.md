---
name: refactor
description: Restructure internal code while preserving observable behavior.
---

# Refactor

Use for broad internal structure changes. DEEP planning is mandatory.

1. State the invariant behavior and measurable reason for change.
2. Map public exports, callers, tests, and architecture boundaries before editing.
3. Prefer deletion or an existing abstraction; split the work into reversible steps.
4. Keep behavior changes out unless explicitly accepted and tested separately.
5. Run broad relevant tests and compare the final public surface to the baseline.

Complete when the stated invariant holds, all callers migrate, dead paths are removed, and complexity is demonstrably lower.

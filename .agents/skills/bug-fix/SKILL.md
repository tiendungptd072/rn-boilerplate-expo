---
name: bug-fix
description: Diagnose and fix known or unknown defects without masking the root cause.
---

# Bug fix

Use for regressions, crashes, races, or incorrect behavior.

1. Reproduce or state the observable failure and expected behavior.
2. Search the failing symbol, all callers, and the owning boundary before reading neighboring modules.
3. Form one testable hypothesis; gather evidence and revise it rather than adding speculative guards.
4. Add the smallest regression check that fails before the fix.
5. Fix the root cause at the shared boundary when multiple callers are affected.
6. Verify the original failure, relevant edge cases, and platform-specific behavior.

Complete when the regression check passes, no caller still relies on broken semantics, and the diff contains only the fix and its verification.

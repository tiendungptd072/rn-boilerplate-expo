---
name: code-review
description: Review a scoped change for correctness, risk, regressions, and missing verification.
---

# Code review

Use when review is the requested outcome or as a lightweight final review for documentation/maintenance work.

1. Start with the diff and task contract, not the whole repository.
2. Trace changed shared symbols to callers and inspect trust, storage, accessibility, and platform boundaries they cross.
3. Prioritize concrete defects, security issues, regressions, and missing tests over style preferences.
4. Cite file and line evidence; distinguish confirmed findings from questions.
5. If no findings remain, state residual verification risk concisely.

Complete when every finding is actionable, severity reflects impact, and no unrelated redesign is proposed.

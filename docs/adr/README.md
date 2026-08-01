# Architecture decision records

An ADR records a decision that is expensive to reverse, together with the context that made it correct at the time. Code shows *what* the system does; an ADR is the only place that keeps *why*.

## Records

| ADR | Title | Status |
| --- | --- | --- |
| [0001](0001-versioned-template-distribution.md) | Versioned template distribution | Accepted |

## When to write one

Write an ADR when the decision changes a boundary that later work has to live with:

- A dependency boundary or module ownership rule in [../architecture.md](../architecture.md).
- A new runtime dependency that becomes load-bearing, or the removal of one.
- Auth, API, storage, or navigation contracts.
- A release, versioning, or distribution mechanism.
- Choosing one approach where a reasonable engineer would have picked another, and the loser is worth naming.

Do not write one for a bug fix, a refactor inside a single module, or a choice you would reverse in an afternoon. A comment or the plan document is enough.

## Rules

1. **Decisions stay human.** An agent may draft an ADR and propose options, but a person accepts it. An agent must not mark an ADR `Accepted`.
2. One decision per record. If you are writing "and also", write two.
3. Number sequentially, never reuse a number, and use the slug form `NNNN-short-title.md`.
4. Records are append-only. A decision that no longer holds is superseded, not edited: set the old record's status to `Superseded by NNNN` and state in the new record which one it replaces. The old context is why the reversal makes sense.
5. Write the consequences you actually accept, including the bad ones. A record with no downsides was not a decision.
6. Add the row to the table above in the same commit.
7. Copy [0000-adr-template.md](0000-adr-template.md) and keep its section headings. Body language follows the team — existing records are in Vietnamese.

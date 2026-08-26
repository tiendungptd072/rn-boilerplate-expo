# AI Flow benchmarks

Run every task in `tasks.json` from the same clean commit, environment, acceptance criteria, and time limit. Store local results under ignored `.ai/reports/<date>/<variant>/<task>.json`, using `result.example.json` as the schema.

Compare these variants in order:

1. baseline agent behavior
2. Model Gate
3. model + Context Gate
4. model + context + selective skills
5. model + context + skills + Caveman
6. full flow including verification and Git handoff

Record the model, reasoning tier, task type, files opened, emitted lines, tool calls, context sources, elapsed time, verification result, and task success. Record input, cached input, output, and reasoning tokens only when the surface exposes exact values; otherwise use the string `unavailable`. Never estimate or invent tokens.

Compare correctness first, then token usage, elapsed time, and proxy context metrics. Reject an optimization that lowers task success or verification quality. Repeat noisy tasks and report median results. Caveman savings are workload-specific and must be measured rather than copied from upstream claims.

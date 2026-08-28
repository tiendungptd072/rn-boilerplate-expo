# API and error handling

The configured client in `src/lib` owns transport defaults; feature API modules own endpoint mapping. TanStack Query owns remote cache and request lifecycle. Do not duplicate server state in Zustand.

- Validate untrusted response and persisted data at the boundary with Zod when malformed input could escape into domain code.
- Convert transport shapes to domain types before UI consumption.
- Support cancellation and distinguish offline, timeout, authorization, validation, and server failures when the user action differs.
- Retry only idempotent transient failures, with a finite policy. Never re-enter terminal authentication refresh loops.
- Do not expose raw backend messages, tokens, personal data, request headers, or stack traces to users or logs.
- Mutations that can duplicate effects require an explicit idempotency decision.

UI must provide appropriate loading, empty, error, and retry states without discarding usable cached data.

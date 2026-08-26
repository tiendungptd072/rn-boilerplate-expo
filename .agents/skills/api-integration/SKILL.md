---
name: api-integration
description: Add or change a remote endpoint integration and its typed trust boundary.
---

# API integration

Use for endpoints, transport mapping, queries, or mutations. Read `docs/engineering/api-and-errors.md`, `security.md`, and `testing.md`.

1. Confirm the API contract, auth requirement, cancellation, retry, and idempotency behavior.
2. Keep transport details in the owning feature; reuse the configured API and query clients.
3. Validate untrusted responses with Zod where malformed data could escape the boundary.
4. Map transport failures to the repository error contract without leaking sensitive details.
5. Cover success, malformed response, relevant error, and cancellation/offline behavior.

Complete when callers consume typed domain data, secrets are not persisted or logged, and focused tests pass.

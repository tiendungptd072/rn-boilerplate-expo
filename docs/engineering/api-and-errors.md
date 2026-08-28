# API and errors

The shared Axios clients in `src/lib/api-client.ts` own transport configuration and authenticated retry behavior. Features own endpoint functions, runtime schemas, query keys, and domain error mapping.

## Client ownership

- Use `publicApiClient` for login, refresh, and other public endpoints.
- Use `apiClient` for authenticated endpoints.
- Configure session refresh through `configureApiAuth`; refresh callbacks must use the public client to avoid interceptor recursion.
- Keep access tokens in the session layer. Do not let screens set authorization headers directly.
- Preserve the configured timeout unless an endpoint has a measured, documented need.

## Feature boundary

Place remote data inside the owning feature:

```text
src/features/<feature>/
├── api/
├── schemas/
└── hooks/
```

Validate untrusted response data with Zod before exposing it to product UI. Convert transport payloads into domain types at this boundary; do not spread backend naming or nullable uncertainty through components.

## TanStack Query

Use TanStack Query for server state, caching, retries, invalidation, and request lifecycle. The shared client already tracks network and app focus. Client errors in the 4xx range are not retried by default; other query failures receive at most one retry. Mutations are not retried automatically.

Use stable feature-owned query keys. Invalidate the narrowest affected key after mutation. Do not mirror Query data into Zustand.

## Errors

- Preserve rejected promises for Query and mutation error states.
- Map transport errors to a small feature/domain error union before rendering.
- Show localized, actionable messages; never display raw Axios errors or backend stack traces.
- Distinguish offline, timeout, unauthorized, validation, not-found, conflict, rate-limit, and unknown failures when user recovery differs.
- Log only approved diagnostic metadata. Redact headers, tokens, cookies, credentials, and sensitive payload fields.

## Auth failures

The authenticated client retries a request at most once after a serialized token refresh. A terminal unauthorized result clears in-memory session state through the configured callback. Tests must cover concurrent 401 requests, refresh failure, explicit authorization headers, and logout races when this behavior changes.

Security-sensitive transport changes also follow [Security](security.md).

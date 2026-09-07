# Security

Security decisions are part of feature design, not a final checklist. Minimize collected data, validate every trust boundary, preserve platform security defaults, and keep the backend authoritative for authentication and authorization.

## Data classification and storage

Classify data before persisting it:

| Data | Storage | Rule |
| --- | --- | --- |
| Access/refresh tokens, credentials, cryptographic keys | `expo-secure-store` through `src/lib/auth` | Store the minimum value and handle unavailable or invalidated entries |
| Theme, language, and non-sensitive preferences | MMKV through `src/lib/storage` | Never mix credentials or sensitive personal data into preference storage |
| Server-owned data | TanStack Query memory/cache | Do not add persistence without a retention, encryption, logout, and migration design |
| Secrets required by a backend | Backend secret manager | Never ship them in the app bundle |

`EXPO_PUBLIC_*` values are embedded in the client bundle and are public configuration, not secrets. Never place service credentials, private API keys, signing material, or privileged backend tokens there.

SecureStore is for small secrets and is not the sole source of truth for irreplaceable data. Account for platform differences: entries can disappear, biometric-protected keys can be invalidated, Android data does not survive uninstall, and iOS Keychain data may survive reinstall. On web, do not fall back to local storage for credentials; choose a reviewed web session design such as a backend-managed secure cookie.

## Authentication and authorization

- Treat route protection as UX, not authorization. The backend must authorize every protected operation and object.
- Keep access tokens out of React component state, URLs, logs, analytics, crash metadata, and error messages.
- Use the shared API client and session provider. Refresh one session at a time, retry a request at most once, and clear in-memory plus persisted session state on terminal unauthorized responses.
- Prevent stale async work from restoring a session after logout or account switching.
- Require fresh authentication for high-impact actions when the product risk calls for it. Biometrics unlock a local credential; they do not replace server-side authorization.
- Avoid putting personal data or tokens in route parameters because URLs can be logged and retained.

## Network and untrusted data

- Use HTTPS and preserve the platform's TLS verification. Do not disable certificate validation or accept all certificates.
- Apply timeouts and cancellation where the user can leave the flow. Retry only safe/idempotent operations unless the backend provides an idempotency key.
- Validate untrusted API, deep-link, notification, clipboard, file, and persisted payloads before use.
- Encode user-controlled values rather than concatenating them into URLs, queries, markup, or commands.
- Map low-level failures to safe user messages. Diagnostic logging must redact authorization headers, cookies, tokens, credentials, and personal payload fields.

## Mobile privacy and platform safety

- Request a permission only at the moment its feature needs it and explain the user benefit first.
- Map a denied permission with `canAskAgain: false` to the shared settings recovery UI. Never request permission automatically when a component mounts, and recheck status when the app becomes active after visiting Settings.
- Keep `PermissionGuide` independent of native permission packages. Add camera, microphone, location, background modes, and their purpose strings only with an approved feature requirement; foreground-only access is the default.
- Collect the minimum data required, define retention and deletion behavior, and keep platform privacy declarations accurate.
- Hide or redact sensitive content in notifications, app-switcher snapshots, screenshots, and copied text when the threat model requires it.
- Treat deep links and push notifications as untrusted input. Confirm intent before destructive or financial actions.
- Do not implement custom cryptography. Use reviewed platform/Expo primitives and obtain a security review for new cryptographic requirements.

## Dependencies and configuration

- Prefer Expo-supported APIs and install compatible native packages with `bunx expo install`.
- Review package ownership, maintenance, permissions, native configuration, and transitive risk before adding a dependency.
- Commit no `.env` secrets, certificates, provisioning profiles, keystores, or production service-account files.
- Do not expose source maps, debug menus, test accounts, verbose network logs, or development endpoints in production builds.

## Security review gate

A focused security review is required for authentication, authorization, payments, account recovery/deletion, cryptography, sensitive storage, deep links that perform actions, new permissions, new third-party SDKs, and changes to signing or release configuration.

Before handoff, verify:

1. Trust boundaries validate input and server authorization remains authoritative.
2. Sensitive data has an explicit storage, retention, redaction, and deletion policy.
3. Logout and unauthorized flows clear session state and cannot be undone by a stale request.
4. Logs, analytics, URLs, notifications, and error UI reveal no secrets or unnecessary personal data.
5. Relevant tests cover malformed input and denied/expired authorization, and sensitive device behavior is tested on real hardware when required.

References: [Expo SecureStore](https://docs.expo.dev/versions/v57.0.0/sdk/securestore/), [OWASP MASVS](https://mas.owasp.org/MASVS/), [MASVS storage](https://mas.owasp.org/MASVS/05-MASVS-STORAGE/), and [MASVS network](https://mas.owasp.org/MASVS/08-MASVS-NETWORK/).

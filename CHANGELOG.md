# Changelog

Các thay đổi của base tuân theo Semantic Versioning. Phiên bản ứng dụng của từng fork được quản lý độc lập trong `config/brand.json`.

## 1.1.0 — 2026-08-01

### Breaking changes

- Thay `app.json` bằng typed dynamic `app.config.ts` và brand manifest.
- Thay destructive `reset-project` bằng fail-closed `init-project` có dry-run.
- API consumers nhận normalized `ApiError` thay vì raw Axios error.
- Terminal 401 luôn kết thúc session; refresh requests dùng chung một promise.

### Added

- Dev/preview/production có application ID, scheme và EAS channel riêng.
- Runtime public environment được validate bằng Zod.
- Root render lightweight boot state trong lúc SecureStore hydrate.
- Bun tests cho auth race, terminal 401, error mapping và initializer tooling.
- Versioned-template distribution contract và CI quality gate.

Migration: [docs/migrations/1.1.0.md](docs/migrations/1.1.0.md).

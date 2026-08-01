# ADR 0001 — Versioned template distribution

- Status: accepted
- Date: 2026-08-01

## Context

Base chưa có package registry hoặc organization scope. Clone-and-diverge không có version làm một fix phải được phát hiện và áp dụng lại trên từng fork.

## Decision

Phát hành repository dưới dạng versioned template với Semantic Versioning, changelog và migration guide. Runtime boundary có public contract rõ (`ApiError`, auth callbacks, storage rules) để có thể chuyển sang private core package mà không đổi feature API.

Mỗi dự án con lưu commit/tag base đã nhận. Khi base phát hành version mới, consumer đọc migration guide, tạo branch upgrade riêng và chạy quality gate trước khi merge.

Khi có từ ba active consumer trở lên, hoặc cùng một runtime fix phải backport lần thứ hai, chuyển auth/API/storage contracts sang private package. Routes, brand config và product features vẫn thuộc từng app.

## Consequences

- Có update path ngay mà không phụ thuộc registry chưa tồn tại.
- Propagation vẫn cần consumer chủ động nâng template version.
- Semver, migration guide và downstream smoke test là release gate bắt buộc.

# Base distribution

## Release contract

`template.version.json` là version máy đọc của base. `package.json` dùng cùng version; `config/brand.json` giữ version ứng dụng và không bị đồng bộ với version base.

Mỗi release cần:

1. Cập nhật `template.version.json`, `package.json` và `CHANGELOG.md`.
2. Thêm migration guide nếu có breaking change.
3. Chạy lint, typecheck, test và Expo dependency check.
4. Thử migration trên ít nhất một downstream fixture/consumer.
5. Commit release rồi mới tạo Git tag `base-v<version>`.

Không tạo tag khi worktree còn thay đổi hoặc quality gate chưa xanh.

## Consumer upgrade

Mỗi fork ghi base version đang dùng trong tài liệu dự án. Khi nâng:

1. Fetch tag base mới từ upstream template.
2. Đọc changelog và migration guide giữa hai version.
3. Tạo branch `upgrade/base-<version>`.
4. Áp dụng migration theo boundary; không copy toàn bộ `src` đè lên product code.
5. Chạy quality gate và production smoke cho iOS/Android.

## Package extraction threshold

Giữ versioned-template khi chỉ có một hoặc hai consumer. Tách private package khi có ít nhất ba active consumer hoặc khi auth/API/storage fix phải backport lặp lại. Chỉ package contract ổn định; app config, routes, brand assets và feature vẫn ở consumer.

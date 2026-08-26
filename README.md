# Expo Boilerplate RN

Boilerplate React Native production-oriented chạy trên Expo SDK 57, React Native 0.86 và Expo Router. Project sử dụng kiến trúc feature-first, Design System theo Atomic Design, TypeScript strict và Bun làm package manager duy nhất.

## Điểm chính

- Expo Router với typed routes và static web output.
- Light/dark theme tự động theo thiết bị.
- Design System ba tầng token: primitive, semantic và component.
- Atomic UI primitives: `AppText`, `Surface`, `Icon`.
- TanStack Query cho server state và Zustand cho client state.
- React Hook Form kết hợp Zod cho form và runtime validation.
- Axios, NetInfo, MMKV, SecureStore, localization và i18next đã sẵn sàng để tích hợp theo feature.
- React Compiler, Reanimated 4 và reduced-motion policy.
- ESLint Flat Config và TypeScript strict.

## Yêu cầu môi trường

- [Bun](https://bun.sh/) 1.3.14 trở lên.
- Xcode để chạy iOS simulator.
- Android Studio để chạy Android emulator.
- Một development build khi sử dụng native modules như MMKV. Expo Go chỉ phù hợp với phần code không phụ thuộc custom native modules.

## Bắt đầu

```bash
bun install
bun run start
```

Từ Expo CLI, chọn platform cần chạy hoặc sử dụng trực tiếp:

```bash
bun run ios
bun run android
bun run web
```

Project dùng `bun.lock` làm lockfile duy nhất. Không sử dụng npm, Yarn hoặc pnpm trong repository này.

## Scripts

| Lệnh | Mục đích |
| --- | --- |
| `bun run start` | Khởi động Expo development server |
| `bun run ios` | Khởi động app trên iOS |
| `bun run android` | Khởi động app trên Android |
| `bun run web` | Khởi động web app |
| `bun run lint` | Chạy Expo ESLint |
| `bun run typecheck` | Kiểm tra TypeScript không tạo output |
| `bun run test:ai` | Chạy test deterministic cho AI Flow và Git Flow |
| `bun run ai:route -- "<task>"` | Chọn task, model, context, skill và Plan Gate |
| `bun run ai:doctor` | Kiểm tra cấu hình và tài liệu AI Flow |
| `bun run git:setup` | Bật Git hooks an toàn cho clone hiện tại |
| `bun run git:auto -- ...` | Verify, commit và push topic branch với explicit paths |
| `bun run reset-project` | Xóa hoặc lưu starter source rồi tạo app trống; chỉ chạy khi thực sự muốn reset |

## AI-assisted development flow

AI Flow là lớp tooling deterministic dùng chung cho Codex và Claude Code. Nó phân loại task, áp dụng model safety floor, chọn context/skill tối thiểu, yêu cầu plan theo risk, verify theo tier và chỉ commit các file được khai báo rõ ràng. Các gate không gọi LLM khác.

Thiết lập một lần cho mỗi clone:

```bash
bun install
bun run git:setup
bun run ai:doctor
bun run git:doctor
```

Luồng chính:

```bash
bun run ai:route -- "fix refresh token race condition"
bun run ai:search -- "refreshToken" src
bun run ai:checkpoint # chỉ khi task dài
bun run git:auto -- \
  --message "fix(auth): serialize token refresh" \
  --paths src/lib/api-client.ts src/lib/auth/session.ts
```

Codex đọc `AGENTS.md` và skill được route trong `.agents/skills`. Claude Code dùng `CLAUDE.md`, file này trỏ tới cùng source of truth. Caveman có thể nén context cho task dài nhưng hoàn toàn optional; không cài Caveman thì workflow vẫn hoạt động. Xem [AI workflow](./docs/engineering/ai-workflow.md), [Model Gate](./docs/engineering/model-gate.md), [Context strategy](./docs/engineering/context-strategy.md), [skills](./docs/engineering/skills.md), [Git Flow](./docs/engineering/git-flow.md) và [Caveman](./docs/engineering/caveman.md).

## Cấu trúc project

```text
.
├── assets/                  # Icons, splash và static images
├── docs/
│   ├── architecture.md      # Ranh giới và dependency rules
│   └── design-system.md     # Token và Atomic Design conventions
├── scripts/                 # Repository maintenance scripts
└── src/
    ├── app/                 # Expo Router routes và root layout
    ├── components/          # Shared cross-feature components
    │   └── ui/              # Reusable interaction primitives
    ├── design-system/
    │   ├── atoms/           # AppText, Surface và Icon
    │   ├── theme/           # Theme provider và light/dark themes
    │   └── tokens/          # Color, type, spacing, shape, icon, motion
    ├── features/            # Product code theo từng domain
    ├── hooks/               # Hooks dùng chung giữa nhiều feature
    ├── lib/                 # Configured clients và infrastructure
    ├── navigation/          # Platform-specific navigators
    ├── providers/           # Root context composition
    └── types/               # Shared và ambient TypeScript declarations
```

Route files trong `src/app` phải mỏng. UI, state và business logic thuộc về feature tương ứng:

```text
src/features/profile/
├── api/             # Queries, mutations và transport mapping
├── components/      # UI chỉ thuộc profile
├── hooks/           # Feature behavior
├── schemas/         # Zod schemas tại trust boundary
├── screens/         # Screen composition
└── store/           # Zustand store nếu feature thực sự cần
```

Chỉ tạo thư mục khi có code thực tế. Không tạo abstraction hoặc global store để dự phòng.

## Design System

Color system gồm ba tầng:

1. `primitive.ts`: raw palette, không sử dụng trực tiếp trong product UI.
2. `semantic.ts`: màu theo mục đích, có đầy đủ light/dark mapping.
3. `component.ts`: token theo component và trạng thái như pressed, focused, disabled hoặc error.

Sử dụng public API từ `@/design-system`:

```tsx
import { AppText, spacing, Surface } from '@/design-system';

export function ProfileCard() {
  return (
    <Surface elevation="sm" tone="elevated" style={{ padding: spacing.md }}>
      <AppText variant="title">Profile</AppText>
      <AppText tone="secondary">Account information</AppText>
    </Surface>
  );
}
```

Không thêm raw hex/RGB vào product component. Typography, spacing, radius, elevation, icon và motion phải lấy từ Design System.

## Quản lý state và dữ liệu

- Dùng React state cho state cục bộ.
- Dùng TanStack Query cho API state, caching và request lifecycle.
- Dùng Zustand cho client state cần chia sẻ ngoài một component subtree.
- Dùng React Hook Form và Zod cho form phức tạp hoặc dữ liệu không đáng tin cậy.
- Dùng SecureStore cho token, credential và dữ liệu nhạy cảm.
- Dùng MMKV cho dữ liệu local cần truy cập nhanh nhưng không nhạy cảm.
- Không lưu server state song song trong Zustand nếu TanStack Query đã sở hữu dữ liệu đó.

Các thư viện infrastructure chỉ được khởi tạo khi có feature thực sự sử dụng chúng. Điều này giữ boilerplate nhỏ và tránh global singleton không có owner.

## Cài package

Với Expo hoặc React Native native modules, để Expo chọn version tương thích SDK 57:

```bash
bunx expo install <package>
```

Với package JavaScript thuần:

```bash
bun add <package>
```

Dev dependency:

```bash
bun add --dev <package>
```

Sau khi thay đổi dependency:

```bash
bunx expo install --check
bun install --frozen-lockfile
```

## Quality gate

Trước khi bàn giao hoặc tạo pull request:

```bash
bun run lint
bun run typecheck
```

Với thay đổi ảnh hưởng routing hoặc web rendering, kiểm tra thêm production export:

```bash
bunx expo export --platform web
```

Comment code phải giải thích lý do, invariant, platform constraint hoặc trade-off. Không comment lại điều code đã thể hiện rõ; cập nhật hoặc xóa comment khi implementation thay đổi.

## Tài liệu

- [Project architecture](./docs/architecture.md)
- [Design System](./docs/design-system.md)
- [HIG behavior standard](./docs/design/hig-behavior.md)
- [Cold-start performance](./docs/cold-start-performance.md)
- [AI-assisted development workflow](./docs/engineering/ai-workflow.md)
- [Expo SDK 57 documentation](https://docs.expo.dev/versions/v57.0.0/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [Expo development builds](https://docs.expo.dev/develop/development-builds/introduction/)

## License

Project được phát hành theo [MIT License](./LICENSE).

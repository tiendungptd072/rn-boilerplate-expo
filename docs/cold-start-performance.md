# Cold-start performance

Tài liệu này giữ baseline, performance budget và quy trình kiểm chứng cold start. Chỉ so sánh số liệu từ release build trên cùng thiết bị, cùng phiên bản hệ điều hành và cùng trạng thái app.

## Mục tiêu theo mức ưu tiên

### P0 — Đo đúng trước khi tối ưu

- Native splash phải xuất hiện ngay và chỉ được ẩn sau khi root view đã layout.
- Không đánh giá cold start bằng Expo Go hoặc development build.
- Mỗi platform đo tối thiểu 10 lần sau khi force-stop app; báo cáo median và p95.
- Ghi riêng các mốc process start, React Native startup, first frame và first interaction.
- Production export không được tăng module count, Hermes bytecode hoặc asset size mà không có lý do được review.

### P1 — Đường khởi động tối thiểu

- Không thêm timer, animation overlay hoặc task không cần thiết trước first frame.
- Root render chỉ khởi tạo provider cần cho màn hình đầu tiên.
- Theme nền đầu tiên phải khớp native splash để tránh flash light/dark.
- Đọc preference khởi động bằng synchronous local storage; network và hydration không được chặn splash.

### P2 — Giảm công việc và payload

- Startup module dùng scoped import thay vì barrel import lớn.
- Một MMKV instance sở hữu toàn bộ non-sensitive preferences.
- Shared atoms không tự tạo worklet hoặc animation cho mỗi instance.
- Dependency và asset không còn reference phải được xóa.

## Baseline của repository

Lệnh export dùng để so sánh:

```bash
bunx expo export --platform android --output-dir /tmp/expo-cold-start-bundle
```

| Metric | Trước tối ưu | Sau tối ưu | Chênh lệch |
| --- | ---: | ---: | ---: |
| Metro modules | 1.718 | 1.710 | -8 |
| Hermes bytecode | 3.849.165 B | 3.829.919 B | -19.246 B |
| Tổng export | 5.292 KiB | 4.952 KiB | -340 KiB |
| Bundled assets | 41 | 40 | -1 |
| Độ trễ splash do JS | 600 ms | 0 ms | -600 ms |

Số byte export không thay thế thời gian cold start thực tế. Repository chưa lưu số millisecond theo thiết bị vì số đó chỉ có ý nghĩa khi lấy từ release build trên phần cứng mục tiêu.

## Quy trình đo trên thiết bị

1. Tạo release build từ commit cần đo.
2. Cài mới build, mở một lần để hoàn tất các tác vụ cài đặt, sau đó force-stop app.
3. Cold-start 10 lần; giữa mỗi lần phải force-stop và chờ process kết thúc.
4. Thu thập cùng một bộ mốc cho từng lần chạy, sau đó tính median và p95.
5. Lặp lại với build đối chứng trên cùng thiết bị.
6. Chỉ merge khi không có regression chưa được giải thích ở first frame, time-to-interactive hoặc bundle budget.

Ưu tiên thiết bị Android cấu hình thấp nhất còn được hỗ trợ và một iPhone đời thấp nhất trong support matrix. Development build chỉ dùng để debug luồng; native splash của development build không đại diện chính xác cho production.

## Guardrails

- Gọi `SplashScreen.preventAutoHideAsync()` ở module scope và không `await` để giữ native splash trước khi React mount.
- Chỉ gọi `SplashScreen.hide()` từ root `onLayout`, sau khi background đúng theme đã sẵn sàng vẽ.
- Không chạy fetch, migrate cache, restore session hoặc preload route trước khi ẩn splash trừ khi màn hình đầu tiên không thể render an toàn nếu thiếu dữ liệu đó.
- Nếu thêm animation khởi động, animation phải nằm sau first frame và tôn trọng reduced motion.
- Sau thay đổi startup, chạy lại lint, typecheck và Android production export; thay đổi routing/web cần thêm web export.

## Cơ hội tối ưu tiếp theo

Material Symbols hiện là asset lớn nhất trong Android export, khoảng 956 KB. Chỉ thay icon strategy khi đo APK/AAB và xác nhận lợi ích lớn hơn chi phí về tính nhất quán, accessibility và bảo trì; không tối ưu asset này chỉ dựa trên kích thước export.

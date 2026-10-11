# specs/_index.md — bảng tra tổng

> Cập nhật 2026-10-11 · người sửa nguyen-van-manh-c

Bảng tra mọi tài liệu spec. Thư mục feature chứa Screen Specification, Function Specifications và
Technical Design; `system-design/` chứa Database Design và API Design.

## Thống kê

| Loại tài liệu | Biểu mẫu | Số file |
|---|---|---|
| Screen Specification | `BM-2-901-51` | 30 |
| Function Specifications | `BM-2-901-54` | 8 |
| Technical Design | `BM-2-901-53` | 6 |
| Database Design | `BM-2-901-50` | 12 |
| API Design | `BM-2-901-52` | 17 |
| **Tổng** | | **73** |

## Tài liệu theo feature

| Feature | Screen | Function | Technical | DB | API | README |
|---|---|---|---|---|---|---|
| Quản lý bên tham gia và tư cách giao dịch | 3 | 1 | 0 | 2 | 1 | [`party-management`](./party-management/README.md) |
| Xác thực và phân quyền | 2 | 1 | 0 | 1 | 4 | [`authentication`](./authentication/README.md) |
| Tiếp nhận lô và thẩm định | 2 | 1 | 1 | 2 | 3 | [`lot-intake`](./lot-intake/README.md) |
| Giao dịch thỏa thuận và đấu giá | 4 | 1 | 2 | 1 | 3 | [`trading`](./trading/README.md) |
| Theo dõi giao hàng | 3 | 1 | 1 | 1 | 2 | [`delivery`](./delivery/README.md) |
| Đối soát, chốt sổ và điều chỉnh | 5 | 1 | 1 | 1 | 2 | [`settlement`](./settlement/README.md) |
| Tiền khuyến khích thanh toán đúng hạn | 2 | 1 | 1 | 2 | 2 | [`incentive`](./incentive/README.md) |
| Quản lý quy định và biểu suất | 2 | 0 | 0 | 1 | 0 | [`rule-management`](./rule-management/README.md) |
| Báo cáo và xuất dữ liệu | 1 | 0 | 0 | 0 | 0 | [`reporting`](./reporting/README.md) |
| Kiểm toán và lưu trữ | 1 | 1 | 0 | 1 | 0 | [`audit`](./audit/README.md) |
| Thông báo | 2 | 0 | 0 | 0 | 0 | [`notification`](./notification/README.md) |
| Liên kết hệ thống kế toán | 1 | 0 | 0 | 0 | 0 | [`accounting-interface`](./accounting-interface/README.md) |
| Danh mục nền và đồng bộ offline | 2 | 0 | 0 | 0 | 0 | [`master-data`](./master-data/README.md) |

## Chỉ mục mức hệ thống

- [`system-design/database-design/_index.md`](./system-design/database-design/_index.md)
- [`system-design/api-design/_index.md`](./system-design/api-design/_index.md)

## Tài liệu dùng chung

- [`_common/error-codes.md`](./_common/error-codes.md) — mã thông điệp
- [`_common/api-list.md`](./_common/api-list.md) — bảng tra API
- [`_common/log-convention.md`](./_common/log-convention.md) — quy ước nhật ký

## Toàn bộ Screen Specification

| Screen ID | Tên | Feature | Nguồn | File |
|---|---|---|---|---|
| `SCR_28` | Quản lý xuất dữ liệu kế toán | Liên kết hệ thống kế toán | 📋 suy diễn | [`SCR_28_SPEC.md`](./accounting-interface/screen-specification/SCR_28_SPEC.md) |
| `SCR_25` | Tra cứu nhật ký kiểm toán | Kiểm toán và lưu trữ | 📋 suy diễn | [`SCR_25_SPEC.md`](./audit/screen-specification/SCR_25_SPEC.md) |
| `SCR_01` | Đăng nhập | Xác thực và phân quyền | ✅ mã nguồn | [`SCR_01_SPEC.md`](./authentication/screen-specification/SCR_01_SPEC.md) |
| `SCR_02` | Quản lý tài khoản và quyền | Xác thực và phân quyền | ✅ mã nguồn | [`SCR_02_SPEC.md`](./authentication/screen-specification/SCR_02_SPEC.md) |
| `SCR_11` | Bảng theo dõi giao hàng | Theo dõi giao hàng | ✅ mã nguồn | [`SCR_11_SPEC.md`](./delivery/screen-specification/SCR_11_SPEC.md) |
| `SCR_12` | Ghi nhận lần giao hàng | Theo dõi giao hàng | ✅ mã nguồn | [`SCR_12_SPEC.md`](./delivery/screen-specification/SCR_12_SPEC.md) |
| `SCR_13` | Ghi ngoại lệ giao hàng kèm ảnh | Theo dõi giao hàng | 📋 suy diễn | [`SCR_13_SPEC.md`](./delivery/screen-specification/SCR_13_SPEC.md) |
| `SCR_19` | Nhập trạng thái thanh toán | Tiền khuyến khích thanh toán đúng hạn | 📋 suy diễn | [`SCR_19_SPEC.md`](./incentive/screen-specification/SCR_19_SPEC.md) |
| `SCR_20` | Kết quả tính thưởng | Tiền khuyến khích thanh toán đúng hạn | ✅ mã nguồn | [`SCR_20_SPEC.md`](./incentive/screen-specification/SCR_20_SPEC.md) |
| `SCR_05` | Tiếp nhận lô hàng | Tiếp nhận lô và thẩm định | ✅ mã nguồn | [`SCR_05_SPEC.md`](./lot-intake/screen-specification/SCR_05_SPEC.md) |
| `SCR_06` | Ghi kết quả thẩm định | Tiếp nhận lô và thẩm định | ✅ mã nguồn | [`SCR_06_SPEC.md`](./lot-intake/screen-specification/SCR_06_SPEC.md) |
| `SCR_29` | Quản lý lịch chợ | Danh mục nền và đồng bộ offline | 📋 suy diễn | [`SCR_29_SPEC.md`](./master-data/screen-specification/SCR_29_SPEC.md) |
| `SCR_30` | Danh mục và tham số hệ thống | Danh mục nền và đồng bộ offline | 📋 suy diễn | [`SCR_30_SPEC.md`](./master-data/screen-specification/SCR_30_SPEC.md) |
| `SCR_26` | Hộp thông báo | Thông báo | 📋 suy diễn | [`SCR_26_SPEC.md`](./notification/screen-specification/SCR_26_SPEC.md) |
| `SCR_27` | Cấu hình thông báo | Thông báo | 📋 suy diễn | [`SCR_27_SPEC.md`](./notification/screen-specification/SCR_27_SPEC.md) |
| `SCR_03` | Danh sách và hồ sơ bên tham gia | Quản lý bên tham gia và tư cách giao dịch | ✅ mã nguồn | [`SCR_03_SPEC.md`](./party-management/screen-specification/SCR_03_SPEC.md) |
| `SCR_04` | Bảng theo dõi hiệu lực tư cách | Quản lý bên tham gia và tư cách giao dịch | 📋 suy diễn | [`SCR_04_SPEC.md`](./party-management/screen-specification/SCR_04_SPEC.md) |
| `SCR_24` | Cổng tra cứu chỉ-đọc cho bên ngoài | Quản lý bên tham gia và tư cách giao dịch | 📋 suy diễn | [`SCR_24_SPEC.md`](./party-management/screen-specification/SCR_24_SPEC.md) |
| `SCR_23` | Trung tâm báo cáo | Báo cáo và xuất dữ liệu | 📋 suy diễn | [`SCR_23_SPEC.md`](./reporting/screen-specification/SCR_23_SPEC.md) |
| `SCR_21` | Quản lý phiên bản biểu suất | Quản lý quy định và biểu suất | 📋 suy diễn | [`SCR_21_SPEC.md`](./rule-management/screen-specification/SCR_21_SPEC.md) |
| `SCR_22` | Nhật ký phiên bản quy định | Quản lý quy định và biểu suất | 📋 suy diễn | [`SCR_22_SPEC.md`](./rule-management/screen-specification/SCR_22_SPEC.md) |
| `SCR_14` | Bảng đối soát ngày | Đối soát, chốt sổ và điều chỉnh | ✅ mã nguồn | [`SCR_14_SPEC.md`](./settlement/screen-specification/SCR_14_SPEC.md) |
| `SCR_15` | Khoá ngày nghiệp vụ | Đối soát, chốt sổ và điều chỉnh | ✅ mã nguồn | [`SCR_15_SPEC.md`](./settlement/screen-specification/SCR_15_SPEC.md) |
| `SCR_16` | Tạo yêu cầu điều chỉnh sau chốt | Đối soát, chốt sổ và điều chỉnh | 📋 suy diễn | [`SCR_16_SPEC.md`](./settlement/screen-specification/SCR_16_SPEC.md) |
| `SCR_17` | Phê duyệt điều chỉnh | Đối soát, chốt sổ và điều chỉnh | 📋 suy diễn | [`SCR_17_SPEC.md`](./settlement/screen-specification/SCR_17_SPEC.md) |
| `SCR_18` | Quản lý tranh chấp | Đối soát, chốt sổ và điều chỉnh | 📋 suy diễn | [`SCR_18_SPEC.md`](./settlement/screen-specification/SCR_18_SPEC.md) |
| `SCR_07` | Chốt giao dịch thỏa thuận | Giao dịch thỏa thuận và đấu giá | ✅ mã nguồn | [`SCR_07_SPEC.md`](./trading/screen-specification/SCR_07_SPEC.md) |
| `SCR_08` | Danh sách và huỷ giao dịch | Giao dịch thỏa thuận và đấu giá | ✅ mã nguồn | [`SCR_08_SPEC.md`](./trading/screen-specification/SCR_08_SPEC.md) |
| `SCR_09` | Ghi kết quả đấu giá | Giao dịch thỏa thuận và đấu giá | ✅ mã nguồn | [`SCR_09_SPEC.md`](./trading/screen-specification/SCR_09_SPEC.md) |
| `SCR_10` | Lịch sử sửa kết quả đấu giá | Giao dịch thỏa thuận và đấu giá | 📋 suy diễn | [`SCR_10_SPEC.md`](./trading/screen-specification/SCR_10_SPEC.md) |

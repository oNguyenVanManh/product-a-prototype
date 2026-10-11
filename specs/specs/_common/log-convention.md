# Log convention

| Mục | Quy ước |
|---|---|
| Bảng | `audit_log` |
| Khi nào ghi | Mọi thao tác nhạy cảm: đăng nhập, bật/tắt tài khoản, chốt giao dịch, đảo giao dịch, khoá/mở sổ, tính thưởng, thẩm định |
| Trường | `actor_id` · `action` · `entity` · `entity_id` · `detail` (JSONB) · `created_at` |
| Nguyên tắc | Lỗi ghi log **bị nuốt có chủ đích** — nhật ký hỏng không được chặn nghiệp vụ |

**Mã `action` đang dùng**

| Mã | Khi nào |
|---|---|
| `LOGIN` | Đăng nhập thành công |
| `ENABLE_USER` / `DISABLE_USER` | Bật/tắt tài khoản |
| `CREATE_LOT` | Tiếp nhận lô |
| `INSPECT_LOT` | Ghi kết quả thẩm định |
| `CREATE_TRADE` | Chốt giao dịch |
| `REVERSE_TRADE` | Huỷ bằng dòng đảo, `detail` chứa lý do |
| `CREATE_DELIVERY` | Ghi lần giao hàng |
| `LOCK_SETTLEMENT_DAY` / `UNLOCK_SETTLEMENT_DAY` | Khoá/mở ngày |
| `CALC_INCENTIVE` | Tính thưởng, `detail` chứa `rate_version_no` đã dùng |

> ⚠️ Bảng `audit_log` hiện **chưa** chặn UPDATE/DELETE như bảng `trade`. Người có quyền ghi database
> xoá được dấu vết của chính mình. Nợ kỹ thuật **N-05**, ưu tiên 1 ở LAB-5.

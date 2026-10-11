---
id: FUNC-AUD
title: Đặc tả function module audit
type: function
module_id: AUD
feature: audit
version: "0.1.0"
updated_by: nguyen-van-manh-c
updated: 2026-10-11
related: []
---

# AUD — Function Specifications

> Biểu mẫu: **BM-2-901-54 v1.1** — Function Specifications · SUN ASTERISK VIETNAM CO., LTD · ISO/IEC 27001:2013 & ISO 9001:2015

---

## 1. Lịch sử sửa đổi

| No | Version | Action | Nội dung thay đổi | Ngày | Người sửa |
|---|---|---|---|---|---|
| 1 | 0.1.0 | Add New | Trích từ `src/lib/supabase.ts` của prototype LAB-3 | 2026-10-11 | nguyen-van-manh-c |

---

## 2. Đặc tả function

### 2.1. `audit`

| Mục | Giá trị |
|---|---|
| Return type | `Promise<void>` |
| Function name | `audit` |

| Argument type | Argument name | Role of the argument |
|---|---|---|
| `string|null` | `actorId` | Người thực hiện |
| `string` | `action` | Mã thao tác |
| `string` | `entity` | Bảng chịu tác động |
| `string?` | `entityId` | Khoá chính |
| `object?` | `detail` | Chi tiết dạng JSON |

**Function description**

Ghi nhật ký thao tác nhạy cảm. **Nuốt lỗi có chủ đích** — nhật ký hỏng không được chặn nghiệp vụ. ⚠️ Bảng `audit_log` hiện chưa chặn UPDATE/DELETE, xem nợ kỹ thuật N-05.

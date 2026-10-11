---
id: FUNC-LOT
title: Đặc tả function module lot-intake
type: function
module_id: LOT
feature: lot-intake
version: "0.1.0"
updated_by: nguyen-van-manh-c
updated: 2026-10-11
related: []
---

# LOT — Function Specifications

> Biểu mẫu: **BM-2-901-54 v1.1** — Function Specifications · SUN ASTERISK VIETNAM CO., LTD · ISO/IEC 27001:2013 & ISO 9001:2015

---

## 1. Lịch sử sửa đổi

| No | Version | Action | Nội dung thay đổi | Ngày | Người sửa |
|---|---|---|---|---|---|
| 1 | 0.1.0 | Add New | Trích từ `src/app/api/lots/route.ts · lots/inspect/route.ts` của prototype LAB-3 | 2026-10-11 | nguyen-van-manh-c |

---

## 2. Đặc tả function

### 2.1. `POST /api/lots`

| Mục | Giá trị |
|---|---|
| Return type | `NextResponse` |
| Function name | `POST /api/lots` |

| Argument type | Argument name | Role of the argument |
|---|---|---|
| `Request` | `req` | Body: wholesaler_id, species, quantity_kg |

**Function description**

Tiếp nhận lô mới. Sinh `lot_code` theo số thứ tự trong ngày. Chặn nếu ngày đã khoá sổ.

### 2.2. `POST /api/lots/inspect`

| Mục | Giá trị |
|---|---|
| Return type | `NextResponse` |
| Function name | `POST /api/lots/inspect` |

| Argument type | Argument name | Role of the argument |
|---|---|---|
| `Request` | `req` | Body: lot_id, grade, note |

**Function description**

Ghi kết quả thẩm định. Hạng do **người** chọn trong A/B/C; hàm cố tình không có bất kỳ phép tính nào suy ra hạng — SCOPE-OUT-01 cấm tự động chấm chất lượng.

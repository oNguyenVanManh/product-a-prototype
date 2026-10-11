---
id: FUNC-DLV
title: Đặc tả function module delivery
type: function
module_id: DLV
feature: delivery
version: "0.1.0"
updated_by: nguyen-van-manh-c
updated: 2026-10-11
related: []
---

# DLV — Function Specifications

> Biểu mẫu: **BM-2-901-54 v1.1** — Function Specifications · SUN ASTERISK VIETNAM CO., LTD · ISO/IEC 27001:2013 & ISO 9001:2015

---

## 1. Lịch sử sửa đổi

| No | Version | Action | Nội dung thay đổi | Ngày | Người sửa |
|---|---|---|---|---|---|
| 1 | 0.1.0 | Add New | Trích từ `src/app/api/deliveries/route.ts` của prototype LAB-3 | 2026-10-11 | nguyen-van-manh-c |

---

## 2. Đặc tả function

### 2.1. `POST /api/deliveries`

| Mục | Giá trị |
|---|---|
| Return type | `NextResponse` |
| Function name | `POST /api/deliveries` |

| Argument type | Argument name | Role of the argument |
|---|---|---|
| `Request` | `req` | Body: trade_id, delivered_kg, status, exception_reason |

**Function description**

Ghi một lần giao hàng. Trigger `delivery_quantity_check` cộng dồn các lần giao, trừ dòng đảo, và chặn khi vượt hợp đồng hoặc khi ngày đã khoá. Lỗi trả 409 kèm ba con số: đã giao / lần này / hợp đồng.

---
id: FUNC-TRD
title: Đặc tả function module trading
type: function
module_id: TRD
feature: trading
version: "0.1.0"
updated_by: nguyen-van-manh-c
updated: 2026-10-11
related: []
---

# TRD — Function Specifications

> Biểu mẫu: **BM-2-901-54 v1.1** — Function Specifications · SUN ASTERISK VIETNAM CO., LTD · ISO/IEC 27001:2013 & ISO 9001:2015

---

## 1. Lịch sử sửa đổi

| No | Version | Action | Nội dung thay đổi | Ngày | Người sửa |
|---|---|---|---|---|---|
| 1 | 0.1.0 | Add New | Trích từ `src/app/api/trades/route.ts · trades/reverse/route.ts` của prototype LAB-3 | 2026-10-11 | nguyen-van-manh-c |

---

## 2. Đặc tả function

### 2.1. `POST /api/trades`

| Mục | Giá trị |
|---|---|
| Return type | `NextResponse` |
| Function name | `POST /api/trades` |

| Argument type | Argument name | Role of the argument |
|---|---|---|
| `Request` | `req` | Body: lot_id, buyer_id, quantity_kg, unit_price, kind, hand_sign |

**Function description**

Chốt giao dịch. Kiểm khối lượng còn lại của lô ở tầng API, nhưng ba ràng buộc nghiệp vụ (ngày đã khoá, tư cách bên mua, không sửa được sau khi ghi) do **trigger ở database** thi hành. Thông điệp lỗi trả nguyên văn.

### 2.2. `POST /api/trades/reverse`

| Mục | Giá trị |
|---|---|
| Return type | `NextResponse` |
| Function name | `POST /api/trades/reverse` |

| Argument type | Argument name | Role of the argument |
|---|---|---|
| `Request` | `req` | Body: trade_id, reason |

**Function description**

Huỷ giao dịch bằng cách **thêm dòng đảo**, không sửa dòng gốc. Chặn đảo một dòng đã là dòng đảo, và chặn đảo hai lần cùng một dòng (hiện kiểm ở tầng API, chưa có ràng buộc UNIQUE — xem R-06). Trả khối lượng về cho lô.

---
id: DB-DELIVERY
title: Lần giao hàng
type: database
table: delivery
feature: delivery
version: "0.1.0"
updated_by: nguyen-van-manh-c
updated: 2026-10-11
related: []
---

# DELIVERY — Lần giao hàng (`delivery`)

> Biểu mẫu: **BM-2-901-50 v1.1** — Database Design · SUN ASTERISK VIETNAM CO., LTD · ISO/IEC 27001:2013 & ISO 9001:2015

---

## 1. Lịch sử sửa đổi

| No | Version | Action | Nội dung thay đổi | Ngày | Người sửa |
|---|---|---|---|---|---|
| 1 | 0.1.0 | Add New | Trích từ `supabase/01_schema.sql` của prototype LAB-3 | 2026-10-11 | nguyen-van-manh-c |

---

## 2. Thông tin bảng

| Mục | Giá trị |
|---|---|
| System Name | Hệ thống hỗ trợ vận hành chợ bán buôn thủy sản |
| Schema | `public` |
| Logical table name | Lần giao hàng |
| Physics table name | `delivery` |
| CHARACTER SET | UTF-8 |
| Overview | Lần giao hàng |

---

## 3. Định nghĩa cột

| No. | Key | Logical name | Physic name | Data Type | Not Null | Default | Ghi chú |
|---|---|---|---|---|---|---|---|
| 1 | PK | id | `id` | `uuid` | ✓ | `gen_random_uuid()` |  |
| 2 | FK | trade_id | `trade_id` | `uuid` | ✓ |  | → `trade.id` |
| 3 |  | delivered_kg | `delivered_kg` | `numeric(10,2)` | ✓ |  |  |
| 4 |  | status | `status` | `delivery_status` | ✓ | `'pending'` |  |
| 5 |  | exception_reason | `exception_reason` | `text` |  |  |  |
| 6 |  | delivered_at | `delivered_at` | `timestamptz` | ✓ | `now()` |  |
| 7 | FK | created_by | `created_by` | `uuid` |  |  | → `app_user.id` |

---

## 4. Ràng buộc và ghi chú

Trigger `delivery_quantity_check` cộng dồn các lần giao, trừ dòng đảo, và chặn khi vượt khối lượng hợp đồng hoặc khi ngày đã khoá sổ.

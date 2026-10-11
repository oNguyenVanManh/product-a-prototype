---
id: DB-TRADE
title: Giao dịch
type: database
table: trade
feature: trading
version: "0.1.0"
updated_by: nguyen-van-manh-c
updated: 2026-10-11
related: []
---

# TRADE — Giao dịch (`trade`)

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
| Logical table name | Giao dịch |
| Physics table name | `trade` |
| CHARACTER SET | UTF-8 |
| Overview | Giao dịch |

---

## 3. Định nghĩa cột

| No. | Key | Logical name | Physic name | Data Type | Not Null | Default | Ghi chú |
|---|---|---|---|---|---|---|---|
| 1 | PK | id | `id` | `uuid` | ✓ | `gen_random_uuid()` |  |
| 2 | UK | trade_code | `trade_code` | `text` | ✓ |  |  |
| 3 |  | business_day | `business_day` | `date` | ✓ |  |  |
| 4 |  | kind | `kind` | `trade_kind` | ✓ |  |  |
| 5 | FK | lot_id | `lot_id` | `uuid` | ✓ |  | → `lot.id` |
| 6 | FK | seller_id | `seller_id` | `uuid` | ✓ |  | → `party.id` |
| 7 | FK | buyer_id | `buyer_id` | `uuid` | ✓ |  | → `party.id` |
| 8 |  | quantity_kg | `quantity_kg` | `numeric(10,2)` | ✓ |  |  |
| 9 |  | unit_price | `unit_price` | `numeric(10,2)` | ✓ |  |  |
| 10 |  | amount | `amount` | `numeric(12,2)` | ✓ |  |  |
| 11 |  | hand_sign | `hand_sign` | `text` |  |  |  |
| 12 | FK | reverses_id | `reverses_id` | `uuid` |  |  | → `trade.id` |
| 13 | FK | created_by | `created_by` | `uuid` |  |  | → `app_user.id` |
| 14 |  | created_at | `created_at` | `timestamptz` | ✓ | `now()` |  |

---

## 4. Ràng buộc và ghi chú

**Sổ ghi-thêm.** Trigger `trade_no_update` và `trade_no_delete` chặn mọi lệnh UPDATE/DELETE ở tầng database. Sửa giao dịch = thêm dòng mới có `reverses_id` trỏ về dòng gốc, `quantity_kg` và `amount` mang dấu âm. Xem [ADR-001](../../../../_extra/decisions/ADR-001-so-ghi-them.md).

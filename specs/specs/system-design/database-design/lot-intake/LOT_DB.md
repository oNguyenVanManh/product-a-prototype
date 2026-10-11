---
id: DB-LOT
title: Lô hàng
type: database
table: lot
feature: lot-intake
version: "0.1.0"
updated_by: nguyen-van-manh-c
updated: 2026-10-11
related: []
---

# LOT — Lô hàng (`lot`)

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
| Logical table name | Lô hàng |
| Physics table name | `lot` |
| CHARACTER SET | UTF-8 |
| Overview | Lô hàng |

---

## 3. Định nghĩa cột

| No. | Key | Logical name | Physic name | Data Type | Not Null | Default | Ghi chú |
|---|---|---|---|---|---|---|---|
| 1 | PK | id | `id` | `uuid` | ✓ | `gen_random_uuid()` |  |
| 2 | UK | lot_code | `lot_code` | `text` | ✓ |  |  |
| 3 |  | business_day | `business_day` | `date` | ✓ |  |  |
| 4 |  | species | `species` | `text` | ✓ |  |  |
| 5 |  | quantity_kg | `quantity_kg` | `numeric(10,2)` | ✓ |  | CHECK quantity_kg > 0 |
| 6 |  | remaining_kg | `remaining_kg` | `numeric(10,2)` | ✓ |  |  |
| 7 | FK | wholesaler_id | `wholesaler_id` | `uuid` | ✓ |  | → `party.id` |
| 8 |  | status | `status` | `lot_status` | ✓ | `'received'` |  |
| 9 |  | received_at | `received_at` | `timestamptz` | ✓ | `now()` |  |
| 10 | FK | created_by | `created_by` | `uuid` |  |  | → `app_user.id` |

---

## 4. Ràng buộc và ghi chú

Không có ràng buộc nghiệp vụ đặc biệt ngoài khoá ngoại và CHECK đã nêu ở mục 3.

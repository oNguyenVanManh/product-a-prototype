---
id: DB-SETTLEMENT_DAY
title: Ngày nghiệp vụ
type: database
table: settlement_day
feature: settlement
version: "0.1.0"
updated_by: nguyen-van-manh-c
updated: 2026-10-11
related: []
---

# SETTLEMENT_DAY — Ngày nghiệp vụ (`settlement_day`)

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
| Logical table name | Ngày nghiệp vụ |
| Physics table name | `settlement_day` |
| CHARACTER SET | UTF-8 |
| Overview | Ngày nghiệp vụ |

---

## 3. Định nghĩa cột

| No. | Key | Logical name | Physic name | Data Type | Not Null | Default | Ghi chú |
|---|---|---|---|---|---|---|---|
| 1 | PK | business_day | `business_day` | `date` | ✓ |  |  |
| 2 |  | is_locked | `is_locked` | `boolean` | ✓ | `false` |  |
| 3 |  | locked_at | `locked_at` | `timestamptz` |  |  |  |
| 4 | FK | locked_by | `locked_by` | `uuid` |  |  | → `app_user.id` |

---

## 4. Ràng buộc và ghi chú

Hàm `day_is_locked()` được trigger `trade_check` và `delivery_quantity_check` gọi để chặn ghi vào ngày đã chốt sổ.

---
id: DB-AUDIT_LOG
title: Nhật ký kiểm toán
type: database
table: audit_log
feature: audit
version: "0.1.0"
updated_by: nguyen-van-manh-c
updated: 2026-10-11
related: []
---

# AUDIT_LOG — Nhật ký kiểm toán (`audit_log`)

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
| Logical table name | Nhật ký kiểm toán |
| Physics table name | `audit_log` |
| CHARACTER SET | UTF-8 |
| Overview | Nhật ký kiểm toán |

---

## 3. Định nghĩa cột

| No. | Key | Logical name | Physic name | Data Type | Not Null | Default | Ghi chú |
|---|---|---|---|---|---|---|---|
| 1 | PK | id | `id` | `bigserial` | ✓ |  |  |
| 2 | FK | actor_id | `actor_id` | `uuid` |  |  | → `app_user.id` |
| 3 |  | action | `action` | `text` | ✓ |  |  |
| 4 |  | entity | `entity` | `text` | ✓ |  |  |
| 5 |  | entity_id | `entity_id` | `text` |  |  |  |
| 6 |  | detail | `detail` | `jsonb` |  |  |  |
| 7 |  | created_at | `created_at` | `timestamptz` | ✓ | `now()` |  |

---

## 4. Ràng buộc và ghi chú

⚠️ Hiện **chưa** chặn UPDATE/DELETE như bảng `trade` — nợ kỹ thuật N-05, ưu tiên 1 ở LAB-5.

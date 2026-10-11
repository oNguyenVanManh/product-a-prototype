---
id: DB-APP_USER
title: Người dùng nội bộ
type: database
table: app_user
feature: authentication
version: "0.1.0"
updated_by: nguyen-van-manh-c
updated: 2026-10-11
related: []
---

# APP_USER — Người dùng nội bộ (`app_user`)

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
| Logical table name | Người dùng nội bộ |
| Physics table name | `app_user` |
| CHARACTER SET | UTF-8 |
| Overview | Người dùng nội bộ |

---

## 3. Định nghĩa cột

| No. | Key | Logical name | Physic name | Data Type | Not Null | Default | Ghi chú |
|---|---|---|---|---|---|---|---|
| 1 | PK | id | `id` | `uuid` | ✓ | `gen_random_uuid()` |  |
| 2 | UK | email | `email` | `text` | ✓ |  |  |
| 3 |  | full_name | `full_name` | `text` | ✓ |  |  |
| 4 |  | role | `role` | `text` | ✓ |  |  |
| 5 |  | is_active | `is_active` | `boolean` | ✓ | `true` |  |
| 6 |  | created_at | `created_at` | `timestamptz` | ✓ | `now()` |  |

---

## 4. Ràng buộc và ghi chú

Không có ràng buộc nghiệp vụ đặc biệt ngoài khoá ngoại và CHECK đã nêu ở mục 3.

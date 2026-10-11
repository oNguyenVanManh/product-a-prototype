---
id: DB-INCENTIVE
title: Kết quả tính thưởng
type: database
table: incentive
feature: incentive
version: "0.1.0"
updated_by: nguyen-van-manh-c
updated: 2026-10-11
related: []
---

# INCENTIVE — Kết quả tính thưởng (`incentive`)

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
| Logical table name | Kết quả tính thưởng |
| Physics table name | `incentive` |
| CHARACTER SET | UTF-8 |
| Overview | Kết quả tính thưởng |

---

## 3. Định nghĩa cột

| No. | Key | Logical name | Physic name | Data Type | Not Null | Default | Ghi chú |
|---|---|---|---|---|---|---|---|
| 1 | PK | id | `id` | `uuid` | ✓ | `gen_random_uuid()` |  |
| 2 | FK | party_id | `party_id` | `uuid` | ✓ |  | → `party.id` |
| 3 |  | business_day | `business_day` | `date` | ✓ |  |  |
| 4 |  | base_amount | `base_amount` | `numeric(12,2)` | ✓ |  |  |
| 5 |  | rate_version_no | `rate_version_no` | `int` | ✓ |  |  |
| 6 |  | rate_pct | `rate_pct` | `numeric(5,2)` | ✓ |  |  |
| 7 |  | incentive_amt | `incentive_amt` | `numeric(12,2)` | ✓ |  |  |
| 8 |  | on_time | `on_time` | `boolean` | ✓ |  |  |
| 9 |  | calculated_at | `calculated_at` | `timestamptz` | ✓ | `now()` |  |
| 10 |  | unique | `unique` | `(party_id, business_day)` |  |  |  |

---

## 4. Ràng buộc và ghi chú

Không có ràng buộc nghiệp vụ đặc biệt ngoài khoá ngoại và CHECK đã nêu ở mục 3.

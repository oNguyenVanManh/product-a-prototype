---
id: DB-RATE_VERSION
title: Phiên bản biểu suất
type: database
table: rate_version
feature: rule-management
version: "0.1.0"
updated_by: nguyen-van-manh-c
updated: 2026-10-11
related: []
---

# RATE_VERSION — Phiên bản biểu suất (`rate_version`)

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
| Logical table name | Phiên bản biểu suất |
| Physics table name | `rate_version` |
| CHARACTER SET | UTF-8 |
| Overview | Phiên bản biểu suất |

---

## 3. Định nghĩa cột

| No. | Key | Logical name | Physic name | Data Type | Not Null | Default | Ghi chú |
|---|---|---|---|---|---|---|---|
| 1 | PK | id | `id` | `uuid` | ✓ | `gen_random_uuid()` |  |
| 2 | UK | version_no | `version_no` | `int` | ✓ |  |  |
| 3 |  | effective_from | `effective_from` | `date` | ✓ |  |  |
| 4 |  | rate_pct | `rate_pct` | `numeric(5,2)` | ✓ |  |  |
| 5 |  | tax_factor | `tax_factor` | `numeric(6,4)` | ✓ | `1.1000,` |  |
| 6 | FK | approved_by | `approved_by` | `uuid` |  |  | → `app_user.id` |
| 7 |  | created_at | `created_at` | `timestamptz` | ✓ | `now()` |  |

---

## 4. Ràng buộc và ghi chú

**Chỉ một trục thời gian.** Hàm `rate_as_of(ngày)` lấy phiên bản có `effective_from <= ngày`, không lấy bản mới nhất. Thiếu trục `recorded_at` nên chưa trả lời được câu hỏi hồi tố — xem nợ kỹ thuật N-03.

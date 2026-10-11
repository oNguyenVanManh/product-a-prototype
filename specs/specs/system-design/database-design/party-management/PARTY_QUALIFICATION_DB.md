---
id: DB-PARTY_QUALIFICATION
title: Tư cách giao dịch
type: database
table: party_qualification
feature: party-management
version: "0.1.0"
updated_by: nguyen-van-manh-c
updated: 2026-10-11
related: []
---

# PARTY_QUALIFICATION — Tư cách giao dịch (`party_qualification`)

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
| Logical table name | Tư cách giao dịch |
| Physics table name | `party_qualification` |
| CHARACTER SET | UTF-8 |
| Overview | Tư cách giao dịch |

---

## 3. Định nghĩa cột

| No. | Key | Logical name | Physic name | Data Type | Not Null | Default | Ghi chú |
|---|---|---|---|---|---|---|---|
| 1 | PK | id | `id` | `uuid` | ✓ | `gen_random_uuid()` |  |
| 2 | FK | party_id | `party_id` | `uuid` | ✓ |  | → `party.id` |
| 3 |  | kind | `kind` | `qualification_ty` | ✓ |  |  |
| 4 |  | cert_no | `cert_no` | `text` | ✓ |  |  |
| 5 |  | valid_from | `valid_from` | `date` | ✓ |  |  |
| 6 |  | valid_to | `valid_to` | `date` | ✓ |  |  |
| 7 |  | suspended | `suspended` | `boolean` | ✓ | `false` |  |
| 8 |  | created_at | `created_at` | `timestamptz` | ✓ | `now()` |  |

---

## 4. Ràng buộc và ghi chú

**Hai cấp pháp lý.** Trigger `qualification_kind_check` buộc `permit` (許可) chỉ cấp cho `intermediate` (仲卸) và `approval` (承認) chỉ cấp cho `participant` (売買参加者). 買出人 không có dòng nào ở bảng này. Xem [ADR-006](../../../../_extra/decisions/ADR-006-hai-cap-phap-ly.md).

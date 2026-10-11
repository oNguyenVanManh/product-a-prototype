# BM-2-901-50 — Database Design

    

Biểu mẫu Markdown Database Design (BM-2-901-50). Trong repo dự án (copy từ framgia/management_template)
file nằm ở specs/_templates/BM-2-901-50-database-design-template.md. Hướng dẫn cách dùng nằm trong khối comment ở đầu file.

Nội dung file — bấm nút copy ở góc khối code để lấy toàn bộ:

---
id: SPEC-XXX-000
title:
type: system
subtype: database-design
version: "0.1.0"
updated_by:
updated: YYYY-MM-DD
system_name:
schema_name:
character_set:
related: []
---

<!--
  Template Database Design — port từ biểu mẫu ISO BM-2-901-50 v01.
  Nguồn: 02-context-inputs/bm-2-901-50-database-design/

  CÁCH DÙNG
  1. Copy file này thành `{feature}/{DB_ID}_DATABASE.md` (hoặc `_common/` nếu nhiều feature dùng).
  2. Điền từ trên xuống. Mỗi bảng dữ liệu = một khối ở mục 4, lặp lại khối đó.
  3. Ô không có dữ liệu thì để trống; mục không áp dụng ghi "N/A + lý do", không xoá tiêu đề.
  4. Dự án không phải dự án Nhật: xoá phần nhãn tiếng Nhật trong tên cột.
-->

# {{Tên hệ thống}} — Database Design

| | |
|---|---|
| System Name | {{...}} |
| Schema | {{...}} |
| CHARACTER SET | {{utf8mb4}} |
| Updated by | {{...}} |
| Note | {{...}} |

---

## 1. Lịch sử sửa đổi

| No | Version | Action | Sheet / Bảng | Nội dung thay đổi | Ngày | Người sửa | Approve |
|---|---|---|---|---|---|---|---|
| 1 | 0.1.0 | Add new | — | Khởi tạo | YYYY-MM-DD | {{tên}} | |

<!-- Action chỉ nhận 3 giá trị: Add new · Update · Delete.
     `Approve`: để trống = khách hàng chưa duyệt version ở dòng đó. Đã duyệt thì ghi
     `✅ YYYY-MM-DD · [bằng chứng](link)` — ngày KH xác nhận, link comment trên Issue / email KH.
     Chỉ khách hàng phê duyệt; Tech Lead chỉ ghi nhận, nội bộ duyệt PR không điền ô này. Điền qua
     PR, đã điền thì không xoá; không gắn tag khi duyệt — tag chỉ gắn khi release source code. -->

---

## 2. Danh sách bảng

| No | Schema | Category | Tên bảng (logic) | Tên bảng (vật lý) | Mô tả | Note | Status |
|---|---|---|---|---|---|---|---|
| 1 | {{common}} | {{master}} | {{Users}} | [`{{users}}`](#41-users) | {{...}} | | {{Approved}} |
| 2 | | | | | | | |

<!-- - Cột "Tên bảng (vật lý)" phải link tới khối định nghĩa bảng tương ứng ở mục 4.
     - Category chỉ nhận: master · transaction. Thêm giá trị mới thì ghi nghĩa ngay ở đây.
     - Status chỉ nhận: Approved (承認済み — đã chốt) · Decision (provisional) (決定（暫定） —
       chốt tạm) · Modify (変更 — đang sửa) · Undecided (未決 — chưa quyết) · Cancelled
       (廃止 — đã bỏ). Dự án không phải dự án Nhật thì bỏ phần tiếng Nhật. -->

---

## 3. ER Diagram

```mermaid
erDiagram
  {{TABLE_A}} ||--o{ {{TABLE_B}} : "{{khoá}}"

  {{TABLE_A}} {
    {{int}} {{id}} PK
    {{varchar}} {{column}}
  }
  {{TABLE_B}} {
    {{int}} {{id}} PK
    {{int}} {{table_a_id}} FK
  }
```

<!--
  Vẽ bằng Mermaid để git diff đọc được. Sơ đồ quá lớn thì xuất ảnh vào
  ./assets/{{DB_ID}}_ER.png và nhúng bằng đường dẫn tương đối, KÈM bản Mermaid.

  KÝ HIỆU QUAN HỆ (bên trái--bên phải)
    ||--||  1 : 1        ||--o{  1 : n (0 hoặc nhiều)
    ||--|{  1 : n (>=1)  }o--o{  n : n
  Đọc: `A ||--o{ B` = một A có nhiều B; một B thuộc đúng một A.

  VÍ DỤ ĐẦY ĐỦ — copy xuống trên rồi sửa tên, XOÁ phần này khi đã điền xong

  erDiagram
    roles  ||--o{ users        : "id → role_id"
    users  ||--o{ orders       : "id → user_id"
    orders ||--|{ order_items  : "id → order_id"

    roles {
      int id PK
      varchar name "UNIQUE"
    }
    users {
      int id PK
      int role_id FK
      varchar email "UNIQUE"
      timestamp deleted_at "NULL - soft delete"
    }
    orders {
      int id PK
      int user_id FK
      decimal total_amount
      timestamp created_at
    }
    order_items {
      int id PK
      int order_id FK
      int quantity
    }
-->

> Tên bảng và tên cột trong sơ đồ phải **khớp từng ký tự** với mục 4 — lệch tên là sơ đồ nói một đằng, định nghĩa bảng nói một nẻo.

---

## 4. Định nghĩa bảng

<!-- LẶP LẠI TOÀN BỘ KHỐI 4.x DƯỚI ĐÂY CHO MỖI BẢNG. -->

### 4.1. `{{users}}`

| | | | |
|---|---|---|---|
| Tên bảng (logic) | {{users}} | Tạo bởi / ngày | {{tên}} / {{YYYY-MM-DD}} |
| Tên bảng (vật lý) | `{{users}}` | Sửa bởi / ngày | {{tên}} / {{YYYY-MM-DD}} |
| Overview | {{bảng này lưu gì}} | Note | {{...}} |

**Định nghĩa cột**

| No. | Key | Tên logic | Tên vật lý | Data Type | Size | Not Null | Default | Note |
|---|---|---|---|---|---|---|---|---|
| 1 | PRI | {{User ID}} | `{{user_id}}` | {{INT}} | {{N/A}} | Yes | | |
| 2 | | {{...}} | `{{...}}` | {{VARCHAR}} | {{64}} | {{Yes}} | | |

**Index**

| No. | Tên index | Cột | Primary key | Unique | Note |
|---|---|---|---|---|---|
| 1 | `{{idx_users_email}}` | {{email}} | {{No}} | {{Yes}} | |

**Khoá ngoại**

| No. | Tên khoá ngoại | Cột | Bảng đích | Cột đích | Note |
|---|---|---|---|---|---|
| 1 | `{{fk_users_role_id}}` | `{{role_id}}` | `{{roles}}` | `{{id}}` | {{ON DELETE …}} |

<!-- Cột kiểu `*_id` mà không khai khoá ngoại thì phải ghi lý do ở Note — quan hệ chỉ
     tồn tại trong đầu người viết là nguồn của bug. -->
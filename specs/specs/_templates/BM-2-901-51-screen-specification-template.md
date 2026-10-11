# BM-2-901-51 — Screen Specification

    

Biểu mẫu Markdown Screen Specification (BM-2-901-51). Trong repo dự án (copy từ framgia/management_template)
file nằm ở specs/_templates/BM-2-901-51-screen-specification-template.md. Hướng dẫn cách dùng nằm trong khối comment ở đầu file.

Nội dung file — bấm nút copy ở góc khối code để lấy toàn bộ:

---
id: SPEC-XXX-000
title:
type: ui
screen_id: XX_SCREEN
feature:
feature_id:
version: "0.1.0"
updated_by:
updated: YYYY-MM-DD
related: []
---

<!--
  Template Screen Specification — port từ biểu mẫu ISO BM-2-901-51 v2.1.
  Nguồn: 02-context-inputs/bm-2-901-51-screen-specification/

  CÁCH DÙNG
  1. Copy file này thành `{feature}/{SCREEN_ID}_SPEC.md`, điền frontmatter trước.
  2. Mục 1 History of change: xoá dòng mẫu, đánh lại từ `1 · 0.1.0 · Add New · Khởi tạo`.
  3. Điền từ trên xuống. Xoá các khối comment và chữ trong {{...}} khi xong.
  4. Ô không có dữ liệu thì để trống; mục không áp dụng ghi "N/A + lý do", không xoá tiêu đề.
  5. Dự án không phải dự án Nhật: xoá nhãn tiếng Nhật trong tên nhóm ở mục 5.
  6. Biểu mẫu gốc yêu cầu bôi đỏ chỗ sửa — bản Markdown thay bằng Git diff của PR + mục 1.
-->

# {{SCREEN_ID}} — {{Tên màn hình}}

> Biểu mẫu: **BM-2-901-51 v2.1** — Screen Specification · SUN ASTERISK VIETNAM CO., LTD · ISO/IEC 27001:2013 & ISO 9001:2015

---

## 1. History of change

| No | Version | Action | Nội dung thay đổi | Ngày | Người sửa | Approve |
|---|---|---|---|---|---|---|
| 1 | 0.1.0 | Add New | Khởi tạo | YYYY-MM-DD | {{tên}} | |

<!-- `Action`: `Add New` · `Updated`.
     `Approve`: để trống = khách hàng chưa duyệt version ở dòng đó. Đã duyệt thì ghi
     `✅ YYYY-MM-DD · [bằng chứng](link)` — ngày KH xác nhận, link comment trên Issue / email KH.
     Chỉ khách hàng phê duyệt; Tech Lead chỉ ghi nhận, nội bộ duyệt PR không điền ô này. Điền qua
     PR, đã điền thì không xoá; không gắn tag khi duyệt — tag chỉ gắn khi release source code.
     Từ khi có version đã được duyệt (ô `Approve`), mỗi lần sửa bắt buộc thêm một dòng và tăng version theo SemVer
     (MAJOR đổi nghiệp vụ/luồng/đánh số item · MINOR bổ sung không phá vỡ · PATCH sửa chữ).
     Dòng cuối bảng này phải khớp `version` / `updated` ở frontmatter và khớp dòng trong
     `03-specs/_index.md` — ba nơi không được lệch. -->

---

## 2. Layout

**Design:** [{{tên frame}}]({{link tới đúng node}})

![{{SCREEN_ID}} layout](./assets/{{SCREEN_ID}}_layout.png)

![{{SCREEN_ID}} annotated](./assets/{{SCREEN_ID}}_annotated.png)

> - Ảnh thiết kế tạo bằng Figma / Draw.io / Adobe XD. **Không** vẽ màn hình bằng Excel hay Spreadsheet.
> - Ảnh lưu trong `{feature}/assets/`, tên có tiền tố Screen ID, nhúng bằng đường dẫn tương đối.
> - Modal / pop-up / dialog của màn hình này mô tả **ngay trong file này**, không tách file riêng.

---

## 3. Description

*{{Mô tả màn hình: dùng để làm gì, ai dùng, đi tới đâu.}}*

---

## 4. View

**Đánh ID:** section là chữ (`A`, `B`, `C`…), item trong section là số (`1.0`, `2.0`…). Ba bảng dưới đây và mục 5 trỏ tới item bằng `{{section}}-{{số}}` — ví dụ `A-2`.

Ba nhóm cột của biểu mẫu gốc (`Item` · `Validation` · `Data Mapping`) tách thành ba bảng, nối bằng cột `ID`. Mọi item đều có mặt ở 4.1; chỉ item thật sự có ràng buộc mới xuống 4.2, chỉ item thật sự lấy/đẩy dữ liệu mới xuống 4.3.

### 4.1 Danh sách item

*Mọi item trên màn hình đều phải có một dòng ở đây, kể cả item chỉ trang trí — thiếu item thì người review không biết là quên hay cố ý bỏ.*

| ID | Item Name | Item Type | Required | Note |
|---|---|---|---|---|
| **A** | **{{Tên section A}}** | | | |
| 1.0 | {{tên item}} | Image | - | |
| 2.0 | {{tên item}} | Text box | Có | {{placeholder}} |
| **B** | **{{Tên section B}}** | | | |
| 1.0 | {{tên item}} | Label | - | |

> - `Item Type`: `Label` · `Image` · `Text box` · `Button`.
> - `Required`: `Có` · `Không` · `-` (item không nhận nhập liệu).

### 4.2 Validation

*Chỉ item có ràng buộc nhập liệu. Item không có dòng ở đây nghĩa là **không validate** — cố ý bỏ thì ghi một dòng ở mục 6 nói rõ vì sao.*

| ID | Type | Min | Max | Default | Ghi chú |
|---|---|---|---|---|---|
| {{A-2}} | String | 0 | 255 | | {{thông báo lỗi dùng mã nào}} |

### 4.3 Data Mapping

*Chỉ item lấy hoặc đẩy dữ liệu. Màn hình tĩnh hoặc chỉ điều hướng thì để trống cả bảng này.*

| ID | Data Source | API ID | API URL | Key / Param | Ghi chú |
|---|---|---|---|---|---|
| {{A-2}} | API | `{{SER-1}}` | `{{GET /recommend}}` | `{{q}}` | |

> - `Data Source`: `API` · `Cookie` · `Shared Prefs` · `Local DB`.
> - `API ID` / `API URL` tra ở [`_common/api-list.md`](../_common/api-list.md) — **không tự khai API mới trong file spec**.

---

## 5. Event

**Cột `ID`** trỏ tới item ở mục 4 theo dạng `A-3`; Event không gắn item nào thì để `-`.

| ID | Given (Pre-condition) | When (Trigger/Action) | Then (Result) | Note |
|---|---|---|---|---|
| **Initializing Process（初期処理）** | | | | |
| - | - | {{khi mở màn hình}} | {{1. Gọi API …<br>2. Hiển thị …}} | |
| **Standard Process（通常処理）** | | | | |
| {{A-3}} | - | {{tap vào ô tìm kiếm}} | {{1. Hiện nút Cancel<br>2. Hiện bàn phím}} | |
| {{B-1}} | - | {{tap nút …}} | {{chuyển sang màn hình … (Screen ID: XXX)}} | |
| **Error Handling（エラー制御）** | | | | |
| {{B-6}} | {{đang tải dữ liệu}} | {{mất kết nối}} | {{1. Dừng tải<br>2. Hiển thị dialog lỗi M_21}} | |

> - Mã message (`M_01`…) tra ở [`_common/error-codes.md`](../_common/error-codes.md) — **không tự chế mã mới trong file spec**.
> - Event áp dụng cho **mọi màn hình** thì viết một lần ở [`_common/common-spec.md`](../_common/common-spec.md), không lặp lại ở đây.

<!-- Biểu mẫu gốc ghi "Given (Pre-condirion)" — lỗi chính tả của biểu mẫu, bản port viết đúng. -->

---

## 6. Other Notes

*{{Tiền đề, ràng buộc, ghi chú đặc biệt. Viết thành gạch đầu dòng; có ví dụ thì trình bày dạng bảng.}}*
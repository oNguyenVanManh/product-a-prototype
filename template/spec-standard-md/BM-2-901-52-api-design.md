# BM-2-901-52 — API Design

    

Biểu mẫu Markdown API Design (BM-2-901-52). Trong repo dự án (copy từ framgia/management_template)
file nằm ở specs/_templates/BM-2-901-52-api-design-template.md. Hướng dẫn cách dùng nằm trong khối comment ở đầu file.

Nội dung file — bấm nút copy ở góc khối code để lấy toàn bộ:

---
id: SPEC-XXX-000
title:
type: system
subtype: api-design
api_id: API-XXX
endpoint:
method:
media_type: application/json
feature:
screen_id: []
version: "0.1.0"
updated_by:
updated: YYYY-MM-DD
related: []
---

<!--
  Template API Design — port từ sheet `API_Detail_Template` của biểu mẫu ISO BM-2-901-52 v01.
  Nguồn: 02-context-inputs/bm-2-901-52-api-design/

  MỘT FILE = MỘT API. Biểu mẫu gốc ghi rõ "một API = một sheet"; `API_Detail_Template` là
  sheet chính, các sheet còn lại là nội dung dùng chung cho cả hệ thống, KHÔNG chép vào
  file này:
  | Sheet gốc            | Nơi ở trong repo |
  |----------------------|------------------|
  | `History of changes` | mục 1 của CHÍNH file này (mỗi file tự mang lịch sử của mình) |
  | `Common Conventions` | `_common/api-conventions.md` |
  | `Status code`        | `_common/api-conventions.md` |
  | `API List`           | `_common/api-list.md` |
  | `Appendix`           | `_common/api-conventions.md` (Param type · Data type · Action · Member list) |
  Ba mục `_common/` đó CHƯA TỒN TẠI — xem ISS-36. Chưa có thì viết trước rồi mới viết API.

  CÁCH DÙNG
  1. Copy file này thành `{feature}/{API_ID}_API.md`, điền frontmatter trước.
  2. Cấp `API ID` ở `_common/api-list.md` TRƯỚC, rồi mới mở file này — spec màn hình
     (BM-2-901-51 mục 4.3) trỏ tới API bằng chính ID đó.
  3. Mục 1 History of change: xoá dòng mẫu, đánh lại từ `1 · 0.1.0 · Add new · Khởi tạo`.
  4. Điền từ trên xuống. Xoá các khối comment và chữ trong {{...}} khi xong.
  5. Ô không có dữ liệu thì để trống; mục không áp dụng ghi "N/A + lý do", không xoá tiêu đề.
  6. Dự án không phải dự án Nhật: xoá nhãn tiếng Nhật trong tên trường.
  7. KHÔNG dán token, khoá hay mật khẩu thật vào ô ví dụ — kể cả giá trị đã hết hạn. Biểu mẫu
     gốc dán nguyên một chuỗi JWT ~1.500 ký tự vào sheet Sample; đừng lặp lại.

  RANH GIỚI — không chép nội dung qua lại
  | Nội dung                                         | Nơi ở duy nhất |
  |--------------------------------------------------|----------------|
  | Item màn hình, validation hiển thị, thông báo lỗi | BM-2-901-51 |
  | Schema / ERD / migration                          | BM-2-901-50 |
  | Luồng xử lý từng bước bên trong endpoint, log     | BM-2-901-53 |
  | Danh mục API, quy ước chung, status code          | `_common/` (bảng trên) |
  | **Hợp đồng của MỘT endpoint**                     | **file này** |
-->

# {{API_ID}} — {{METHOD}} {{/api/v1/...}}

> Biểu mẫu: **BM-2-901-52 v01** — API Design · SUN ASTERISK VIETNAM CO., LTD · ISO/IEC 27001:2013 & ISO 9001:2015

---

## 1. History of change

| No | Version | Action | Nội dung thay đổi | Ngày | Người sửa | Approve |
|---|---|---|---|---|---|---|
| 1 | 0.1.0 | Add new | Khởi tạo | YYYY-MM-DD | {{tên}} | |

<!-- `Action`: `Add new` · `Updated`.
     `Approve`: để trống = khách hàng chưa duyệt version ở dòng đó. Đã duyệt thì ghi
     `✅ YYYY-MM-DD · [bằng chứng](link)` — ngày KH xác nhận, link comment trên Issue / email KH.
     Chỉ khách hàng phê duyệt; Tech Lead chỉ ghi nhận, nội bộ duyệt PR không điền ô này. Điền qua
     PR, đã điền thì không xoá; không gắn tag khi duyệt — tag chỉ gắn khi release source code.
     Từ khi có version đã được duyệt (ô `Approve`), mỗi lần sửa bắt buộc thêm một dòng và tăng version theo SemVer
     (MAJOR đổi hợp đồng: bỏ/đổi param, đổi kiểu, đổi status code · MINOR thêm param optional
     hoặc thêm ca response · PATCH sửa chữ).
     Dòng cuối bảng này phải khớp `version` / `updated` ở frontmatter và khớp dòng trong
     `03-specs/_index.md` — ba nơi không được lệch.
     Biểu mẫu gốc gom lịch sử của MỌI API vào một sheet `History of changes`; tách file thì
     mỗi file tự mang lịch sử của mình — xem decision-log 2026-09-09.
     Biểu mẫu gốc còn có `Creator` / `Updator` riêng cho từng API — bỏ, vì cột `Ngày` và
     `Người sửa` của bảng này cộng lịch sử Git đã trả lời đủ. -->

---

## 2. 内容 / Description

*{{API này làm gì, ai gọi, gọi lúc nào, trả về cái gì. 2–4 câu.}}*

**Xác thực:** {{Public · Session cookie `sid` · Session cookie + CSRF · Bearer token}}

<!-- Trường `Xác thực` KHÔNG có trong biểu mẫu gốc. Bắt buộc điền: bỏ trống thì theo quy ước
     "mọi param mặc định là bắt buộc", người đọc không biết API công khai hay cần token —
     đúng lỗi của sheet Sample gốc (API login lại đòi sẵn header `Authorization`). -->

---

## 3. Request Params

| No. | Param Type | Key | Data Type | Values | Description | Note |
|---|---|---|---|---|---|---|
| 1 | {{Body Parameters}} | `{{email}}` | {{string}} | `{{example@example.com}}` | {{mô tả param + ràng buộc}} | |
| 2 | {{Body Parameters}} | `{{password}}` | {{string}} | `{{Aa@123456}}` | {{mô tả param + ràng buộc}} | {{`[optional]` nếu không bắt buộc}} |

> - `Param Type`: `Header Parameters` · `Path Parameters` · `Query Parameters` · `Form Parameters` · `Body Parameters` — tra ở [`_common/api-conventions.md`](../_common/api-conventions.md).
> - `Data Type`: `Integer` · `string` · `text` · `boolean` · `file` — tra ở cùng file trên.
> - `Values` chứa **một giá trị ví dụ**, không phải tập giá trị cho phép. Ràng buộc min / max / độ dài / định dạng ghi ở `Description`.
> - **Mọi param mặc định là bắt buộc.** Param không bắt buộc phải ghi `[optional]` ở cột `Note` (quy ước chung số 1).
> - API không nhận param nào thì ghi một dòng `N/A` — không xoá bảng.

<!-- `Body Parameters` KHÔNG có trong `Param type` của biểu mẫu gốc (gốc chỉ có Header / Path /
     Query / Form). Thêm vào vì API JSON không dùng form — chính sheet Sample gốc khai
     `Media type: application/json` nhưng lại đánh `Form Parameters`. Dự án chốt khác thì sửa
     ở `_common/api-conventions.md` rồi sửa ghi chú này. -->

---

## 4. Responses

| No. | Status Code | Description | Example response | Note |
|---|---|---|---|---|
| 1 | {{200}} | {{returns success}} | <pre>{<br>  "{{auth_token}}": "{{&lt;token&gt;}}"<br>}</pre> | {{ý nghĩa từng trường trả về}} |
| 2 | {{400}} | {{Bad request}} | <pre>{<br>  "errors": [<br>    {<br>      "error_code": "{{400}}",<br>      "error_description": "{{Bad request}}",<br>      "error_extra": { "{{param1}}": "{{error message}}" }<br>    }<br>  ]<br>}</pre> | {{mã lỗi tra ở `_common/error-codes.md`}} |
| 3 | {{500}} | {{Internal Server Error}} | <pre>{<br>  "errors": [ … ]<br>}</pre> | |

> - Liệt kê **mọi** ca response API có thể trả — mỗi request chỉ trả một ca (quy ước chung số 0). Biểu mẫu gốc để sẵn 3 dòng; API thật thường nhiều hơn, cứ thêm dòng.
> - Status code lấy trong bảng ở [`_common/api-conventions.md`](../_common/api-conventions.md) — cần mã ngoài bảng thì bổ sung vào file đó trước, **không tự khai ở đây**.
> - **API cần xác thực thì bắt buộc có dòng `401`**; API có kiểm tra quyền thì bắt buộc có dòng `403`.
> - Ví dụ JSON phải **parse được** và phải đúng format lỗi khai ở quy ước chung số 3. Tên trường trong `Note` phải khớp tên trường trong `Example response`.
> - Response có set header (`Set-Cookie`, `Location`…) thì ghi ở cột `Note`.

---

## 5. Other Notes

*{{Tiền đề, ràng buộc, phụ thuộc, ghi chú đặc biệt. Viết thành gạch đầu dòng.}}*

- **Câu hỏi mở / TBD:** {{liệt kê hoặc ghi "không có" — mục này còn bỏ trống thì chưa được gửi khách hàng duyệt / điền ô `Approve`}}
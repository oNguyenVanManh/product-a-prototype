# BM-2-901-54 — Function Specifications

    

Biểu mẫu Markdown Function Specifications (BM-2-901-54). Trong repo dự án (copy từ framgia/management_template)
file nằm ở specs/_templates/BM-2-901-54-function-specifications-template.md. Hướng dẫn cách dùng nằm trong khối comment ở đầu file.

Nội dung file — bấm nút copy ở góc khối code để lấy toàn bộ:

---
id: SPEC-XXX-000
title:
type: system
subtype: function-specifications
version: "0.1.0"
updated_by:
updated: YYYY-MM-DD
feature:
related: []
---

<!--
  Template Function Specifications — port từ biểu mẫu ISO BM-2-901-54 v01.
  Nguồn: 02-context-inputs/bm-2-901-54-function-specifications/

  ĐÂY LÀ BẢN PORT TRUNG THỰC. Giữ đúng bốn khối và tên cột của biểu mẫu gốc.
  KHÔNG tự bổ sung cột hay mục. Nhận xét về điểm hở nằm ở KHỐI COMMENT CUỐI FILE.

  CÂN NHẮC TRƯỚC KHI DÙNG — biểu mẫu này ở TẦNG CODE, không phải tầng spec
  Nó đặc tả chữ ký hàm và **biến cục bộ bên trong hàm**. Đó là thứ đọc code là thấy, và sẽ
  lệch với code ngay lần refactor đầu tiên. Trước khi mở file theo template này, trả lời:
  ai đọc tài liệu này, và ai chịu trách nhiệm cập nhật nó mỗi lần đổi code?
  Việc dự án có dùng biểu mẫu này hay không CHƯA CHỐT — xem ISS-38.

  RANH GIỚI VỚI CÁC TEMPLATE KHÁC — không chép nội dung qua lại
  | Nội dung                                       | Nơi ở duy nhất |
  |------------------------------------------------|----------------|
  | Item màn hình, validation hiển thị             | BM-01 |
  | Kiến trúc, thành phần, phạm vi thay đổi        | BM-02 mục 1–3 |
  | Schema / ERD / migration                       | BM-2-901-50 |
  | Hợp đồng API (endpoint, request, response)     | BM-2-901-52 |
  | **Luồng xử lý theo bước nghiệp vụ + sequence** | **BM-2-901-53 mục 2–3** |
  | **Chữ ký hàm, tham số, biến cục bộ**           | **file này** |
  BM-2-901-53 và biểu mẫu này CÙNG mô tả xử lý bên trong một function, và biểu mẫu gốc của
  cả hai đều lấy `login` làm ví dụ. Ranh giới: BM-2-901-53 mô tả theo **bước nghiệp vụ**
  (Input/Output/Error/Detail), file này theo **chữ ký hàm**. Chồng lấn CHƯA CHỐT — ISS-38.

  CÁCH DÙNG
  1. Copy file này thành `{feature}/{TÊN_MODULE}_FUNCTIONS.md`.
  2. Mục 2 lặp lại khối `2.x` cho mỗi function.
  3. Ô không có dữ liệu thì để trống; mục không áp dụng ghi "N/A + lý do", không xoá tiêu đề.
  4. Dự án không phải dự án Nhật: xoá phần nhãn tiếng Nhật trong tên cột.

  MỘT CHỖ ĐÃ SỬA so với biểu mẫu gốc, vì để nguyên thì không dùng được:
  Khối `Variable` trong bản mẫu gốc CHỈ CÓ DÒNG HEADER, không có dòng trống nào để điền.
  Template này thêm một dòng trống cho khối đó, cho đồng bộ với ba khối còn lại.
  Ngoài ra chỉ thêm cột `承認 / Approve` ở mục 1 (quyết định 2026-10-01, chung cho 6 template).
-->

# {{Tên module}} — Function Specifications

| | |
|---|---|
| Module / file | {{src/controllers/auth.ts}} |
| Ngôn ngữ / framework | {{TypeScript / NestJS}} |

<!-- Hai dòng trên là bổ sung tối thiểu của dự án, KHÔNG có trong biểu mẫu gốc: sheet Sample
     của bản gốc dùng kiểu TypeScript mà không khai ở đâu, nên đọc `Definitions.Carrier`
     không tra được. Dự án muốn trung thực tuyệt đối thì xoá bảng này. -->

---

## 1. Lịch sử sửa đổi

| No | Ver | アクション / Action | 対象シート / Sheet | 変更内容 / Description of changes | 更新日 / Change Date | 更新者 / Editor | 承認 / Approve |
|---|---|---|---|---|---|---|---|
| 1 | Ver 0.1 | Add New | {{Login}} | {{Add Login specification}} | {{YYYY-MM-DD}} | {{tên}} | |
| 2 | | | | | | | |

<!-- Biểu mẫu gốc KHÔNG có sheet `Appendix` nên không có danh mục giá trị cho cột `Action`.
     Hai giá trị đã dùng trong bản gốc: `Add New`. Bộ giá trị chưa đồng bộ giữa các biểu mẫu
     cùng họ (`Add New` vs `Add new`) — xem ISS-34.
     Cột `Sheet` trong biểu mẫu gốc ghi tên FUNCTION (`Login`), không phải tên sheet.
     Cột `承認 / Approve` KHÔNG có trong biểu mẫu gốc — bổ sung theo quyết định 2026-10-01, áp
     cho cả 6 template. Để trống = khách hàng chưa duyệt version ở dòng đó. Đã duyệt thì ghi
     `✅ YYYY-MM-DD · [bằng chứng](link)` — ngày KH xác nhận, link comment trên Issue / email KH.
     Chỉ khách hàng phê duyệt; Tech Lead chỉ ghi nhận, nội bộ duyệt PR không điền ô này. Điền qua
     PR, đã điền thì không xoá; không gắn tag khi duyệt — tag chỉ gắn khi release source code.
     Từ khi có version đã được duyệt (ô `Approve`), mỗi lần sửa BẮT BUỘC thêm dòng ở đây + tăng
     version ([RMP §V](../00-process/requirement-mng-process.md#v-vòng-đời-và-trạng-thái-tài-liệu)). -->

---

## 2. Đặc tả function

<!-- LẶP LẠI TOÀN BỘ KHỐI 2.x DƯỚI ĐÂY CHO MỖI FUNCTION.
     Trong biểu mẫu gốc, mỗi function là một sheet riêng clone từ `Function_Name`. -->

### 2.1. `{{login}}`

| Return type | Function name |
|---|---|
| `{{Promise<ControllerResponse>}}` | `{{login}}` |

| Argument type | Argument name | Role of the argument |
|---|---|---|
| `{{ControllerRequest}}` | `{{request}}` | {{Objects contain information for client request: parameters, path, body, header,...}} |
| | | |

**Function description**

> - {{ClientId is determined by carrier parameter of the request}}
> - {{From clientId returns …}}

| Variable type | Variable name | Role of variables |
|---|---|---|
| `{{Definitions.Carrier}}` | `{{carrier}}` | {{- param carrier of request<br>- using to detect corresponding clientId}} |
| | | |

<!-- - `Function description` phải KHỚP với `Return type`. Sheet Sample của biểu mẫu gốc ghi
       description là "returns the URL of the login page" trong khi `Return type` khai
       `Promise<ControllerResponse>` — trả object, không phải URL.
     - Cột `Role` là VAI TRÒ (biến dùng để làm gì), không phải định nghĩa (biến là gì).
       Bản gốc ghi `clientId` → `Casis Client ID`, tức trả lời "là gì", chưa trả lời "để làm gì".
     - Chỉ liệt kê biến cục bộ có ý nghĩa với người đọc. Biến vòng lặp, biến tạm thì bỏ.
     - Biểu mẫu gốc để mỗi khối một dòng dữ liệu; thêm dòng khi cần. -->

---

<!--
  ĐIỂM HỞ SO VỚI NHU CẦU THỰC TẾ — nhận xét của dự án, KHÔNG phải lỗi của biểu mẫu gốc.
  Dùng khi đối chiếu để chốt bộ template; xem ISS-38. Xoá khối này khi đã chốt.

  Biểu mẫu gốc KHÔNG CÓ Ô để ghi những thứ sau:

  Ở cấp tài liệu
  - Sheet danh mục function. Ba biểu mẫu còn lại trong họ đều có sheet index
    (`Tables List` · `Screen_List` · `API List`). Thiếu ở đây thì không xem được toàn bộ
    function ở một chỗ, không biết đã đặc tả bao nhiêu hàm. Điểm hở đáng xử lý nhất.
  - Sheet `Appendix` — biểu mẫu duy nhất trong họ không có danh mục giá trị, kể cả cho cột
    `Action` mà chính nó dùng.
  - Ngôn ngữ / framework của kiểu dữ liệu (template này đã bổ sung tạm ở bảng đầu file).

  Ở cấp từng function
  - File / module chứa hàm — không nối được tài liệu với code.
  - Phạm vi truy cập (public / private / internal).
  - Exception / lỗi hàm có thể ném. Sheet Sample của bản gốc cũng không nêu ca lỗi nào.
  - Tác dụng phụ (ghi DB, gọi API, ghi log) — đọc chữ ký hàm không biết nó có ghi dữ liệu.
  - Hàm được gọi từ đâu, gọi ra những hàm nào.
  - Unit test tương ứng.
  - Ngày tạo / người tạo / ngày sửa / người sửa. BM-2-901-50 và BM-2-901-52 đều có bốn
    trường này trong sheet đặc tả.
  - `Status` của từng function. Lưu ý: ISS-34 khẳng định biểu mẫu này CÓ cột `Status` —
    KHÔNG ĐÚNG, biểu mẫu không có cột đó. Luận điểm (c) của ISS-34 cần bỏ hoặc thay nguồn.

  → Cần chốt TRƯỚC KHI dùng biểu mẫu này cho dự án thật (ISS-38):
    (1) Dự án có dùng tài liệu mức code không? Nếu Dev đọc code là biết thì tài liệu này
        chỉ tạo thêm việc bảo trì và sẽ lệch code ngay lần refactor đầu.
    (2) Nếu dùng: khi nào dùng BM-2-901-53, khi nào dùng file này, và có bắt buộc cả hai
        cho cùng một function không?
    (3) Nếu dùng: bổ sung sheet danh mục function là việc tối thiểu.
    Ghi quyết định vào decision-log.
-->
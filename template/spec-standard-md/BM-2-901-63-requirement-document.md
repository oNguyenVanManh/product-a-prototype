# BM-2-901-63 — Requirement Document

    

Biểu mẫu Markdown Requirement Document (BM-2-901-63). Trong repo dự án (copy từ framgia/management_template)
file nằm ở requirements/_templates/BM-2-901-63-requirement-document-template.md. Hướng dẫn cách dùng nằm trong khối comment ở đầu file.

Nội dung file — bấm nút copy ở góc khối code để lấy toàn bộ:

---
id: REQ-YYMM-00
title:
type: requirement
project:
project_code:
source:
received_date: YYYY-MM-DD
version: "0.1.0"
updated_by:
updated: YYYY-MM-DD
related: []
---

<!--
  Template Requirement Document — mã biểu mẫu BM-2-901-63 — trả lời câu hỏi WHAT: hệ thống phải làm gì.
  Dựng mới 2026-09-10 từ bản nháp do chủ dự án cung cấp; cấp mã BM-2-901-63 ngày 2026-10-02.

  CÁCH DÙNG
  1. Copy file này thành `01-requirements/{REQ_ID}-{slug}.md`, điền frontmatter trước.
  2. Mục 1 History of change: xoá dòng mẫu, đánh lại từ `1 · 0.1.0 · Add New · Khởi tạo`.
  3. Điền từ trên xuống. Xoá các khối comment và chữ trong {{...}} khi xong.
  4. Mục không áp dụng ghi "N/A + lý do", KHÔNG xoá tiêu đề mục — người đọc cần phân biệt
     "đã cân nhắc, không áp dụng" với "chưa ai viết".
  5. Tài liệu này mô tả WHAT. Cách làm (màn hình, API, schema, luồng xử lý) thuộc `02-specs/`
     — viết vào đây là lẫn hai loại tài liệu và tạo hai nguồn cho cùng một nội dung.

  FRONTMATTER
    id             `REQ-{YYMM}-{số}` — trùng mã tạm đã cấp ở RMP §V.3 Bước 1 nếu có
    source         tài liệu gốc khách hàng gửi (tên file / link), để trống nếu do dự án tự viết
    received_date  ngày nhận tài liệu gốc
    related        link sang các spec ở `02-specs/` được sinh ra từ tài liệu này
-->

# {{REQ_ID}} — {{Tên tài liệu yêu cầu}}

> Requirement Document · **BM-2-901-63**

---

## 1. History of change

| No | Version | Action | Nội dung thay đổi | Ngày | Người sửa | Approve |
|---|---|---|---|---|---|---|
| 1 | 0.1.0 | Add New | Khởi tạo | YYYY-MM-DD | {{tên}} | |

<!-- `Action`: `Add New` · `Updated`.
     `Approve`: để trống = khách hàng chưa duyệt version ở dòng đó. Đã duyệt thì ghi
     `✅ YYYY-MM-DD · [bằng chứng](link)` — ngày KH xác nhận, link comment trên Issue / email KH.
     Chỉ khách hàng phê duyệt; BrSE chỉ ghi nhận, nội bộ duyệt PR không điền ô này. Điền qua PR,
     đã điền thì không xoá; không gắn tag khi duyệt — tag chỉ gắn khi release source code.
     Từ khi có version đã được duyệt (ô `Approve`), mỗi lần sửa bắt buộc thêm một dòng và tăng version theo SemVer
     (MAJOR đổi/huỷ yêu cầu, đổi phạm vi · MINOR bổ sung yêu cầu mới · PATCH sửa chữ).
     Dòng cuối bảng này phải khớp `version` / `updated` ở frontmatter và khớp dòng trong
     `01-requirements/_index.md` — ba nơi không được lệch. -->

---

## 2. Tổng quan

### 2.1 Nguồn tài liệu

| Tài liệu gốc | Bên cung cấp | Ngày nhận | Link / vị trí lưu |
|---|---|---|---|
| {{tên file hoặc "N/A — dự án tự viết"}} | {{khách hàng / PO / bộ phận}} | {{DD/MM/YYYY}} | {{link}} |

<!-- Bắt buộc điền. Nội dung bản Markdown này phải GIỮ NGUYÊN ý của tài liệu gốc; chỗ nào
     dự án tự diễn giải thêm thì đánh dấu rõ, nếu không vài tháng sau không ai phân biệt được
     đâu là yêu cầu của khách hàng, đâu là suy diễn của dự án. -->

### 2.2 Bối cảnh & Mục đích

* {{Bài toán hiện tại hoặc cơ hội kinh doanh.}}
* {{Vì sao cần xây dựng sản phẩm / tính năng này.}}

### 2.3 Phạm vi

**Trong phạm vi (In-Scope)**

* {{Tính năng / luồng nghiệp vụ A}}

**Ngoài phạm vi (Out-of-Scope)**

* {{Tính năng chưa làm ở phiên bản này — ghi cả lý do}}

<!-- Out-of-Scope là mục hay bị bỏ trống nhất và là chỗ sinh tranh cãi phạm vi về sau.
     Ghi cả lý do ("hoãn sang phase 2" khác hẳn "khách hàng đã bỏ"). -->

---

## 3. Đối tượng sử dụng & vai trò

| Vai trò | Mô tả đối tượng | Quyền hạn / Mục tiêu chính |
|---|---|---|
| {{End User}} | {{Khách hàng mua sắm trên app}} | {{Tìm kiếm sản phẩm, đặt hàng, thanh toán}} |
| {{Admin}} | {{Nhân viên vận hành hệ thống}} | {{Quản lý kho, duyệt đơn hàng, xem báo cáo}} |

---

## 4. Yêu cầu chức năng (FR)

> Mã yêu cầu: `FR-{MÔ_ĐUN}-{số thứ tự}` — viết HOA, số thứ tự 3 chữ số.

### 4.1 Mô-đun {{Authentication}}

#### FR-{{AUTH}}-001: {{Đăng nhập bằng số điện thoại}}

| | |
|---|---|
| **Mô tả** | {{Hệ thống cho phép người dùng đăng nhập bằng số điện thoại và mã OTP.}} |
| **Tiêu chí chấp nhận** | {{1. Người dùng nhập SĐT hợp lệ (10 chữ số).}}<br>{{2. Hệ thống gửi mã OTP 6 chữ số qua SMS.}}<br>{{3. Nhập đúng OTP → đăng nhập thành công và chuyển hướng về Trang chủ.}}<br>{{4. Mã OTP có hiệu lực trong vòng 120 giây.}} |
| **Độ ưu tiên** | {{High / Medium / Low}} |
| **Vai trò liên quan** | {{End User}} |
| **Spec liên quan** | {{link sang `02-specs/{feature}/...` — để trống khi chưa viết spec}} |

<!-- Lặp lại khối `FR-...` cho mỗi yêu cầu, lặp lại khối `4.x` cho mỗi mô-đun.
     - Tiêu chí chấp nhận nằm trong bảng, đánh số và ngăn nhau bằng `<br>`.
     - Tiêu chí chấp nhận phải KIỂM CHỨNG ĐƯỢC: có ngưỡng số, có kết quả quan sát được.
       "Hệ thống phải thân thiện" không phải tiêu chí chấp nhận.
     - Mã `FR-*` đã cấp thì không tái sử dụng, kể cả khi yêu cầu bị huỷ — đổi trạng thái
       ở mục 7 chứ không xoá khối.
     - `Spec liên quan` là chỗ nối sang `02-specs/`; mục 7 dùng chính cột này để soát độ phủ. -->

---

## 5. Yêu cầu phi chức năng (NFR)

| Mã | Nhóm | Yêu cầu | Ngưỡng số | Cách đo | Chủ sở hữu |
|---|---|---|---|---|---|
| NFR-PERF-01 | Hiệu năng | {{Thời gian phản hồi trang chính}} | {{≤ 2 giây với 1.000 người dùng đồng thời}} | {{k6, đo p95 trên staging}} | {{Tech Lead}} |
| NFR-SEC-01 | Bảo mật | {{Mã hoá thông tin nhạy cảm khi lưu trữ và truyền tải}} | {{TLS 1.2+, mật khẩu băm bcrypt}} | {{Rà soát khi review PR}} | {{Tech Lead}} |
| NFR-AVAIL-01 | Khả dụng | {{Uptime hệ thống}} | {{99.9% / tháng}} | {{Monitoring, báo cáo hàng tháng}} | {{DevOps}} |

<!-- Mỗi NFR phải có ĐỦ ba thứ: ngưỡng số · cách đo · chủ sở hữu.
     "Phải nhanh", "phải an toàn" không tính là NFR vì không nghiệm thu được.
     Nhóm thường dùng: Hiệu năng · Bảo mật · Khả dụng · Tương thích · Tuân thủ pháp lý. -->

---

## 6. Ràng buộc & Giả định

### 6.1 Ràng buộc (Constraints)

| # | Ràng buộc | Nguồn |
|---|---|---|
| C1 | {{Bắt buộc tích hợp cổng thanh toán hiện tại của công ty}} | {{Khách hàng}} |
| C2 | {{Chạy được trên iOS từ v14 và Android từ v10}} | {{Khách hàng}} |

### 6.2 Giả định (Assumptions)

| # | Giả định | Ai xác nhận | Rủi ro nếu sai |
|---|---|---|---|
| A1 | {{SMS Gateway đảm bảo tỉ lệ gửi thành công > 98%}} | {{Nhà cung cấp}} | {{Người dùng không nhận được OTP, không đăng nhập được}} |

<!-- Giả định không ghi "ai xác nhận" và "rủi ro nếu sai" thì không dùng được:
     đến lúc vỡ mới biết là đã từng có người giả định. -->

---

## 7. Đối chiếu yêu cầu → spec

| Mã FR | Trạng thái | Spec đã viết | Ghi chú |
|---|---|---|---|
| FR-{{AUTH}}-001 | {{planned / đang viết / đã có spec / đã huỷ}} | {{link `02-specs/...`}} | |

<!-- Bảng soát ĐỘ PHỦ: mọi mã `FR-*` khai ở mục 4 đều phải có đúng một dòng ở đây.
     Đây là chỗ trả lời "yêu cầu nào của khách hàng chưa được đặc tả" — không có bảng này
     thì phải mở từng file spec ra đếm.
     Yêu cầu bị huỷ: ghi `đã huỷ` + lý do, KHÔNG xoá dòng và không xoá khối `FR-*` ở mục 4. -->

---

## 8. Q&A

| # | Câu hỏi | Câu trả lời | Ai trả lời | Hạn | Trạng thái |
|---|---|---|---|---|---|
| Q1 | {{Câu hỏi còn treo với khách hàng}} | {{Câu trả lời đã nhận — để trống khi còn `open`}} | {{PO / khách hàng}} | {{DD/MM/YYYY}} | {{open / closed}} |

<!-- Không còn dòng `open` thì tài liệu mới được gửi khách hàng duyệt / điền ô `Approve`.
     Câu đã trả lời KHÔNG xoá dòng — chuyển `closed` và điền `Câu trả lời`. Đây là chỗ
     duy nhất giữ lại vì sao yêu cầu được hiểu theo cách này chứ không phải cách khác. -->
---
id: REQ-001
title: Nghiệp vụ giao dịch lõi
type: requirement
version: "0.1.0"
updated_by: nguyen-van-manh-c
updated: 2026-10-11
related: []
---

# REQ-001 — Nghiệp vụ giao dịch lõi

> Biểu mẫu: **BM-2-901-63 v1.0** — Requirement Document · SUN ASTERISK VIETNAM CO., LTD · ISO/IEC 27001:2013 & ISO 9001:2015

---

## 1. History of change

| No | Version | Action | Nội dung thay đổi | Ngày | Người sửa | Approve |
|---|---|---|---|---|---|---|
| 1 | 0.1.0 | Add New | Trích từ function-list và non-functional-list của LAB-1 | 2026-10-11 | nguyen-van-manh-c | |

---

## 2. Tổng quan

### 2.1 Nguồn tài liệu

| Nguồn | Vai trò |
|---|---|
| `docs/specs/product-a-rfp-ja-v1.0-rc7.pdf` | Tài liệu khách hàng, 78 trang — **nguồn gốc duy nhất** |
| `product_a_functions_list.xlsx` (LAB-1) | 63 chức năng suy ra từ RFP |
| `product_a_non_functional_list.xlsx` (LAB-1) | 18 yêu cầu phi chức năng |
| `product_a_estimation_assumptions.xlsx` (LAB-1) | 20 giả định, nền cho `PREMISE.md` |
| `supabase/01_schema.sql` (LAB-3) | Mã nguồn thật, dùng để đối chiếu |

### 2.2 Bối cảnh & Mục đích

Chợ bán buôn thủy sản 桜水産市場 là **chợ sản xuất (産地市場)** quy mô vừa gần cảng cá, thu mua trực tiếp
từ tàu cá. Sau khi Luật chợ bán buôn sửa đổi năm 2020 cho phép mỗi chợ tự ban hành quy tắc vận hành
riêng (業務規程), ban quản lý vừa chốt xong bộ quy tắc của mình và cần hệ thống phản ánh **đúng bộ quy**
**tắc đó**, không phải một hệ thống chợ đấu giá chung chung.

Hiện toàn bộ giao dịch giữa 4 vai trò tham gia chợ được quản lý thủ công bằng điện thoại, fax và sổ ghi tay.

### 2.3 Phạm vi

| Trong phạm vi | Ngoài phạm vi |
|---|---|
| Quản lý bên tham gia và tư cách giao dịch · Xác thực và phân quyền · Tiếp nhận lô và thẩm định · Giao dịch thỏa thuận và đấu giá · Theo dõi giao hàng | Tự động chấm chất lượng thủy sản (SCOPE-OUT-01) |
| | Nhận dạng ký hiệu tay bằng OCR/AI (SCOPE-OUT-02) |

---

## 3. Đối tượng sử dụng & vai trò

### 3.1 Bốn vai trò tham gia chợ — hai cấp pháp lý khác nhau

| Vai trò | Nguyên văn | Tư cách giao dịch | Ghi chú |
|---|---|---|---|
| Đơn vị bán buôn | 卸売業者 | không cần | bên bán |
| Đơn vị trung gian | 仲卸 | **許可** giấy phép, thủ tục xét duyệt nặng | |
| Bên tham gia mua bán | 売買参加者 | **承認** chấp thuận, thủ tục nhẹ hơn | cơ chế ĐỘC LẬP, không phải mức thấp hơn của 許可 |
| Người mua lẻ tại chợ | 買出人 | **không có** | phải mua qua đơn vị trung gian |

> ⚠️ Tài liệu khách mục 02-08 **cấm** coi 許可 và 承認 là cùng một loại quyền.

### 3.2 Sáu vai trò hệ thống

| Mã | Vai trò |
|---|---|
| `ROLE_SYS_ADMIN` | Quản trị hệ thống |
| `ROLE_INTAKE` | Tiếp nhận lô |
| `ROLE_JUDGE` | Thẩm định |
| `ROLE_TRADE` | Chốt giao dịch |
| `ROLE_DELIVERY` | Giao hàng |
| `ROLE_SETTLEMENT` | Đối soát |

---

## 4. Yêu cầu chức năng (FR)

### 4.1 Mô-đun Quản lý bên tham gia và tư cách giao dịch (`FEA-01`)

| Mã | Tên chức năng | Loại | Ưu tiên | Màn hình | Nguồn RFP | Trạng thái |
|---|---|---|---|---|---|---|
| FNC-001 | Tạo và sửa hồ sơ bên tham gia | UI | P0 | SCR-03 | FR-PARTY-01 | ✅ đã làm |
| FNC-002 | Quản lý hiệu lực giấy phép và chấp thuận | Logic | P0 | SCR-03 | FR-PARTY-01, BR-PERM-01 | ✅ đã làm |
| FNC-003 | Kiểm tra tư cách tại thời điểm chốt giao dịch | Logic | P0 | SCR-07 | FR-PARTY-02, BR-PERM-01 | ✅ đã làm |
| FNC-004 | Bảng theo dõi hiệu lực tư cách | UI | P1 | SCR-04 | FR-PARTY-03 | ◐ một phần |
| FNC-005 | Job quét hồ sơ sắp hết hiệu lực | Job | P1 | (nền, không màn hình) | FR-PARTY-03 | ❌ chưa làm |
| FNC-006 | Cổng tra cứu chỉ-đọc cho bên ngoài | UI | P1 | SCR-24 | Suy ra từ FIG-LOAD-01 | ❌ chưa làm |

### 4.2 Mô-đun Xác thực và phân quyền (`FEA-02`)

| Mã | Tên chức năng | Loại | Ưu tiên | Màn hình | Nguồn RFP | Trạng thái |
|---|---|---|---|---|---|---|
| FNC-007 | Đăng nhập và gán vai trò | Auth | P0 | SCR-01 | FR-IAM-01 | ✅ đã làm |
| FNC-008 | Xác thực đa yếu tố cho quản trị | Auth | P0 | SCR-01 | NFR-SEC-01 | ❌ chưa làm |
| FNC-009 | Quản lý phiên và hết hạn phiên | Auth | P0 | (nền, không màn hình) | NFR-SEC-03 | ◐ một phần |
| FNC-010 | Khoá tạm khi sai nhiều lần và ghi log bất thường | Auth | P0 | (nền, không màn hình) | NFR-SEC-03 | ❌ chưa làm |
| FNC-011 | Quản lý tài khoản và quyền | UI | P0 | SCR-02 | FR-IAM-02 | ✅ đã làm |
| FNC-012 | Kiểm tra quyền theo vai trò ở mọi thao tác | Logic | P0 | (nền, không màn hình) | FR-IAM-02, BR-CLOSE-01 | ◐ một phần |
| FNC-013 | Job dọn phiên hết hạn | Job | P1 | (nền, không màn hình) | NFR-SEC-03 | ❌ chưa làm |

### 4.3 Mô-đun Tiếp nhận lô và thẩm định (`FEA-03`)

| Mã | Tên chức năng | Loại | Ưu tiên | Màn hình | Nguồn RFP | Trạng thái |
|---|---|---|---|---|---|---|
| FNC-014 | Tiếp nhận lô hàng | UI | P0 | SCR-05 | FR-LOT-01 | ✅ đã làm |
| FNC-015 | Ghi kết quả thẩm định bằng mắt | UI | P0 | SCR-06 | FR-LOT-02, CAP-HUMAN-01 | ✅ đã làm |
| FNC-016 | Kiểm tra và trừ số lượng khả dụng | Logic | P0 | (nền, không màn hình) | FR-LOT-03, BR-LOT-02 | ✅ đã làm |
| FNC-017 | Điều chỉnh thuộc tính lô có kiểm soát | UI | P1 | SCR-05 | FR-LOT-04 | ❌ chưa làm |

### 4.4 Mô-đun Giao dịch thỏa thuận và đấu giá (`FEA-04`)

| Mã | Tên chức năng | Loại | Ưu tiên | Màn hình | Nguồn RFP | Trạng thái |
|---|---|---|---|---|---|---|
| FNC-018 | Tạo và chốt giao dịch thỏa thuận | UI | P0 | SCR-07 | FR-AITAI-01 | ✅ đã làm |
| FNC-019 | Từ chối chốt khi không đủ điều kiện | Logic | P0 | SCR-07 | FR-AITAI-02 | ✅ đã làm |
| FNC-020 | Huỷ giao dịch trước khi khoá | UI | P1 | SCR-08 | FR-AITAI-03 | ✅ đã làm |
| FNC-021 | Ghi kết quả đấu giá | UI | P0 | SCR-09 | FR-SERI-01/02, SCOPE-OUT-02 | ✅ đã làm |
| FNC-022 | Tra cứu lịch sử sửa kết quả đấu giá | UI | P1 | SCR-10 | FR-SERI-03 | ◐ một phần |

### 4.5 Mô-đun Theo dõi giao hàng (`FEA-05`)

| Mã | Tên chức năng | Loại | Ưu tiên | Màn hình | Nguồn RFP | Trạng thái |
|---|---|---|---|---|---|---|
| FNC-023 | Bảng theo dõi giao hàng | UI | P0 | SCR-11 | FR-DEL-01 | ✅ đã làm |
| FNC-024 | Ghi nhận từng lần giao hàng | UI | P0 | SCR-12 | FR-DEL-05 | ✅ đã làm |
| FNC-025 | Xác nhận hoàn tất giao hàng | Logic | P0 | SCR-12 | FR-DEL-02, BR-DEL-03 | ✅ đã làm |
| FNC-026 | Ghi ngoại lệ giao hàng kèm ảnh chứng cứ | UI | P1 | SCR-13 | FR-DEL-03, DR-IMAGE-01 | ❌ chưa làm |
| FNC-027 | Đối chiếu giao hàng với quyết toán | Logic | P1 | SCR-14 | FR-DEL-04 | ◐ một phần |
| FNC-028 | Job phát hiện giao hàng tồn đọng | Job | P1 | (nền, không màn hình) | FR-NOTIFY-01 | ❌ chưa làm |

---

## 5. Yêu cầu phi chức năng (NFR)

| Mã | Nhóm | Yêu cầu | Chỉ tiêu | Trạng thái |
|---|---|---|---|---|
| NFR-AVL-01 | Khả dụng | Dịch vụ đạt 99,5%/tháng trong khung 02:00-10:00 JST, trừ bảo trì đã th | 99,5%/tháng | ◐ |
| NFR-AVL-02 | Liên tục | Tiếp nhận lô và ghi giao hàng chạy offline trên native, có hàng đợi và | Không mất dữ liệu khi mất kết nối  | ❌ |
| NFR-AVL-03 | Thảm hoạ | Khôi phục trong 4 giờ, mất dữ liệu tối đa 15 phút | RTO ≤ 4h, RPO ≤ 15 phút | ◐ |
| NFR-PERF-01 | Hiệu năng | Tra cứu thông thường p95 không quá 2 giây ở tải thiết kế cơ sở | p95 ≤ 2s | ❌ |
| NFR-PERF-02 | Cao điểm | Xử lý hồ sơ tải FIG-LOAD-01 không làm chậm tác vụ giao dịch lõi | 600 lô + 1.200 giao dịch/ngày, 60  | ❌ |
| NFR-SEC-01 | Bảo mật | Bắt buộc xác thực đa yếu tố cho tài khoản quản trị và vai trò phê duyệ | 100% tài khoản quản trị | ❌ |
| NFR-SEC-03 | Bảo mật | Phiên có hết hạn, khoá tạm khi sai nhiều lần, ghi log hành vi bất thườ | Theo cấu hình đã duyệt | ◐ |
| NFR-SEC-04 | Bảo vệ dữ liệu | Dữ liệu truyền dùng TLS; sao lưu và khoá bí mật tách khỏi mã nguồn | 100% kênh truyền | ✅ |
| NFR-PRIV-01 | Thông tin cá nhân | Tuân thủ luật bảo vệ thông tin cá nhân; dữ liệu đặt tại vùng Nhật | Không dữ liệu cá nhân rời vùng Nhậ | ✅ |
| NFR-RET-01 | Lưu trữ | Dữ liệu nghiệp vụ trực tuyến 7 năm; ảnh 3 năm rồi chuyển lưu trữ lạnh | 7 năm / 3 năm | ❌ |
| NFR-OPS-01 | Vận hành | Giám sát tình trạng hệ thống, lỗi batch/xuất dữ liệu, lỗi gửi thông bá | Cảnh báo cho 4 nhóm sự kiện | ❌ |
| NFR-OPS-02 | Bảo trì | Đổi quy định/biểu suất bằng cấu hình, không cần sửa dữ liệu lịch sử | Tối đa 4 phiên bản/năm | ✅ |
| NFR-USE-01 | Khả dụng sử dụng | Nhập lô, chốt giao dịch, ghi giao hàng thao tác được bằng bàn phím | Hoàn tất bằng bàn phím | ◐ |
| NFR-COMP-01 | Tương thích web | Chạy trên 2 trình duyệt evergreen bản mới nhất và tablet ≥10 inch | Ma trận tương thích đã duyệt | ✅ |
| NFR-COMP-02 | Tương thích native | Ứng dụng chạy trên iOS 16+ và Android 12+, cả điện thoại và tablet | Ma trận thiết bị đã duyệt | ❌ |
| NFR-A11Y-01 | Tiếp cận | Đạt WCAG 2.1 mức A cho các luồng nghiệp vụ chính | Mức A | ❌ |
| NFR-BATCH-01 | Batch | Báo cáo ngày hoàn tất trước 11:00 JST | Hoàn tất trước 11:00 JST | ❌ |
| NFR-REL-01 | Phát hành | Ứng dụng phát hành qua App Store và Google Play công khai | Duyệt store thành công | ❌ |

---

## 6. Ràng buộc & Giả định

Xem đầy đủ 20 giả định ở [`../PREMISE.md`](../PREMISE.md). Bốn ràng buộc chi phối thiết kế:

| # | Ràng buộc | Hệ quả thiết kế |
|---|---|---|
| 1 | 相対取引 ~90% / せり ~10% | Một bảng giao dịch chung, không dựng auction engine |
| 2 | Hai cấp pháp lý 許可 / 承認 | Bảng tư cách riêng, trigger buộc đúng cặp vai trò |
| 3 | Sổ không được sửa | Mô hình ghi-thêm, sửa bằng dòng đảo, khoá ngày nghiệp vụ |
| 4 | Quy định đổi theo thời gian | Tra biểu suất theo ngày nghiệp vụ, lưu phiên bản đã dùng |

---

## 7. Đối chiếu yêu cầu → spec

| Mô-đun | Screen Spec | Database | API | Function | Technical |
|---|---|---|---|---|---|
| Quản lý bên tham gia và tư cách giao dịch | 3 | 2 | 1 | 1 | 0 |
| Xác thực và phân quyền | 2 | 1 | 4 | 1 | 0 |
| Tiếp nhận lô và thẩm định | 2 | 2 | 3 | 1 | 1 |
| Giao dịch thỏa thuận và đấu giá | 4 | 1 | 3 | 1 | 2 |
| Theo dõi giao hàng | 3 | 1 | 2 | 1 | 1 |

---

## 8. Q&A

Bốn giả định ảnh hưởng trực tiếp tới thiết kế, khách **chưa trả lời**:

| Mã | Câu hỏi | Ảnh hưởng nếu đáp án khác |
|---|---|---|
| ASM-09 | Nguồn dữ liệu trạng thái thanh toán đúng hạn | Nếu có interface vào: phát sinh 1 interface, đối soát hai chiều |
| ASM-10 | Thứ tự phép tính thưởng và cơ sở áp thuế | Sai thứ tự → không khớp test vector của khách |
| ASM-12 | Ma trận quyền phê duyệt sửa sau chốt | Nhiều cấp → phát sinh workflow engine |
| ASM-15 | Bên ngoài có tài khoản đăng nhập không | Mâu thuẫn nội tại trong RFP, phải hỏi |

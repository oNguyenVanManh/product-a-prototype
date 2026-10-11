---
id: REQ-002
title: Đối soát, chốt sổ và tiền khuyến khích
type: requirement
version: "0.1.0"
updated_by: nguyen-van-manh-c
updated: 2026-10-11
related: []
---

# REQ-002 — Đối soát, chốt sổ và tiền khuyến khích

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
| Đối soát, chốt sổ và điều chỉnh · Tiền khuyến khích thanh toán đúng hạn · Quản lý quy định và biểu suất | Tự động chấm chất lượng thủy sản (SCOPE-OUT-01) |
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

### 4.1 Mô-đun Đối soát, chốt sổ và điều chỉnh (`FEA-06`)

| Mã | Tên chức năng | Loại | Ưu tiên | Màn hình | Nguồn RFP | Trạng thái |
|---|---|---|---|---|---|---|
| FNC-029 | Lập bảng đối soát ngày | Logic | P0 | SCR-14 | FR-SETTLE-01 | ✅ đã làm |
| FNC-030 | Khoá ngày nghiệp vụ | Logic | P0 | SCR-15 | FR-SETTLE-02, BR-CLOSE-01 | ✅ đã làm |
| FNC-031 | Chặn sửa trực tiếp ngày đã khoá | Logic | P0 | (nền, không màn hình) | FR-CORR-03 | ✅ đã làm |
| FNC-032 | Tạo yêu cầu điều chỉnh sau chốt | UI | P0 | SCR-16 | FR-CORR-01 | ❌ chưa làm |
| FNC-033 | Phê duyệt điều chỉnh và sinh bút toán đảo | Logic | P0 | SCR-17 | FR-CORR-02 | ◐ một phần |
| FNC-034 | Quản lý tranh chấp | UI | P1 | SCR-18 | FR-SETTLE-03 | ❌ chưa làm |

### 4.2 Mô-đun Tiền khuyến khích thanh toán đúng hạn (`FEA-07`)

| Mã | Tên chức năng | Loại | Ưu tiên | Màn hình | Nguồn RFP | Trạng thái |
|---|---|---|---|---|---|---|
| FNC-035 | Nhập trạng thái thanh toán | UI | P0 | SCR-19 | Suy ra từ ASIS-06, BR-INC-01 | ❌ chưa làm |
| FNC-036 | Tính tiền khuyến khích | Logic | P0 | SCR-20 | FR-INC-01, BR-INC-01 | ✅ đã làm |
| FNC-037 | Batch tính thưởng cuối kỳ | Batch | P0 | (nền, không màn hình) | FR-INC-01 | ❌ chưa làm |
| FNC-038 | Sinh chênh lệch thưởng kỳ sau | Logic | P0 | (nền, không màn hình) | FR-INC-03 | ❌ chưa làm |
| FNC-039 | Màn hình kết quả tính thưởng | UI | P0 | SCR-20 | FR-AUDIT-03 | ✅ đã làm |

### 4.3 Mô-đun Quản lý quy định và biểu suất (`FEA-08`)

| Mã | Tên chức năng | Loại | Ưu tiên | Màn hình | Nguồn RFP | Trạng thái |
|---|---|---|---|---|---|---|
| FNC-040 | Tạo phiên bản biểu suất có ngày hiệu lực | UI | P0 | SCR-21 | FR-INC-02, GOV-RULE-01 | ❌ chưa làm |
| FNC-041 | Quay lui phiên bản quy định | Logic | P0 | SCR-21 | NFR-OPS-02 | ❌ chưa làm |
| FNC-042 | Tra cứu quy định theo ngày nghiệp vụ | Logic | P0 | (nền, không màn hình) | GOV-RULE-01 | ✅ đã làm |
| FNC-043 | Nhật ký phiên bản quy định | UI | P0 | SCR-22 | FR-RULE-01 | ❌ chưa làm |

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
| Đối soát, chốt sổ và điều chỉnh | 5 | 1 | 2 | 1 | 1 |
| Tiền khuyến khích thanh toán đúng hạn | 2 | 2 | 2 | 1 | 1 |
| Quản lý quy định và biểu suất | 2 | 1 | 0 | 0 | 0 |

---

## 8. Q&A

Bốn giả định ảnh hưởng trực tiếp tới thiết kế, khách **chưa trả lời**:

| Mã | Câu hỏi | Ảnh hưởng nếu đáp án khác |
|---|---|---|
| ASM-09 | Nguồn dữ liệu trạng thái thanh toán đúng hạn | Nếu có interface vào: phát sinh 1 interface, đối soát hai chiều |
| ASM-10 | Thứ tự phép tính thưởng và cơ sở áp thuế | Sai thứ tự → không khớp test vector của khách |
| ASM-12 | Ma trận quyền phê duyệt sửa sau chốt | Nhiều cấp → phát sinh workflow engine |
| ASM-15 | Bên ngoài có tài khoản đăng nhập không | Mâu thuẫn nội tại trong RFP, phải hỏi |

---
id: ADR-003
title: Tra quy định theo ngày nghiệp vụ, không lấy bản mới nhất
type: decision
version: "0.1.0"
updated_by: nguyen-van-manh-c
updated: 2026-10-11
status: đã áp dụng
---

# ADR-003 — Tra quy định theo ngày nghiệp vụ, không lấy bản mới nhất

> ⚠️ **Không có biểu mẫu chuẩn cho ADR.** Bộ spec-standard (QC-01) không quy định loại tài liệu này,
> nên file được viết mới theo yêu cầu LAB-4. Bốn mục dưới đây theo khuôn ADR thông dụng:
> bối cảnh · lựa chọn · phương án đã bỏ · hệ quả.

---
**Bối cảnh.** GOV-RULE-01 cho phép ban quản lý chợ đổi biểu suất thưởng tối đa 4 lần mỗi năm.
Tiền khuyến khích là tiền thật trả cho bên tham gia. Nếu đổi biểu suất hôm nay mà kết quả đã chốt
của tháng trước đổi theo thì không giải trình được khi kiểm toán.

**Lựa chọn.** Hàm `rate_as_of(ngày)` lấy phiên bản có `effective_from <= ngày`, sắp xếp giảm dần,
lấy một bản. Số phiên bản đã dùng lưu vào cột `incentive.rate_version_no` của từng dòng kết quả.

**Phương án đã bỏ.**

| Phương án | Vì sao bỏ |
|---|---|
| Lấy biểu suất mới nhất | Sai nghiệp vụ. Và sai một cách im lặng: mã vẫn chạy, vẫn ra số, không báo lỗi gì |
| Sao chép biểu suất vào từng dòng khi tính | Chống được hồi tố nhưng mất khả năng kiểm chứng ngược — không biết số đó lấy từ phiên bản nào |
| Lưỡng thời gian đầy đủ | Đúng nhất nhưng kéo theo đổi mô hình truy vấn toàn bộ phần tính thưởng. Để lại cho bản production |

**Hệ quả.**

- Tính lại một ngày cũ luôn ra cùng kết quả, bất kể đã đổi biểu suất bao nhiêu lần
- Cột `rate_version_no` cho phép tái lập con số khi bị chất vấn
- **Khuyết còn lại:** chỉ có một trục thời gian. Không trả lời được *"ngày 15/10 ta tưởng biểu
  suất ngày 01/10 là bao nhiêu"*. Nếu khách ban hành quy định có hiệu lực hồi tố, lỗ hổng này
  thành vấn đề thật. Xếp vào nợ kỹ thuật — chi tiết ở [02-database.md](../database-overview.md) mục 4.1

---

---
id: ADR-007
title: Thẩm định độ tươi giữ người trong vòng lặp
type: decision
version: "0.1.0"
updated_by: nguyen-van-manh-c
updated: 2026-10-11
status: đã áp dụng
---

# ADR-007 — Thẩm định độ tươi giữ người trong vòng lặp

> ⚠️ **Không có biểu mẫu chuẩn cho ADR.** Bộ spec-standard (QC-01) không quy định loại tài liệu này,
> nên file được viết mới theo yêu cầu LAB-4. Bốn mục dưới đây theo khuôn ADR thông dụng:
> bối cảnh · lựa chọn · phương án đã bỏ · hệ quả.

---
**Bối cảnh.** CAP-HUMAN-01 liệt kê bốn thao tác buộc phải giữ con người. SCOPE-OUT-01 loại việc
tự động chấm điểm chất lượng ra khỏi phạm vi. Thẩm định độ tươi bằng mắt tại bến là kinh nghiệm
nghề, không phải phép tính.

**Lựa chọn.** Bảng `inspection` chỉ có hạng do người chọn (A/B/C), ghi chú, và tên người thẩm
định. Cố tình **không có** cột điểm do máy tính ra.

**Phương án đã bỏ.**

| Phương án | Vì sao bỏ |
|---|---|
| Thêm cột gợi ý của hệ thống để người xác nhận | Trông vô hại nhưng tạo neo tâm lý. Và mở đường cho "bật chế độ tự động" sau này — đúng thứ SCOPE-OUT-01 cấm |
| Chấm điểm từ ảnh | Ngoài phạm vi, và không ai chịu trách nhiệm khi sai |

**Hệ quả.**

- Luôn truy được ai đã thẩm định lô nào
- Cấu trúc bảng tự nó **ngăn** việc thêm tự động hoá sau này mà không ai để ý — muốn thêm phải sửa
  schema, tức là phải có người duyệt
- Năng suất phụ thuộc người. Đây là lựa chọn của khách, không phải giới hạn kỹ thuật

---

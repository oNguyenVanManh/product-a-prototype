---
id: ADR-006
title: Hai cấp pháp lý tách bảng riêng, có ràng buộc đúng cặp vai trò
type: decision
version: "0.1.0"
updated_by: nguyen-van-manh-c
updated: 2026-10-11
status: đã áp dụng
---

# ADR-006 — Hai cấp pháp lý tách bảng riêng, có ràng buộc đúng cặp vai trò

> ⚠️ **Không có biểu mẫu chuẩn cho ADR.** Bộ spec-standard (QC-01) không quy định loại tài liệu này,
> nên file được viết mới theo yêu cầu LAB-4. Bốn mục dưới đây theo khuôn ADR thông dụng:
> bối cảnh · lựa chọn · phương án đã bỏ · hệ quả.

---
**Bối cảnh.** Mục 02-08 tài liệu khách phân biệt 許可 (giấy phép, cấp cho 仲卸, thủ tục xét duyệt
nặng) và 承認 (chấp thuận, cấp cho 売買参加者, thủ tục nhẹ hơn). Tài liệu cấm đích danh việc coi
hai thứ này là cùng một loại quyền. 買出人 không có tư cách giao dịch trực tiếp, phải mua qua
trung gian.

**Lựa chọn.** Bảng `party_qualification` riêng, kiểu `qualification_ty` hai giá trị, trigger
`qualification_kind_check` buộc đúng cặp vai trò.

**Phương án đã bỏ.**

| Phương án | Vì sao bỏ |
|---|---|
| Cờ `can_trade` trên bảng `party` | Gộp hai cấp thành một — chính điều tài liệu khách cấm |
| Hai cột `permit_no` và `approval_no` trên `party` | Mất lịch sử. Và không kiểm được tư cách "vào ngày nghiệp vụ D" |
| Chỉ tách enum, không ràng buộc | **Đây là cách PoC làm ban đầu** — nhìn như đã tách nhưng database vẫn cho gán 許可 cho một 買出人. Phát hiện ở LAB-4, đã sửa |

**Hệ quả.**

- Kiểm tư cách hỏi được **"vào ngày nghiệp vụ D"**, nên giao dịch hôm qua vẫn hợp lệ dù giấy phép
  hết hạn sáng nay
- Màn hình chốt giao dịch chỉ liệt kê 仲卸 và 売買参加者 trong ô chọn bên mua — hệ quả trực tiếp
  của mô hình, không phải lọc cho gọn
- **Bài học:** tách enum mà không có ràng buộc thi hành thì chỉ là tách trên giấy. Cái bẫy ở đây
  là nó *trông như* đã giải quyết

---

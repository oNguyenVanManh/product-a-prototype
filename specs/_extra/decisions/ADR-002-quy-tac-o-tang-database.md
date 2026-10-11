---
id: ADR-002
title: Quy tắc nghiệp vụ đặt ở tầng database, không ở tầng ứng dụng
type: decision
version: "0.1.0"
updated_by: nguyen-van-manh-c
updated: 2026-10-11
status: đã áp dụng
---

# ADR-002 — Quy tắc nghiệp vụ đặt ở tầng database, không ở tầng ứng dụng

> ⚠️ **Không có biểu mẫu chuẩn cho ADR.** Bộ spec-standard (QC-01) không quy định loại tài liệu này,
> nên file được viết mới theo yêu cầu LAB-4. Bốn mục dưới đây theo khuôn ADR thông dụng:
> bối cảnh · lựa chọn · phương án đã bỏ · hệ quả.

---
**Bối cảnh.** Ba quy tắc lõi — không sửa sổ, không ghi vào ngày đã khoá, bên mua phải còn tư cách
— là lý do hệ thống tồn tại. Nếu chúng chỉ là câu `if` trong API route thì gọi thẳng database,
chạy script sửa dữ liệu, hoặc một API route viết sau quên kiểm đều lách được.

**Lựa chọn.** Thi hành bằng trigger và hàm trong PostgreSQL. Tầng ứng dụng chỉ chuyển tiếp thông
điệp lỗi do trigger ném ra cho người dùng đọc.

**Phương án đã bỏ.**

| Phương án | Vì sao bỏ |
|---|---|
| Kiểm ở tầng service trong mã ứng dụng | Lách được. Và mỗi lần thêm đường ghi mới lại phải nhớ kiểm lại |
| Row Level Security của Supabase | RLS tốt cho phân quyền theo hàng, không diễn đạt được quy tắc "chỉ INSERT, cấm UPDATE" hay "cộng dồn rồi so với hợp đồng" |
| Thủ tục lưu trữ cho mọi thao tác ghi | Dồn quá nhiều logic xuống database, khó kiểm thử và khó đọc |

**Hệ quả.**

- Quy tắc không lách được, kể cả khi thao tác trực tiếp trên database
- Thông điệp lỗi viết bằng tiếng Việt ngay trong SQL, hiện thẳng lên giao diện — người dùng hiểu ngay vì sao bị chặn
- **Đổi lại:** logic nghiệp vụ nằm ở hai nơi. Người đọc mã TypeScript không thấy được quy tắc. Bắt buộc phải có tài liệu này
- Kiểm thử quy tắc cần database thật, không mock được
- Chuyển sang database khác sẽ phải viết lại phần trigger

---

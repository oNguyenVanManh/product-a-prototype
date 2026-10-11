---
id: ADR-001
title: Sổ giao dịch ghi-thêm, sửa bằng dòng đảo
type: decision
version: "0.1.0"
updated_by: nguyen-van-manh-c
updated: 2026-10-11
status: đã áp dụng
---

# ADR-001 — Sổ giao dịch ghi-thêm, sửa bằng dòng đảo

> ⚠️ **Không có biểu mẫu chuẩn cho ADR.** Bộ spec-standard (QC-01) không quy định loại tài liệu này,
> nên file được viết mới theo yêu cầu LAB-4. Bốn mục dưới đây theo khuôn ADR thông dụng:
> bối cảnh · lựa chọn · phương án đã bỏ · hệ quả.

---
**Bối cảnh.** Tài liệu khách yêu cầu dữ liệu đã chốt phải giải trình được khi kiểm toán
(FR-CORR-02), và dữ liệu sau khi khoá sổ không được sửa trực tiếp (BR-CLOSE-01). Chợ vừa tự ban
hành quy tắc vận hành riêng sau sửa đổi luật 2020, nên khả năng bị soi lại là có thật. Đồng thời
nghiệp vụ chợ có sai sót hàng ngày — nhập nhầm khối lượng, nhầm bên mua — nên phải sửa được.

**Lựa chọn.** Bảng `trade` chỉ cho INSERT. Huỷ hoặc sửa một giao dịch = thêm dòng mới có
`reverses_id` trỏ về dòng gốc, `quantity_kg` và `amount` mang dấu âm. Dòng gốc không bao giờ đổi.

**Phương án đã bỏ.**

| Phương án | Vì sao bỏ |
|---|---|
| Cột `is_cancelled` + UPDATE | Mất thông tin ai huỷ lúc nào vì sao. Và một khi đã cho UPDATE thì không có gì ngăn sửa tiếp các cột khác |
| Bảng lịch sử riêng `trade_history` | Phải đồng bộ hai bảng bằng trigger. Truy vấn tổng tiền phải hợp nhất hai nguồn, dễ lệch |
| Event sourcing đầy đủ | Đúng về lý thuyết nhưng nặng quá mức cho quy mô 1.200 giao dịch/ngày. Mọi truy vấn đơn giản đều phải dựng lại trạng thái |

**Hệ quả.**

- Tổng tiền một ngày là `SUM(amount)` — cộng cả số âm nên ra số ròng đúng, không cần mệnh đề loại trừ
- Mọi truy vấn **đếm số giao dịch** phải nhớ lọc `reverses_id IS NULL`, nếu không sẽ đếm cả dòng đảo. Đây là cái bẫy cho người mới, phải ghi rõ trong tài liệu dev
- Bảng `trade` lớn nhanh hơn. Ở tải thiết kế, sau 7 năm vượt 3 triệu dòng — cần phân mảnh theo năm
- Một dòng gốc chỉ được đảo một lần. Hiện kiểm ở tầng API, **chưa có ràng buộc UNIQUE** (xem [02-database.md](../database-overview.md) mục R-06)

---

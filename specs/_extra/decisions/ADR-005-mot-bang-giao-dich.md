---
id: ADR-005
title: Một bảng giao dịch cho cả 相対取引 và せり
type: decision
version: "0.1.0"
updated_by: nguyen-van-manh-c
updated: 2026-10-11
status: đã áp dụng
---

# ADR-005 — Một bảng giao dịch cho cả 相対取引 và せり

> ⚠️ **Không có biểu mẫu chuẩn cho ADR.** Bộ spec-standard (QC-01) không quy định loại tài liệu này,
> nên file được viết mới theo yêu cầu LAB-4. Bốn mục dưới đây theo khuôn ADR thông dụng:
> bối cảnh · lựa chọn · phương án đã bỏ · hệ quả.

---
**Bối cảnh.** Tên gọi "chợ đấu giá" làm người ngoài tưởng phiên đấu giá là nghiệp vụ chính. Thực
tế thỏa thuận trực tiếp chiếm khoảng 90% giá trị. Cả hai đều là giao dịch có hiệu lực pháp lý như
nhau, cùng chịu quy tắc khoá sổ, cùng vào bảng đối soát, cùng tính thưởng.

**Lựa chọn.** Một bảng `trade`, cột `kind` phân biệt hai loại. Cột `hand_sign` chỉ có nghĩa với
dòng đấu giá, để null với dòng thỏa thuận.

**Phương án đã bỏ.**

| Phương án | Vì sao bỏ |
|---|---|
| Hai bảng `negotiated_trade` và `auction_trade` | Mọi báo cáo, phép đối soát, quy tắc khoá sổ phải viết hai lần. Tỷ trọng 90/10 không tính được bằng một truy vấn |
| Bảng chung + bảng mở rộng cho đấu giá | Đúng về chuẩn hoá nhưng thêm một phép nối cho đúng một cột |
| Dựng "auction engine" làm trung tâm | Chính là cái bẫy của đề. Làm vậy là bỏ sót 90% giá trị thật |

**Hệ quả.**

- Tỷ trọng tính được bằng một truy vấn, hiển thị ngay màn hình đầu
- Mọi quy tắc viết một lần, áp cho cả hai luồng
- **Đổi lại:** một cột thưa (`hand_sign` null với 90% số dòng). Chấp nhận được
- Nếu sau này đấu giá phát sinh nhiều thuộc tính riêng (thời điểm bắt đầu phiên, người điều khiển,
  giá khởi điểm), sẽ phải xem lại quyết định này

---

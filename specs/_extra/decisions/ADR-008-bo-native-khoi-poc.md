---
id: ADR-008
title: Bỏ ứng dụng native khỏi phạm vi PoC
type: decision
version: "0.1.0"
updated_by: nguyen-van-manh-c
updated: 2026-10-11
status: đã áp dụng
---

# ADR-008 — Bỏ ứng dụng native khỏi phạm vi PoC

> ⚠️ **Không có biểu mẫu chuẩn cho ADR.** Bộ spec-standard (QC-01) không quy định loại tài liệu này,
> nên file được viết mới theo yêu cầu LAB-4. Bốn mục dưới đây theo khuôn ADR thông dụng:
> bối cảnh · lựa chọn · phương án đã bỏ · hệ quả.

---
**Bối cảnh.** LAB-1 giả định làm cả web và native cho 7 màn hình hiện trường (ASM-02, 67,2 MD
ròng), kèm NFR-COMP-02 (iOS 16+, Android 12+) và NFR-REL-01 (phát hành qua App Store và Google
Play). Nhưng tài liệu khách **không yêu cầu native ở bất kỳ đâu** — NFR-COMP-01 chỉ nói "chạy
trên trình duyệt hiện hành và hỗ trợ tablet". LAB-3 lại ấn định stack web.

**Lựa chọn.** PoC chỉ làm web, các màn hình hiện trường làm responsive để dùng được trên tablet.
Native vẫn giữ trong phạm vi production như một tuỳ chọn cần khách xác nhận.

**Phương án đã bỏ.**

| Phương án | Vì sao bỏ |
|---|---|
| Làm native song song | Ngoài stack LAB-3 ấn định, và tốn 67 MD cho thứ khách chưa yêu cầu |
| Bỏ native hẳn khỏi cả bản production | Chưa đủ căn cứ. NFR-AVL-02 đòi tiếp nhận lô và ghi giao hàng chạy offline — PWA làm được một phần nhưng hàng đợi dài và đồng bộ xung đột thì native vững hơn |
| Dựng PWA có hàng đợi offline ngay ở PoC | Đáng làm nhưng là hạng mục kỹ thuật nặng nhất, không chứng minh thêm gì về nghiệp vụ |

**Hệ quả.**

- Cắt 67,2 MD khỏi phạm vi PoC
- NFR-AVL-02 (chạy offline) **chưa được đáp ứng bằng bất kỳ hình thức nào** — đây là khoảng trống
  thật, không phải chỉ là hoãn
- NFR-COMP-02 và NFR-REL-01 treo cho tới khi khách xác nhận có cần ứng dụng cài đặt hay không
- Câu hỏi này nên đưa vào vòng hỏi đáp với khách trước khi chốt báo giá production

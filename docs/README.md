# Bộ thiết kế LAB-4

Phát triển từ prototype chạy thật của LAB-3 thành bộ thiết kế đầy đủ. Đây là đầu vào trực tiếp
cho việc break task ở LAB-5.

## Bản chính — markdown

| File | Nội dung |
|---|---|
| [01-architecture.md](./01-architecture.md) | Hai kiến trúc (PoC và production), luồng dữ liệu, 4 điểm phân nhánh đặc thù, điểm tích hợp |
| [02-database.md](./02-database.md) | ERD 12 bảng, quy tắc thi hành ở tầng database, đối chiếu mô hình LAB-1, 10 ràng buộc còn thiếu |
| [03-adr.md](./03-adr.md) | 8 quyết định kiến trúc, mỗi cái đủ bối cảnh / lựa chọn / phương án đã bỏ / hệ quả |
| [04-screen-spec.md](./04-screen-spec.md) | 30 màn hình: field, validation, trạng thái, ma trận quyền 30×6 |
| [05-wireframe.md](./05-wireframe.md) | Wireframe hai mức: 9 trang đã code chi tiết, 18 màn chưa code ở mức khối |
| [06-design-vs-code.md](./06-design-vs-code.md) | Đối chiếu 63 chức năng và 18 NFR với mã nguồn — 2 lỗi thật, 9 nợ kỹ thuật, 6 khác có chủ đích |

## Bản xuất — định dạng công ty

| File | Nội dung |
|---|---|
| [export/product_a_architecture.pptx](./export/product_a_architecture.pptx) | 13 slide, 9 sơ đồ đã render từ mermaid |
| [export/product_a_wireframe.pptx](./export/product_a_wireframe.pptx) | 20 slide, 17 wireframe |
| [export/product_a_screen_spec.xlsx](./export/product_a_screen_spec.xlsx) | 5 sheet: danh sách · ma trận quyền · field · validation · trạng thái |
| [export/product_a_adr.xlsx](./export/product_a_adr.xlsx) | 8 ADR dạng bảng tra |
| [export/product_a_design_vs_code.xlsx](./export/product_a_design_vs_code.xlsx) | 5 sheet: tổng hợp · lỗi thật · nợ kỹ thuật · có chủ đích · ưu tiên LAB-5 |

Sơ đồ nguồn ở [img/](./img/) — 9 ảnh PNG render từ mermaid, dùng lại được.

## Đọc theo thứ tự nào

**Muốn hiểu hệ thống:** 01 → 02 → 03.

**Muốn break task ở LAB-5:** 06 (mục 6 có sẵn thứ tự ưu tiên) → 04 (chú ý cột Nguồn) → 02 (mục 5
ràng buộc còn thiếu).

**Muốn code một màn hình:** 04 tìm mã màn → 05 xem bố cục → 02 xem bảng dữ liệu liên quan.

## Một lưu ý về độ tin cậy

Trong [04-screen-spec.md](./04-screen-spec.md), cột **Nguồn** phân biệt hai loại:

- **C** (13 màn) — đối chiếu được với mã nguồn LAB-3, từng field kiểm chứng được
- **S** (17 màn) — suy diễn từ `functions_list` và `userstories` của LAB-1, **chưa có gì xác nhận**

Khi break task ở LAB-5, các màn loại **S** cần khách xác nhận trước khi ước lượng chắc. Riêng
SCR-24 còn vướng mâu thuẫn trong chính tài liệu khách (giả định ASM-15) — đừng code trước khi có
câu trả lời.

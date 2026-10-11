# Bộ thiết kế Product A — LAB-4

Hệ thống hỗ trợ vận hành chợ bán buôn thủy sản 桜水産市場 (産地市場).

Thư mục này là sản phẩm nộp của LAB-4, phát triển từ prototype chạy thật của LAB-3 thành bộ thiết kế
đầy đủ theo **bộ spec-standard của công ty**.

---

## 1. Bộ chuẩn đang bám theo

| Tài liệu | Mã | Nguồn |
|---|---|---|
| Quy chuẩn cấu trúc thư mục spec | **QC-01 v1.1.0** | <https://framgia.github.io/management_template/vi/rmp/quy-chuan-thu-muc-spec-github.html> |
| Requirement Document | **BM-2-901-63** | bộ biểu mẫu RMP |
| Database Design | **BM-2-901-50** | bộ biểu mẫu RMP |
| Screen Specification | **BM-2-901-51** | bộ biểu mẫu RMP |
| API Design | **BM-2-901-52** | bộ biểu mẫu RMP |
| Technical Design | **BM-2-901-53** | bộ biểu mẫu RMP |
| Function Specifications | **BM-2-901-54** | bộ biểu mẫu RMP |

Bản gốc 6 biểu mẫu tải về lưu ở [`../template/spec-standard-md/`](../template/spec-standard-md/),
kèm 3 tài liệu quy trình (QC-01, quy định vận hành RMP, quy trình RMP chi tiết).

---

## 2. Cấu trúc thư mục

```
specs/
├── README.md              ← file này
├── PREMISE.md             ← tiền đề bổ sung sau LAB-1
├── AI-report.md           ← ghi chú làm việc với AI
│
├── requirements/          ← WHAT — hệ thống phải làm gì
│   ├── _index.md
│   ├── _templates/        ← biểu mẫu gốc BM-2-901-63
│   └── REQ-00X-*.md       ← 3 tài liệu yêu cầu
│
├── specs/                 ← HOW — làm thế nào
│   ├── _index.md          ← bảng tra tổng
│   ├── _common/           ← error-codes · api-list · log-convention
│   ├── _templates/        ← 5 biểu mẫu gốc
│   ├── system-design/
│   │   ├── database-design/{feature}/{DB_ID}_DB.md     ← 12 bảng
│   │   └── api-design/{feature}/{API_ID}_API.md        ← 17 endpoint
│   └── {feature}/        ← 13 feature
│       ├── README.md
│       ├── screen-specification/{SCREEN_ID}_SPEC.md + assets/
│       ├── function-specifications/{MODULE_ID}_FUNC.md
│       └── technical-design/{FUNC_ID}_TECH.md
│
└── _extra/                ← PHẦN KHÔNG CÓ TRONG BỘ CHUẨN
    ├── architecture.md
    ├── database-overview.md
    ├── design-vs-code.md
    ├── decisions/ADR-001..008
    └── assets/            ← 9 sơ đồ PNG
```

---

## 3. Kế thừa từ spec-standard vs mới tạo theo đề bài

### 3.1 Kế thừa — dùng đúng biểu mẫu của công ty

| Loại tài liệu | Biểu mẫu | Số file | Mục của biểu mẫu được điền |
|---|---|---|---|
| Requirement Document | `BM-2-901-63` | 3 | đủ 8 mục |
| Screen Specification | `BM-2-901-51` | 30 | đủ 6 mục, gồm 3 bảng ở mục 4 |
| Database Design | `BM-2-901-50` | 12 | đủ 4 mục |
| API Design | `BM-2-901-52` | 17 | đủ 5 mục |
| Function Specifications | `BM-2-901-54` | 8 | đủ 2 mục |
| Technical Design | `BM-2-901-53` | 6 | đủ 5 mục, có sequence diagram |
| **Tổng** | | **74** | |

Cấu trúc thư mục, quy ước đặt tên file (`{SCREEN_ID}_SPEC.md`, `{DB_ID}_DB.md`…), frontmatter,
bảng History of change, `_index.md`, `_common/`, `_templates/` — **toàn bộ theo QC-01**.

### 3.2 Mới tạo — bộ chuẩn KHÔNG có biểu mẫu tương ứng

| File | Vì sao mới | Đề bài LAB-4 đòi |
|---|---|---|
| `_extra/architecture.md` | QC-01 không có biểu mẫu Architecture Design | ✅ *"architecture design (thành phần hệ thống, luồng dữ liệu chính, điểm tích hợp)"* |
| `_extra/decisions/ADR-001..008` | QC-01 không có biểu mẫu ADR | ✅ *"ADR ghi lại quyết định kiến trúc"* |
| `_extra/design-vs-code.md` | QC-01 không có biểu mẫu đối chiếu thiết kế–mã nguồn | ✅ *"phát hiện được chỗ prototype làm khác thiết kế"* |
| `_extra/database-overview.md` | `BM-2-901-50` đặc tả **từng bảng**, không có chỗ cho ERD tổng và danh sách ràng buộc còn thiếu | bổ sung cho mục database diagram |
| `PREMISE.md` | không thuộc bộ chuẩn | ✅ mục (2) của đề bài |
| `AI-report.md` | không thuộc bộ chuẩn | ✅ mục (4) của đề bài |

### 3.3 Hai điểm lệch chuẩn có chủ đích

| Điểm lệch | QC-01 quy định | Ở đây làm gì | Vì sao |
|---|---|---|---|
| Vị trí repo | *"Mỗi dự án có một Management Repository riêng… **Spec không để trong repo code**"* | `specs/` nằm trong repo prototype | Bài tập nộp một lượt; tách repo riêng làm người chấm phải mở hai chỗ. Lúc nộp tách folder ra là được. |
| Thư mục `_extra/` | QC-01 chỉ định nghĩa `requirements/` và `specs/` | thêm `_extra/` cùng cấp | QC-01 cho phép: *"Các nhóm khác… đặt thêm thư mục cùng cấp ở gốc repo… và phải có một dòng trong README.md"* — dòng đó chính là mục 3.2 ở trên. |

---

## 4. Đọc theo thứ tự nào

**Hiểu hệ thống:** `requirements/REQ-001` → `_extra/architecture.md` → `_extra/decisions/`

**Code một màn hình:** `specs/_index.md` tra Screen ID → `{feature}/screen-specification/{ID}_SPEC.md`
→ API ở `_common/api-list.md` → bảng dữ liệu ở `system-design/database-design/`

**Break task ở LAB-5:** `_extra/design-vs-code.md` mục 6 (có sẵn thứ tự ưu tiên) → `specs/_index.md`

---

## 5. Một lưu ý về độ tin cậy

Trong 30 Screen Specification, mục 3 của mỗi file ghi rõ **nguồn đặc tả**:

| Nguồn | Số màn | Nghĩa là |
|---|---|---|
| ✅ mã nguồn LAB-3 | 13 | Từng field, từng ràng buộc đối chiếu được với code đang chạy |
| 📋 suy diễn từ LAB-1 | 17 | Suy ra từ function-list và user-stories, **chưa có gì xác nhận** |

Ảnh ở mục 2 của nhóm 📋 có **viền cam** để phân biệt ngay khi mở file.

Khi break task ở LAB-5, nhóm 📋 cần khách xác nhận trước khi ước lượng chắc. Riêng `SCR_24`
còn vướng mâu thuẫn trong chính tài liệu khách (giả định ASM-15) — đừng code trước khi có câu trả lời.

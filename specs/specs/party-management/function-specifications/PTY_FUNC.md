---
id: FUNC-PTY
title: Đặc tả function module party-management
type: function
module_id: PTY
feature: party-management
version: "0.1.0"
updated_by: nguyen-van-manh-c
updated: 2026-10-11
related: []
---

# PTY — Function Specifications

> Biểu mẫu: **BM-2-901-54 v1.1** — Function Specifications · SUN ASTERISK VIETNAM CO., LTD · ISO/IEC 27001:2013 & ISO 9001:2015

---

## 1. Lịch sử sửa đổi

| No | Version | Action | Nội dung thay đổi | Ngày | Người sửa |
|---|---|---|---|---|---|
| 1 | 0.1.0 | Add New | Trích từ `src/app/api/parties/route.ts` của prototype LAB-3 | 2026-10-11 | nguyen-van-manh-c |

---

## 2. Đặc tả function

### 2.1. `GET /api/parties`

| Mục | Giá trị |
|---|---|
| Return type | `NextResponse` |
| Function name | `GET /api/parties` |

*Không có tham số.*

**Function description**

Trả danh sách bên tham gia kèm tư cách. Hai cấp pháp lý `permit` và `approval` để **riêng** trong bảng `party_qualification`, không gộp thành một cờ.

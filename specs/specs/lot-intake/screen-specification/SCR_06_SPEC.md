---
id: SPEC-03-06
title: Ghi kết quả thẩm định
type: ui
screen_id: SCR_06
feature: Tiếp nhận lô và thẩm định
feature_id: FEA-03
version: "0.1.0"
updated_by: nguyen-van-manh-c
updated: 2026-10-11
related: [`LOT-3`]
---

# SCR_06 — Ghi kết quả thẩm định

> Biểu mẫu: **BM-2-901-51 v2.1** — Screen Specification · SUN ASTERISK VIETNAM CO., LTD · ISO/IEC 27001:2013 & ISO 9001:2015

---

## 1. History of change

| No | Version | Action | Nội dung thay đổi | Ngày | Người sửa | Approve |
|---|---|---|---|---|---|---|
| 1 | 0.1.0 | Add New | Khởi tạo từ bộ thiết kế LAB-4 | 2026-10-11 | nguyen-van-manh-c | |

---

## 2. Layout

**Design:** bản dựng chạy thật tại `/lots` của prototype LAB-3

![SCR_06 layout](./assets/SCR_06_layout.png)

> Ảnh chụp từ prototype đang chạy. Màn hình này **đã code**, nên bố cục dưới đây là bố cục thật,
> không phải phác thảo.

---

## 3. Description

Cấu trúc bảng cố tình không có cột điểm máy tính. Xem ADR-007.

**Nguồn đặc tả:** mã nguồn LAB-3.

**Vai trò truy cập:** Quản trị hệ thống `F` · Tiếp nhận lô `R` · Thẩm định `F` · Chốt giao dịch `R` · Giao hàng `–` · Đối soát `R`

---

## 4. View

### 4.1 Danh sách item

| ID | Item Name | Item Type | Required | Note |
|---|---|---|---|---|
| **A** | **Ghi kết quả thẩm định** | | | |
| 1.0 | lot_id | Text box | Có | Lô chưa có kết quả |
| 2.0 | grade | Text box | Có | NGƯỜI chọn, không có gợi ý máy |
| 3.0 | note | Dropdown | Không |  |
| 4.0 | inspected_by | Label | - | Từ phiên đăng nhập |

### 4.2 Validation

| ID | Type | Min | Max | Default | Ghi chú |
|---|---|---|---|---|---|
| A-1 | String |  | | | bắt buộc; lỗi dùng `M_01` |
| A-2 | String |  | | | bắt buộc; lỗi dùng `M_01` |

### 4.3 Data Mapping

| ID | Data Source | API ID | API URL | Key / Param | Ghi chú |
|---|---|---|---|---|---|
| A-1 | API | `LOT-3` | `POST /api/lots/inspect` | — | tra ở [`_common/api-list.md`](../../_common/api-list.md) |

---

## 5. Event

| ID | Given (Pre-condition) | When (Trigger/Action) | Then (Result) | Note |
|---|---|---|---|---|
| **Initializing Process** | | | | |
| - | đã đăng nhập, phiên hợp lệ | mở màn hình | 1. Gọi `POST /api/lots/inspect`<br>2. Hiển thị danh sách | |
| **Standard Process** | | | | |
| A-1 | - | thao tác trên item | grade chỉ nhận A, B hoặc C — CHECK ở database | |
| A-2 | - | thao tác trên item | KHÔNG có bất kỳ phép tính nào suy ra grade — SCOPE-OUT-01 cấm | |
| **Error Handling** | | | | |
| - | chưa đăng nhập | gọi API | HTTP 401, chuyển về `/login?next=` | `M_40` |

---

## 6. Other Notes

- **Trạng thái:** Chưa thẩm định → đã thẩm định
- grade chỉ nhận A, B hoặc C — CHECK ở database
- KHÔNG có bất kỳ phép tính nào suy ra grade — SCOPE-OUT-01 cấm

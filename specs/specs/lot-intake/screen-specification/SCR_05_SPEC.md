---
id: SPEC-03-05
title: Tiếp nhận lô hàng
type: ui
screen_id: SCR_05
feature: Tiếp nhận lô và thẩm định
feature_id: FEA-03
version: "0.1.0"
updated_by: nguyen-van-manh-c
updated: 2026-10-11
related: [`LOT-1`, `LOT-2`]
---

# SCR_05 — Tiếp nhận lô hàng

> Biểu mẫu: **BM-2-901-51 v2.1** — Screen Specification · SUN ASTERISK VIETNAM CO., LTD · ISO/IEC 27001:2013 & ISO 9001:2015

---

## 1. History of change

| No | Version | Action | Nội dung thay đổi | Ngày | Người sửa | Approve |
|---|---|---|---|---|---|---|
| 1 | 0.1.0 | Add New | Khởi tạo từ bộ thiết kế LAB-4 | 2026-10-11 | nguyen-van-manh-c | |

---

## 2. Layout

**Design:** bản dựng chạy thật tại `/lots` của prototype LAB-3

![SCR_05 layout](./assets/SCR_05_layout.png)

> Ảnh chụp từ prototype đang chạy. Màn hình này **đã code**, nên bố cục dưới đây là bố cục thật,
> không phải phác thảo.

---

## 3. Description

Màn hình hiện trường: dùng được trên tablet. Thiết kế gốc có cả bản native (ADR-008).

**Nguồn đặc tả:** mã nguồn LAB-3.

**Vai trò truy cập:** Quản trị hệ thống `F` · Tiếp nhận lô `F` · Thẩm định `R` · Chốt giao dịch `R` · Giao hàng `R` · Đối soát `R`

---

## 4. View

### 4.1 Danh sách item

| ID | Item Name | Item Type | Required | Note |
|---|---|---|---|---|
| **A** | **Tiếp nhận lô hàng** | | | |
| 1.0 | wholesaler_id | Text box | Có | Chỉ liệt kê 卸売業者 |
| 2.0 | species | Text box | Có | Tên loài thủy sản |
| 3.0 | quantity_kg | Text box | Có | CHECK ở database |
| 4.0 | lot_code | Label | - | LOT-YYYYMMDD-NN |
| 5.0 | business_day | Text box | Không |  |

### 4.2 Validation

| ID | Type | Min | Max | Default | Ghi chú |
|---|---|---|---|---|---|
| A-1 | String |  | | | bắt buộc; lỗi dùng `M_01` |
| A-2 | String |  | | | bắt buộc; lỗi dùng `M_01` |
| A-3 | Number | 0.01 | | | bắt buộc; lỗi dùng `M_01` |

### 4.3 Data Mapping

| ID | Data Source | API ID | API URL | Key / Param | Ghi chú |
|---|---|---|---|---|---|
| A-1 | API | `LOT-1` | `GET /api/lots` | — | tra ở [`_common/api-list.md`](../../_common/api-list.md) |
| A-2 | API | `LOT-2` | `POST /api/lots` | — | tra ở [`_common/api-list.md`](../../_common/api-list.md) |

---

## 5. Event

| ID | Given (Pre-condition) | When (Trigger/Action) | Then (Result) | Note |
|---|---|---|---|---|
| **Initializing Process** | | | | |
| - | đã đăng nhập, phiên hợp lệ | mở màn hình | 1. Gọi `GET /api/lots`<br>2. Hiển thị danh sách | |
| **Standard Process** | | | | |
| A-1 | - | thao tác trên item | quantity_kg phải > 0 — CHECK ở database | |
| A-2 | - | thao tác trên item | Ngày đã khoá sổ thì chặn tiếp nhận, trả 409 kèm lý do | |
| A-3 | - | thao tác trên item | lot_code sinh theo số thứ tự trong ngày, không trùng | |
| **Error Handling** | | | | |
| - | chưa đăng nhập | gọi API | HTTP 401, chuyển về `/login?next=` | `M_40` |
| - | ngày đã khoá sổ | ghi dữ liệu | HTTP 409, trigger database chặn | `M_30` |

---

## 6. Other Notes

- **Trạng thái:** received → inspected → published → traded → delivered
- quantity_kg phải > 0 — CHECK ở database
- Ngày đã khoá sổ thì chặn tiếp nhận, trả 409 kèm lý do
- lot_code sinh theo số thứ tự trong ngày, không trùng

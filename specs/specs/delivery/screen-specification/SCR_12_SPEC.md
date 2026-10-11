---
id: SPEC-05-12
title: Ghi nhận lần giao hàng
type: ui
screen_id: SCR_12
feature: Theo dõi giao hàng
feature_id: FEA-05
version: "0.1.0"
updated_by: nguyen-van-manh-c
updated: 2026-10-11
related: [`DLV-2`]
---

# SCR_12 — Ghi nhận lần giao hàng

> Biểu mẫu: **BM-2-901-51 v2.1** — Screen Specification · SUN ASTERISK VIETNAM CO., LTD · ISO/IEC 27001:2013 & ISO 9001:2015

---

## 1. History of change

| No | Version | Action | Nội dung thay đổi | Ngày | Người sửa | Approve |
|---|---|---|---|---|---|---|
| 1 | 0.1.0 | Add New | Khởi tạo từ bộ thiết kế LAB-4 | 2026-10-11 | nguyen-van-manh-c | |

---

## 2. Layout

**Design:** bản dựng chạy thật tại `/deliveries` của prototype LAB-3

![SCR_12 layout](./assets/SCR_12_layout.png)

> Ảnh chụp từ prototype đang chạy. Màn hình này **đã code**, nên bố cục dưới đây là bố cục thật,
> không phải phác thảo.

---

## 3. Description

Ràng buộc cộng dồn THÊM Ở LAB-4 sau khi phát hiện thiếu — xem L-02.

**Nguồn đặc tả:** mã nguồn LAB-3.

**Vai trò truy cập:** Quản trị hệ thống `F` · Tiếp nhận lô `–` · Thẩm định `–` · Chốt giao dịch `–` · Giao hàng `F` · Đối soát `F`

---

## 4. View

### 4.1 Danh sách item

| ID | Item Name | Item Type | Required | Note |
|---|---|---|---|---|
| **A** | **Ghi nhận lần giao hàng** | | | |
| 1.0 | trade_id | Text box | Có | Loại dòng đảo |
| 2.0 | delivered_kg | Text box | Có |  |
| 3.0 | status | Text box | Có |  |
| 4.0 | exception_reason | Text box | Có |  |

### 4.2 Validation

| ID | Type | Min | Max | Default | Ghi chú |
|---|---|---|---|---|---|
| A-1 | String |  | | | bắt buộc; lỗi dùng `M_01` |
| A-2 | Number | 0.01 | | | bắt buộc; lỗi dùng `M_01` |
| A-3 | String |  | | | bắt buộc; lỗi dùng `M_01` |
| A-4 | String |  | | | bắt buộc; lỗi dùng `M_01` |

### 4.3 Data Mapping

| ID | Data Source | API ID | API URL | Key / Param | Ghi chú |
|---|---|---|---|---|---|
| A-1 | API | `DLV-2` | `POST /api/deliveries` | — | tra ở [`_common/api-list.md`](../../_common/api-list.md) |

---

## 5. Event

| ID | Given (Pre-condition) | When (Trigger/Action) | Then (Result) | Note |
|---|---|---|---|---|
| **Initializing Process** | | | | |
| - | đã đăng nhập, phiên hợp lệ | mở màn hình | 1. Gọi `POST /api/deliveries`<br>2. Hiển thị danh sách | |
| **Standard Process** | | | | |
| A-1 | - | thao tác trên item | Tổng các lần giao KHÔNG vượt khối lượng hợp đồng ròng — trigger delivery_quantity_check | |
| A-2 | - | thao tác trên item | Khối lượng hợp đồng ròng = dòng gốc cộng mọi dòng đảo trỏ về nó | |
| A-3 | - | thao tác trên item | Giao dịch đã bị đảo hết thì không ghi giao hàng được | |
| **Error Handling** | | | | |
| - | chưa đăng nhập | gọi API | HTTP 401, chuyển về `/login?next=` | `M_40` |
| - | ngày đã khoá sổ | ghi dữ liệu | HTTP 409, trigger database chặn | `M_30` |

---

## 6. Other Notes

- **Trạng thái:** Như SCR-11
- Tổng các lần giao KHÔNG vượt khối lượng hợp đồng ròng — trigger delivery_quantity_check
- Khối lượng hợp đồng ròng = dòng gốc cộng mọi dòng đảo trỏ về nó
- Giao dịch đã bị đảo hết thì không ghi giao hàng được
- Ngày đã khoá sổ thì chặn

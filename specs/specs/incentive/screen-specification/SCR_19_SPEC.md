---
id: SPEC-07-19
title: Nhập trạng thái thanh toán
type: ui
screen_id: SCR_19
feature: Tiền khuyến khích thanh toán đúng hạn
feature_id: FEA-07
version: "0.1.0"
updated_by: nguyen-van-manh-c
updated: 2026-10-11
related: []
---

# SCR_19 — Nhập trạng thái thanh toán

> Biểu mẫu: **BM-2-901-51 v2.1** — Screen Specification · SUN ASTERISK VIETNAM CO., LTD · ISO/IEC 27001:2013 & ISO 9001:2015

---

## 1. History of change

| No | Version | Action | Nội dung thay đổi | Ngày | Người sửa | Approve |
|---|---|---|---|---|---|---|
| 1 | 0.1.0 | Add New | Khởi tạo từ bộ thiết kế LAB-4 | 2026-10-11 | nguyen-van-manh-c | |

---

## 2. Layout

**Design:** chưa có — màn hình chưa được dựng ở prototype LAB-3

![SCR_19 wireframe](./assets/SCR_19_wireframe.png)

> ⚠️ Bố cục dưới đây là **phác thảo suy diễn**, chưa đối chiếu được với mã nguồn.
> Cần khách xác nhận trước khi dựng.

---

## 3. Description

Giả định ASM-09: bộ phận đối soát NHẬP TAY, không có interface vào.

**Nguồn đặc tả:** suy diễn từ function-list và user-stories của LAB-1.

**Vai trò truy cập:** Quản trị hệ thống `F` · Tiếp nhận lô `–` · Thẩm định `–` · Chốt giao dịch `–` · Giao hàng `–` · Đối soát `F`

---

## 4. View

### 4.1 Danh sách item

| ID | Item Name | Item Type | Required | Note |
|---|---|---|---|---|
| **A** | **Nhập trạng thái thanh toán** | | | |
| 1.0 | party_id | Text box | Có |  |
| 2.0 | business_day | Text box | Có |  |
| 3.0 | due_date | Label | - | business_day + N ngày, N cấu hình |
| 4.0 | paid_date | Dropdown | Không | null = chưa thanh toán |

### 4.2 Validation

| ID | Type | Min | Max | Default | Ghi chú |
|---|---|---|---|---|---|
| A-1 | String |  | | | bắt buộc; lỗi dùng `M_01` |
| A-2 | Date |  | | | bắt buộc; lỗi dùng `M_01` |

### 4.3 Data Mapping

| ID | Data Source | API ID | API URL | Key / Param | Ghi chú |
|---|---|---|---|---|---|
| – | – | – | – | – | Màn hình chưa có API — chưa dựng ở prototype |

---

## 5. Event

| ID | Given (Pre-condition) | When (Trigger/Action) | Then (Result) | Note |
|---|---|---|---|---|
| **Initializing Process** | | | | |
| - | đã đăng nhập | mở màn hình | Hiển thị màn hình | |
| **Standard Process** | | | | |
| A-1 | - | thao tác trên item | Một bên một ngày chỉ một dòng — UNIQUE (party_id, business_day) | |
| A-2 | - | thao tác trên item | paid_date không được trước business_day (chưa có ràng buộc, xem R-07) | |
| **Error Handling** | | | | |
| - | chưa đăng nhập | gọi API | HTTP 401, chuyển về `/login?next=` | `M_40` |

---

## 6. Other Notes

- **Trạng thái:** Chưa thanh toán → đã thanh toán
- Một bên một ngày chỉ một dòng — UNIQUE (party_id, business_day)
- paid_date không được trước business_day (chưa có ràng buộc, xem R-07)
- ⚠️ Màn hình **chưa dựng** ở prototype LAB-3. Đặc tả suy diễn, cần khách xác nhận.

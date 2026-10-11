---
id: SPEC-01-04
title: Bảng theo dõi hiệu lực tư cách
type: ui
screen_id: SCR_04
feature: Quản lý bên tham gia và tư cách giao dịch
feature_id: FEA-01
version: "0.1.0"
updated_by: nguyen-van-manh-c
updated: 2026-10-11
related: []
---

# SCR_04 — Bảng theo dõi hiệu lực tư cách

> Biểu mẫu: **BM-2-901-51 v2.1** — Screen Specification · SUN ASTERISK VIETNAM CO., LTD · ISO/IEC 27001:2013 & ISO 9001:2015

---

## 1. History of change

| No | Version | Action | Nội dung thay đổi | Ngày | Người sửa | Approve |
|---|---|---|---|---|---|---|
| 1 | 0.1.0 | Add New | Khởi tạo từ bộ thiết kế LAB-4 | 2026-10-11 | nguyen-van-manh-c | |

---

## 2. Layout

**Design:** chưa có — màn hình chưa được dựng ở prototype LAB-3

![SCR_04 wireframe](./assets/SCR_04_wireframe.png)

> ⚠️ Bố cục dưới đây là **phác thảo suy diễn**, chưa đối chiếu được với mã nguồn.
> Cần khách xác nhận trước khi dựng.

---

## 3. Description

Prototype gộp thông tin này vào SCR-03. Tách riêng khi cần theo dõi chủ động hàng ngày.

**Nguồn đặc tả:** suy diễn từ function-list và user-stories của LAB-1.

**Vai trò truy cập:** Quản trị hệ thống `R` · Tiếp nhận lô `–` · Thẩm định `–` · Chốt giao dịch `R` · Giao hàng `–` · Đối soát `F`

---

## 4. View

### 4.1 Danh sách item

| ID | Item Name | Item Type | Required | Note |
|---|---|---|---|---|
| **A** | **Bảng theo dõi hiệu lực tư cách** | | | |
| 1.0 | party.code / name | Label | - |  |
| 2.0 | qualification.valid_to | Label | - | Sắp xếp tăng dần |
| 3.0 | số ngày còn lại | Label | - | valid_to trừ hôm nay |
| 4.0 | đã gửi cảnh báo | Label | - | Do FNC-005 đặt |

### 4.2 Validation

| ID | Type | Min | Max | Default | Ghi chú |
|---|---|---|---|---|---|
| – | – | | | | Màn hình chỉ đọc, không có item nhận nhập liệu |

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
| A-1 | - | thao tác trên item | Mặc định lọc còn ≤ 30 ngày | |
| A-2 | - | thao tác trên item | Cho phép đổi ngưỡng cảnh báo | |
| **Error Handling** | | | | |
| - | chưa đăng nhập | gọi API | HTTP 401, chuyển về `/login?next=` | `M_40` |

---

## 6. Other Notes

- **Trạng thái:** Còn hiệu lực · Sắp hết hạn · Hết hạn
- Mặc định lọc còn ≤ 30 ngày
- Cho phép đổi ngưỡng cảnh báo
- ⚠️ Màn hình **chưa dựng** ở prototype LAB-3. Đặc tả suy diễn, cần khách xác nhận.

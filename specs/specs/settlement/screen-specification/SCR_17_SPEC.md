---
id: SPEC-06-17
title: Phê duyệt điều chỉnh
type: ui
screen_id: SCR_17
feature: Đối soát, chốt sổ và điều chỉnh
feature_id: FEA-06
version: "0.1.0"
updated_by: nguyen-van-manh-c
updated: 2026-10-11
related: []
---

# SCR_17 — Phê duyệt điều chỉnh

> Biểu mẫu: **BM-2-901-51 v2.1** — Screen Specification · SUN ASTERISK VIETNAM CO., LTD · ISO/IEC 27001:2013 & ISO 9001:2015

---

## 1. History of change

| No | Version | Action | Nội dung thay đổi | Ngày | Người sửa | Approve |
|---|---|---|---|---|---|---|
| 1 | 0.1.0 | Add New | Khởi tạo từ bộ thiết kế LAB-4 | 2026-10-11 | nguyen-van-manh-c | |

---

## 2. Layout

**Design:** chưa có — màn hình chưa được dựng ở prototype LAB-3

![SCR_17 wireframe](./assets/SCR_17_wireframe.png)

> ⚠️ Bố cục dưới đây là **phác thảo suy diễn**, chưa đối chiếu được với mã nguồn.
> Cần khách xác nhận trước khi dựng.

---

## 3. Description

Số cấp phê duyệt vẫn là giả định ASM-12, khách chưa xác nhận.

**Nguồn đặc tả:** suy diễn từ function-list và user-stories của LAB-1.

**Vai trò truy cập:** Quản trị hệ thống `F` · Tiếp nhận lô `–` · Thẩm định `–` · Chốt giao dịch `–` · Giao hàng `–` · Đối soát `F`

---

## 4. View

### 4.1 Danh sách item

| ID | Item Name | Item Type | Required | Note |
|---|---|---|---|---|
| **A** | **Phê duyệt điều chỉnh** | | | |
| 1.0 | danh sách yêu cầu chờ duyệt | Label | - |  |
| 2.0 | quyết định | Text box | Có |  |
| 3.0 | ý kiến | Text box | Có |  |

### 4.2 Validation

| ID | Type | Min | Max | Default | Ghi chú |
|---|---|---|---|---|---|
| A-2 | String |  | | | bắt buộc; lỗi dùng `M_01` |
| A-3 | String |  | | | bắt buộc; lỗi dùng `M_01` |

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
| A-1 | - | thao tác trên item | Người duyệt phải khác người đề nghị — chặn ở tầng database | |
| A-2 | - | thao tác trên item | Duyệt xong sinh bút toán đảo tự động, không sửa dòng gốc | |
| **Error Handling** | | | | |
| - | chưa đăng nhập | gọi API | HTTP 401, chuyển về `/login?next=` | `M_40` |

---

## 6. Other Notes

- **Trạng thái:** Chờ duyệt → đã duyệt · bị từ chối
- Người duyệt phải khác người đề nghị — chặn ở tầng database
- Duyệt xong sinh bút toán đảo tự động, không sửa dòng gốc
- ⚠️ Màn hình **chưa dựng** ở prototype LAB-3. Đặc tả suy diễn, cần khách xác nhận.

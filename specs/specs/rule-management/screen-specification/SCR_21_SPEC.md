---
id: SPEC-08-21
title: Quản lý phiên bản biểu suất
type: ui
screen_id: SCR_21
feature: Quản lý quy định và biểu suất
feature_id: FEA-08
version: "0.1.0"
updated_by: nguyen-van-manh-c
updated: 2026-10-11
related: []
---

# SCR_21 — Quản lý phiên bản biểu suất

> Biểu mẫu: **BM-2-901-51 v2.1** — Screen Specification · SUN ASTERISK VIETNAM CO., LTD · ISO/IEC 27001:2013 & ISO 9001:2015

---

## 1. History of change

| No | Version | Action | Nội dung thay đổi | Ngày | Người sửa | Approve |
|---|---|---|---|---|---|---|
| 1 | 0.1.0 | Add New | Khởi tạo từ bộ thiết kế LAB-4 | 2026-10-11 | nguyen-van-manh-c | |

---

## 2. Layout

**Design:** chưa có — màn hình chưa được dựng ở prototype LAB-3

![SCR_21 wireframe](./assets/SCR_21_wireframe.png)

> ⚠️ Bố cục dưới đây là **phác thảo suy diễn**, chưa đối chiếu được với mã nguồn.
> Cần khách xác nhận trước khi dựng.

---

## 3. Description

Thiếu trục thời gian thứ hai (recorded_at) — nợ kỹ thuật N-03.

**Nguồn đặc tả:** suy diễn từ function-list và user-stories của LAB-1.

**Vai trò truy cập:** Quản trị hệ thống `F` · Tiếp nhận lô `–` · Thẩm định `–` · Chốt giao dịch `–` · Giao hàng `–` · Đối soát `R`

---

## 4. View

### 4.1 Danh sách item

| ID | Item Name | Item Type | Required | Note |
|---|---|---|---|---|
| **A** | **Quản lý phiên bản biểu suất** | | | |
| 1.0 | version_no | Label | - | Tăng dần, duy nhất |
| 2.0 | effective_from | Text box | Có | Được phép đặt ngày tương lai |
| 3.0 | rate_pct | Text box | Có |  |
| 4.0 | tax_factor | Text box | Có | Mặc định 1.1000 theo BR-INC-01 |
| 5.0 | approved_by | Text box | Có | Phải khác người tạo |

### 4.2 Validation

| ID | Type | Min | Max | Default | Ghi chú |
|---|---|---|---|---|---|
| A-2 | Date |  | | | bắt buộc; lỗi dùng `M_01` |
| A-3 | Number | 0.01 | | | bắt buộc; lỗi dùng `M_01` |
| A-4 | Number |  | | | bắt buộc; lỗi dùng `M_01` |
| A-5 | String |  | | | bắt buộc; lỗi dùng `M_01` |

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
| A-1 | - | thao tác trên item | Tối đa 4 phiên bản mỗi năm — GOV-RULE-01 | |
| A-2 | - | thao tác trên item | Không hai phiên bản cùng effective_from (chưa có ràng buộc, xem R-08) | |
| A-3 | - | thao tác trên item | Người tạo phải khác người duyệt | |
| **Error Handling** | | | | |
| - | chưa đăng nhập | gọi API | HTTP 401, chuyển về `/login?next=` | `M_40` |

---

## 6. Other Notes

- **Trạng thái:** Nháp → chờ duyệt → có hiệu lực → đã thay thế
- Tối đa 4 phiên bản mỗi năm — GOV-RULE-01
- Không hai phiên bản cùng effective_from (chưa có ràng buộc, xem R-08)
- Người tạo phải khác người duyệt
- Không sửa được phiên bản đã qua ngày hiệu lực
- ⚠️ Màn hình **chưa dựng** ở prototype LAB-3. Đặc tả suy diễn, cần khách xác nhận.

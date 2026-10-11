---
id: SPEC-02-02
title: Quản lý tài khoản và quyền
type: ui
screen_id: SCR_02
feature: Xác thực và phân quyền
feature_id: FEA-02
version: "0.1.0"
updated_by: nguyen-van-manh-c
updated: 2026-10-11
related: [`USR-1`, `USR-2`]
---

# SCR_02 — Quản lý tài khoản và quyền

> Biểu mẫu: **BM-2-901-51 v2.1** — Screen Specification · SUN ASTERISK VIETNAM CO., LTD · ISO/IEC 27001:2013 & ISO 9001:2015

---

## 1. History of change

| No | Version | Action | Nội dung thay đổi | Ngày | Người sửa | Approve |
|---|---|---|---|---|---|---|
| 1 | 0.1.0 | Add New | Khởi tạo từ bộ thiết kế LAB-4 | 2026-10-11 | nguyen-van-manh-c | |

---

## 2. Layout

**Design:** bản dựng chạy thật tại `/users` của prototype LAB-3

![SCR_02 layout](./assets/SCR_02_layout.png)

> Ảnh chụp từ prototype đang chạy. Màn hình này **đã code**, nên bố cục dưới đây là bố cục thật,
> không phải phác thảo.

---

## 3. Description

Mọi lần bật/tắt ghi audit_log action=ENABLE_USER / DISABLE_USER.

**Nguồn đặc tả:** mã nguồn LAB-3.

**Vai trò truy cập:** Quản trị hệ thống `F` · Tiếp nhận lô `R` · Thẩm định `R` · Chốt giao dịch `R` · Giao hàng `R` · Đối soát `R`

---

## 4. View

### 4.1 Danh sách item

| ID | Item Name | Item Type | Required | Note |
|---|---|---|---|---|
| **A** | **Quản lý tài khoản và quyền** | | | |
| 1.0 | email | Label | - | Khoá duy nhất |
| 2.0 | full_name | Label | - |  |
| 3.0 | role | Label | - | Có CHECK ở database |
| 4.0 | is_active | Text box | Không | Nút Bật/Tắt |

### 4.2 Validation

| ID | Type | Min | Max | Default | Ghi chú |
|---|---|---|---|---|---|
| – | – | | | | Màn hình chỉ đọc, không có item nhận nhập liệu |

### 4.3 Data Mapping

| ID | Data Source | API ID | API URL | Key / Param | Ghi chú |
|---|---|---|---|---|---|
| A-1 | API | `USR-1` | `GET /api/users` | — | tra ở [`_common/api-list.md`](../../_common/api-list.md) |
| A-2 | API | `USR-2` | `PATCH /api/users` | — | tra ở [`_common/api-list.md`](../../_common/api-list.md) |

---

## 5. Event

| ID | Given (Pre-condition) | When (Trigger/Action) | Then (Result) | Note |
|---|---|---|---|---|
| **Initializing Process** | | | | |
| - | đã đăng nhập, phiên hợp lệ | mở màn hình | 1. Gọi `GET /api/users`<br>2. Hiển thị danh sách | |
| **Standard Process** | | | | |
| A-1 | - | thao tác trên item | Chỉ ROLE_SYS_ADMIN đổi được is_active, vai trò khác nhận lỗi 403 | |
| A-2 | - | thao tác trên item | Không tự tắt tài khoản của chính mình — trả 409 | |
| **Error Handling** | | | | |
| - | chưa đăng nhập | gọi API | HTTP 401, chuyển về `/login?next=` | `M_40` |
| - | sai vai trò | gọi API | HTTP 403 kèm lý do | `M_41` |

---

## 6. Other Notes

- **Trạng thái:** Đang hoạt động ⇄ Đã tắt
- Chỉ ROLE_SYS_ADMIN đổi được is_active, vai trò khác nhận lỗi 403
- Không tự tắt tài khoản của chính mình — trả 409

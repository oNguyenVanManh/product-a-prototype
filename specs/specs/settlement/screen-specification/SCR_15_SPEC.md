---
id: SPEC-06-15
title: Khoá ngày nghiệp vụ
type: ui
screen_id: SCR_15
feature: Đối soát, chốt sổ và điều chỉnh
feature_id: FEA-06
version: "0.1.0"
updated_by: nguyen-van-manh-c
updated: 2026-10-11
related: [`STL-2`]
---

# SCR_15 — Khoá ngày nghiệp vụ

> Biểu mẫu: **BM-2-901-51 v2.1** — Screen Specification · SUN ASTERISK VIETNAM CO., LTD · ISO/IEC 27001:2013 & ISO 9001:2015

---

## 1. History of change

| No | Version | Action | Nội dung thay đổi | Ngày | Người sửa | Approve |
|---|---|---|---|---|---|---|
| 1 | 0.1.0 | Add New | Khởi tạo từ bộ thiết kế LAB-4 | 2026-10-11 | nguyen-van-manh-c | |

---

## 2. Layout

**Design:** bản dựng chạy thật tại `/settlement` của prototype LAB-3

![SCR_15 layout](./assets/SCR_15_layout.png)

> Ảnh chụp từ prototype đang chạy. Màn hình này **đã code**, nên bố cục dưới đây là bố cục thật,
> không phải phác thảo.

---

## 3. Description

Thi hành ở trigger, không phải ở giao diện. Xem ADR-002.

**Nguồn đặc tả:** mã nguồn LAB-3.

**Vai trò truy cập:** Quản trị hệ thống `F` · Tiếp nhận lô `–` · Thẩm định `–` · Chốt giao dịch `–` · Giao hàng `–` · Đối soát `F`

---

## 4. View

### 4.1 Danh sách item

| ID | Item Name | Item Type | Required | Note |
|---|---|---|---|---|
| **A** | **Khoá ngày nghiệp vụ** | | | |
| 1.0 | business_day | Text box | Có |  |
| 2.0 | lock | Text box | Có | true = khoá, false = mở lại |
| 3.0 | locked_by | Label | - |  |
| 4.0 | locked_at | Label | - |  |

### 4.2 Validation

| ID | Type | Min | Max | Default | Ghi chú |
|---|---|---|---|---|---|
| A-1 | Date |  | | | bắt buộc; lỗi dùng `M_01` |
| A-2 | String |  | | | bắt buộc; lỗi dùng `M_01` |

### 4.3 Data Mapping

| ID | Data Source | API ID | API URL | Key / Param | Ghi chú |
|---|---|---|---|---|---|
| A-1 | API | `STL-2` | `POST /api/settlement/lock` | — | tra ở [`_common/api-list.md`](../../_common/api-list.md) |

---

## 5. Event

| ID | Given (Pre-condition) | When (Trigger/Action) | Then (Result) | Note |
|---|---|---|---|---|
| **Initializing Process** | | | | |
| - | đã đăng nhập, phiên hợp lệ | mở màn hình | 1. Gọi `POST /api/settlement/lock`<br>2. Hiển thị danh sách | |
| **Standard Process** | | | | |
| A-1 | - | thao tác trên item | CHỈ ROLE_SETTLEMENT và ROLE_SYS_ADMIN — vai trò khác nhận 403 | |
| A-2 | - | thao tác trên item | Khoá xong thì trigger chặn mọi INSERT giao dịch và giao hàng vào ngày đó | |
| A-3 | - | thao tác trên item | Mở lại được nhưng ghi audit_log action=UNLOCK_SETTLEMENT_DAY | |
| **Error Handling** | | | | |
| - | chưa đăng nhập | gọi API | HTTP 401, chuyển về `/login?next=` | `M_40` |
| - | sai vai trò | gọi API | HTTP 403 kèm lý do | `M_41` |

---

## 6. Other Notes

- **Trạng thái:** Đang mở ⇄ Đã khoá
- CHỈ ROLE_SETTLEMENT và ROLE_SYS_ADMIN — vai trò khác nhận 403
- Khoá xong thì trigger chặn mọi INSERT giao dịch và giao hàng vào ngày đó
- Mở lại được nhưng ghi audit_log action=UNLOCK_SETTLEMENT_DAY

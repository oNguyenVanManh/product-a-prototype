---
id: SPEC-06-14
title: Bảng đối soát ngày
type: ui
screen_id: SCR_14
feature: Đối soát, chốt sổ và điều chỉnh
feature_id: FEA-06
version: "0.1.0"
updated_by: nguyen-van-manh-c
updated: 2026-10-11
related: [`STL-1`]
---

# SCR_14 — Bảng đối soát ngày

> Biểu mẫu: **BM-2-901-51 v2.1** — Screen Specification · SUN ASTERISK VIETNAM CO., LTD · ISO/IEC 27001:2013 & ISO 9001:2015

---

## 1. History of change

| No | Version | Action | Nội dung thay đổi | Ngày | Người sửa | Approve |
|---|---|---|---|---|---|---|
| 1 | 0.1.0 | Add New | Khởi tạo từ bộ thiết kế LAB-4 | 2026-10-11 | nguyen-van-manh-c | |

---

## 2. Layout

**Design:** bản dựng chạy thật tại `/settlement` của prototype LAB-3

![SCR_14 layout](./assets/SCR_14_layout.png)

> Ảnh chụp từ prototype đang chạy. Màn hình này **đã code**, nên bố cục dưới đây là bố cục thật,
> không phải phác thảo.

---

## 3. Description

Tỷ trọng thỏa thuận là con số quan trọng nhất của đề.

**Nguồn đặc tả:** mã nguồn LAB-3.

**Vai trò truy cập:** Quản trị hệ thống `R` · Tiếp nhận lô `–` · Thẩm định `–` · Chốt giao dịch `R` · Giao hàng `R` · Đối soát `F`

---

## 4. View

### 4.1 Danh sách item

| ID | Item Name | Item Type | Required | Note |
|---|---|---|---|---|
| **A** | **Bảng đối soát ngày** | | | |
| 1.0 | business_day | Label | - |  |
| 2.0 | negotiated_amt / auction_amt | Label | - | Cộng CẢ dòng đảo |
| 3.0 | reversal_cnt | Label | - | Số dòng đảo trong ngày |
| 4.0 | total_amt | Label | - | Số ròng |
| 5.0 | negotiated_share | Label | - | Tỷ trọng thỏa thuận |
| 6.0 | is_locked | Label | - |  |

### 4.2 Validation

| ID | Type | Min | Max | Default | Ghi chú |
|---|---|---|---|---|---|
| – | – | | | | Màn hình chỉ đọc, không có item nhận nhập liệu |

### 4.3 Data Mapping

| ID | Data Source | API ID | API URL | Key / Param | Ghi chú |
|---|---|---|---|---|---|
| A-1 | API | `STL-1` | `GET /api/settlement` | — | tra ở [`_common/api-list.md`](../../_common/api-list.md) |

---

## 5. Event

| ID | Given (Pre-condition) | When (Trigger/Action) | Then (Result) | Note |
|---|---|---|---|---|
| **Initializing Process** | | | | |
| - | đã đăng nhập, phiên hợp lệ | mở màn hình | 1. Gọi `GET /api/settlement`<br>2. Hiển thị danh sách | |
| **Standard Process** | | | | |
| A-1 | - | thao tác trên item | Tổng tiền cộng cả số âm của dòng đảo nên ra số ròng đúng | |
| A-2 | - | thao tác trên item | Đếm số giao dịch phải lọc reverses_id IS NULL | |
| **Error Handling** | | | | |
| - | chưa đăng nhập | gọi API | HTTP 401, chuyển về `/login?next=` | `M_40` |

---

## 6. Other Notes

- **Trạng thái:** Đang mở · Đã khoá
- Tổng tiền cộng cả số âm của dòng đảo nên ra số ròng đúng
- Đếm số giao dịch phải lọc reverses_id IS NULL

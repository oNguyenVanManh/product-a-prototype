---
id: SPEC-04-09
title: Ghi kết quả đấu giá
type: ui
screen_id: SCR_09
feature: Giao dịch thỏa thuận và đấu giá
feature_id: FEA-04
version: "0.1.0"
updated_by: nguyen-van-manh-c
updated: 2026-10-11
related: [`TRD-2`]
---

# SCR_09 — Ghi kết quả đấu giá

> Biểu mẫu: **BM-2-901-51 v2.1** — Screen Specification · SUN ASTERISK VIETNAM CO., LTD · ISO/IEC 27001:2013 & ISO 9001:2015

---

## 1. History of change

| No | Version | Action | Nội dung thay đổi | Ngày | Người sửa | Approve |
|---|---|---|---|---|---|---|
| 1 | 0.1.0 | Add New | Khởi tạo từ bộ thiết kế LAB-4 | 2026-10-11 | nguyen-van-manh-c | |

---

## 2. Layout

**Design:** bản dựng chạy thật tại `/trades` của prototype LAB-3

![SCR_09 layout](./assets/SCR_09_layout.png)

> Ảnh chụp từ prototype đang chạy. Màn hình này **đã code**, nên bố cục dưới đây là bố cục thật,
> không phải phác thảo.

---

## 3. Description

LUỒNG PHỤ, ~10% giá trị. Dùng CHUNG bảng trade với SCR-07.

**Nguồn đặc tả:** mã nguồn LAB-3.

**Vai trò truy cập:** Quản trị hệ thống `F` · Tiếp nhận lô `–` · Thẩm định `–` · Chốt giao dịch `F` · Giao hàng `R` · Đối soát `R`

---

## 4. View

### 4.1 Danh sách item

| ID | Item Name | Item Type | Required | Note |
|---|---|---|---|---|
| **A** | **Ghi kết quả đấu giá** | | | |
| 1.0 | kind | Text box | Không | せり |
| 2.0 | hand_sign | Dropdown | Không | Ký hiệu tay, NHÂN VIÊN NHẬP TAY |
| 3.0 | các field còn lại | Text box | Không |  |

### 4.2 Validation

| ID | Type | Min | Max | Default | Ghi chú |
|---|---|---|---|---|---|
| – | – | | | | Màn hình chỉ đọc, không có item nhận nhập liệu |

### 4.3 Data Mapping

| ID | Data Source | API ID | API URL | Key / Param | Ghi chú |
|---|---|---|---|---|---|
| A-1 | API | `TRD-2` | `POST /api/trades` | — | tra ở [`_common/api-list.md`](../../_common/api-list.md) |

---

## 5. Event

| ID | Given (Pre-condition) | When (Trigger/Action) | Then (Result) | Note |
|---|---|---|---|---|
| **Initializing Process** | | | | |
| - | đã đăng nhập, phiên hợp lệ | mở màn hình | 1. Gọi `POST /api/trades`<br>2. Hiển thị danh sách | |
| **Standard Process** | | | | |
| A-1 | - | thao tác trên item | Như SCR-07 | |
| A-2 | - | thao tác trên item | hand_sign chỉ ghi khi kind = auction, ngược lại ép null | |
| A-3 | - | thao tác trên item | KHÔNG có OCR hay nhận dạng ảnh — SCOPE-OUT-02 cấm | |
| **Error Handling** | | | | |
| - | chưa đăng nhập | gọi API | HTTP 401, chuyển về `/login?next=` | `M_40` |

---

## 6. Other Notes

- **Trạng thái:** Như SCR-08
- Như SCR-07
- hand_sign chỉ ghi khi kind = auction, ngược lại ép null
- KHÔNG có OCR hay nhận dạng ảnh — SCOPE-OUT-02 cấm

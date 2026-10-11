---
id: SPEC-04-07
title: Chốt giao dịch thỏa thuận
type: ui
screen_id: SCR_07
feature: Giao dịch thỏa thuận và đấu giá
feature_id: FEA-04
version: "0.1.0"
updated_by: nguyen-van-manh-c
updated: 2026-10-11
related: [`TRD-2`]
---

# SCR_07 — Chốt giao dịch thỏa thuận

> Biểu mẫu: **BM-2-901-51 v2.1** — Screen Specification · SUN ASTERISK VIETNAM CO., LTD · ISO/IEC 27001:2013 & ISO 9001:2015

---

## 1. History of change

| No | Version | Action | Nội dung thay đổi | Ngày | Người sửa | Approve |
|---|---|---|---|---|---|---|
| 1 | 0.1.0 | Add New | Khởi tạo từ bộ thiết kế LAB-4 | 2026-10-11 | nguyen-van-manh-c | |

---

## 2. Layout

**Design:** bản dựng chạy thật tại `/trades` của prototype LAB-3

![SCR_07 layout](./assets/SCR_07_layout.png)

> Ảnh chụp từ prototype đang chạy. Màn hình này **đã code**, nên bố cục dưới đây là bố cục thật,
> không phải phác thảo.

---

## 3. Description

LUỒNG CHÍNH, ~90% giá trị giao dịch. Xem ADR-005.

**Nguồn đặc tả:** mã nguồn LAB-3.

**Vai trò truy cập:** Quản trị hệ thống `F` · Tiếp nhận lô `–` · Thẩm định `–` · Chốt giao dịch `F` · Giao hàng `R` · Đối soát `R`

---

## 4. View

### 4.1 Danh sách item

| ID | Item Name | Item Type | Required | Note |
|---|---|---|---|---|
| **A** | **Chốt giao dịch thỏa thuận** | | | |
| 1.0 | kind | Text box | Không | 相対取引 |
| 2.0 | lot_id | Text box | Có | Hiện khối lượng còn lại |
| 3.0 | buyer_id | Text box | Có | CHỈ 仲卸 và 売買参加者 |
| 4.0 | quantity_kg | Text box | Có |  |
| 5.0 | unit_price | Text box | Có | JPY/kg |
| 6.0 | amount | Label | - | quantity × unit_price |

### 4.2 Validation

| ID | Type | Min | Max | Default | Ghi chú |
|---|---|---|---|---|---|
| A-2 | String |  | | | bắt buộc; lỗi dùng `M_01` |
| A-3 | String |  | | | bắt buộc; lỗi dùng `M_01` |
| A-4 | Number | 0.01 | | | bắt buộc; lỗi dùng `M_01` |
| A-5 | Number | 0.01 | | | bắt buộc; lỗi dùng `M_01` |

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
| A-1 | - | thao tác trên item | quantity_kg không vượt lot.remaining_kg — trả 409 kèm số còn lại | |
| A-2 | - | thao tác trên item | Ngày đã khoá sổ → trigger trade_check chặn | |
| A-3 | - | thao tác trên item | Bên mua phải còn tư cách hợp lệ VÀO NGÀY NGHIỆP VỤ — hàm party_is_qualified | |
| **Error Handling** | | | | |
| - | chưa đăng nhập | gọi API | HTTP 401, chuyển về `/login?next=` | `M_40` |
| - | ngày đã khoá sổ | ghi dữ liệu | HTTP 409, trigger database chặn | `M_30` |

---

## 6. Other Notes

- **Trạng thái:** Chốt xong là bất biến. Sửa = ghi dòng đảo (SCR-08)
- quantity_kg không vượt lot.remaining_kg — trả 409 kèm số còn lại
- Ngày đã khoá sổ → trigger trade_check chặn
- Bên mua phải còn tư cách hợp lệ VÀO NGÀY NGHIỆP VỤ — hàm party_is_qualified
- 買出人 không xuất hiện trong ô chọn — hệ quả của hai cấp pháp lý

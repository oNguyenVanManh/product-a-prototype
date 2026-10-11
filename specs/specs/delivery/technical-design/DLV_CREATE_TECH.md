---
id: TECH-DLV_CREATE
title: Ghi nhận lần giao hàng
type: technical
func_id: DLV_CREATE
feature: delivery
version: "0.1.0"
updated_by: nguyen-van-manh-c
updated: 2026-10-11
related: []
---

# DLV_CREATE — Ghi nhận lần giao hàng

> Biểu mẫu: **BM-2-901-53 v1.1** — Technical Design · SUN ASTERISK VIETNAM CO., LTD · ISO/IEC 27001:2013 & ISO 9001:2015

---

## 1. History of change

| No | Version | Action | Nội dung thay đổi | Ngày | Người sửa |
|---|---|---|---|---|---|
| 1 | 0.1.0 | Add New | Trích từ `src/app/api/deliveries/route.ts` của prototype LAB-3 | 2026-10-11 | nguyen-van-manh-c |

---

## 2. Sequence diagram

```mermaid
sequenceDiagram
    autonumber
    participant U as Người dùng
    participant A as API Route
    participant T as Trigger (PostgreSQL)
    participant D as Bảng dữ liệu
    U->>A: `POST /api/deliveries`
    A->>D: kiểm `delivered_kg > 0` và lý do nếu là ngoại lệ
    A->>T: API `INSERT delivery` → trigger `delivery_quantity_check` chạy
    T->>T: tính khối lượng hợp đồng ròng = dòng gốc + mọi dòng đảo
    T->>T: kiểm `day_is_locked(business_day)`
    T->>T: cộng dồn các lần giao đã có
    A->>D: Nếu tổng vượt hợp đồng → ném lỗi kèm ba con số
    D-->>A: kết quả hoặc lỗi
    A-->>U: HTTP 2xx hoặc 4xx kèm thông điệp tiếng Việt
```

---

## 3. Description

Mã nguồn: `src/app/api/deliveries/route.ts`

Luồng xử lý chia làm các bước ở mục 4. Điểm chung của mọi hàm trong hệ thống này: **quy tắc nghiệp vụ
thi hành ở tầng database bằng trigger**, tầng API chỉ chuyển tiếp thông điệp lỗi cho người dùng đọc.
Xem [ADR-002](../../../_extra/decisions/ADR-002-quy-tac-o-tang-database.md).

---

## 4. Detail function

### 4.1. Validate

| Mục | Nội dung |
|---|---|
| Input / điều kiện | `delivered_kg > 0`; `exception_reason` bắt buộc khi `status = exception` |
| Error | 400 |

### 4.2. Kiểm hợp đồng ròng

| Mục | Nội dung |
|---|---|
| Input / điều kiện | Dòng gốc cộng dòng đảo; ≤ 0 nghĩa là đã huỷ hết |
| Error | 409 — giao dịch đã bị huỷ |

### 4.3. Kiểm ngày khoá

| Mục | Nội dung |
|---|---|
| Input / điều kiện | `day_is_locked(business_day)` |
| Error | 409 |

### 4.4. Cộng dồn

| Mục | Nội dung |
|---|---|
| Input / điều kiện | `SUM(delivered_kg) + lần này <= hợp đồng` |
| Error | 409 kèm đã giao / lần này / hợp đồng |

---

## 5. Other Notes

- Mọi thông điệp lỗi do trigger ném ra được trả **nguyên văn** cho người dùng, không thay bằng câu chung chung.
- Mã lỗi dùng chung tra ở [`_common/error-codes.md`](../../_common/error-codes.md).

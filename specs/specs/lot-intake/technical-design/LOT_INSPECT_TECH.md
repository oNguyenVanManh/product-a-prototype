---
id: TECH-LOT_INSPECT
title: Ghi kết quả thẩm định
type: technical
func_id: LOT_INSPECT
feature: lot-intake
version: "0.1.0"
updated_by: nguyen-van-manh-c
updated: 2026-10-11
related: []
---

# LOT_INSPECT — Ghi kết quả thẩm định

> Biểu mẫu: **BM-2-901-53 v1.1** — Technical Design · SUN ASTERISK VIETNAM CO., LTD · ISO/IEC 27001:2013 & ISO 9001:2015

---

## 1. History of change

| No | Version | Action | Nội dung thay đổi | Ngày | Người sửa |
|---|---|---|---|---|---|
| 1 | 0.1.0 | Add New | Trích từ `src/app/api/lots/inspect/route.ts` của prototype LAB-3 | 2026-10-11 | nguyen-van-manh-c |

---

## 2. Sequence diagram

```mermaid
sequenceDiagram
    autonumber
    participant U as Người dùng
    participant A as API Route
    participant T as Trigger (PostgreSQL)
    participant D as Bảng dữ liệu
    U->>A: `POST /api/lots/inspect`
    A->>D: kiểm `grade` ∈ {A, B, C}
    A->>D: `INSERT inspection` kèm `inspected_by` lấy từ phiên
    A->>D: `UPDATE lot` đặt `status = inspected`
    A->>D: ghi `audit_log`
    D-->>A: kết quả hoặc lỗi
    A-->>U: HTTP 2xx hoặc 4xx kèm thông điệp tiếng Việt
```

---

## 3. Description

Mã nguồn: `src/app/api/lots/inspect/route.ts`

Luồng xử lý chia làm các bước ở mục 4. Điểm chung của mọi hàm trong hệ thống này: **quy tắc nghiệp vụ
thi hành ở tầng database bằng trigger**, tầng API chỉ chuyển tiếp thông điệp lỗi cho người dùng đọc.
Xem [ADR-002](../../../_extra/decisions/ADR-002-quy-tac-o-tang-database.md).

---

## 4. Detail function

### 4.1. Validate

| Mục | Nội dung |
|---|---|
| Input / điều kiện | `grade` phải là A, B hoặc C — CHECK ở database |
| Error | 400 |

### 4.2. Ghi kết quả

| Mục | Nội dung |
|---|---|
| Input / điều kiện | INSERT kèm tên người thẩm định |
| Error | 400 |

### 4.3. Không tự động hoá

| Mục | Nội dung |
|---|---|
| Input / điều kiện | Hàm **không có** bất kỳ phép tính nào suy ra hạng — SCOPE-OUT-01 |
| Error | — |

---

## 5. Other Notes

- Mọi thông điệp lỗi do trigger ném ra được trả **nguyên văn** cho người dùng, không thay bằng câu chung chung.
- Mã lỗi dùng chung tra ở [`_common/error-codes.md`](../../_common/error-codes.md).

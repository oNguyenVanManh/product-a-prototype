---
id: TECH-INC_CALC
title: Tính tiền khuyến khích
type: technical
func_id: INC_CALC
feature: incentive
version: "0.1.0"
updated_by: nguyen-van-manh-c
updated: 2026-10-11
related: []
---

# INC_CALC — Tính tiền khuyến khích

> Biểu mẫu: **BM-2-901-53 v1.1** — Technical Design · SUN ASTERISK VIETNAM CO., LTD · ISO/IEC 27001:2013 & ISO 9001:2015

---

## 1. History of change

| No | Version | Action | Nội dung thay đổi | Ngày | Người sửa |
|---|---|---|---|---|---|
| 1 | 0.1.0 | Add New | Trích từ `src/app/api/incentives/route.ts` của prototype LAB-3 | 2026-10-11 | nguyen-van-manh-c |

---

## 2. Sequence diagram

```mermaid
sequenceDiagram
    autonumber
    participant U as Người dùng
    participant A as API Route
    participant T as Trigger (PostgreSQL)
    participant D as Bảng dữ liệu
    U->>A: `POST /api/incentives`
    A->>D: truy vấn `rate_version` với `effective_from <= business_day`, sắp giảm dần, lấy 1
    A->>D: truy vấn toàn bộ `trade` của ngày đó, gồm cả dòng đảo
    A->>D: cộng `amount` theo `buyer_id` → cơ sở tính (dòng đảo âm nên tự trừ ra)
    A->>D: truy vấn `payment_status` xác định trả đúng hạn hay không
    A->>D: tính `floor(cơ_sở × rate_pct / 100 × tax_factor)`
    A->>D: `UPSERT incentive` kèm `rate_version_no` đã dùng
    D-->>A: kết quả hoặc lỗi
    A-->>U: HTTP 2xx hoặc 4xx kèm thông điệp tiếng Việt
```

---

## 3. Description

Mã nguồn: `src/app/api/incentives/route.ts`

Luồng xử lý chia làm các bước ở mục 4. Điểm chung của mọi hàm trong hệ thống này: **quy tắc nghiệp vụ
thi hành ở tầng database bằng trigger**, tầng API chỉ chuyển tiếp thông điệp lỗi cho người dùng đọc.
Xem [ADR-002](../../../_extra/decisions/ADR-002-quy-tac-o-tang-database.md).

---

## 4. Detail function

### 4.1. Tra biểu suất theo ngày nghiệp vụ

| Mục | Nội dung |
|---|---|
| Input / điều kiện | `effective_from <= business_day` — **không** lấy bản mới nhất |
| Error | 409 nếu chưa có biểu suất nào hiệu lực |

### 4.2. Tính cơ sở

| Mục | Nội dung |
|---|---|
| Input / điều kiện | Cộng cả dòng đảo; bỏ qua bên có cơ sở ≤ 0 |
| Error | — |

### 4.3. Xác định đúng hạn

| Mục | Nội dung |
|---|---|
| Input / điều kiện | `paid_date` không null và `<= due_date` |
| Error | chưa trả → thưởng = 0 |

### 4.4. Lưu vết

| Mục | Nội dung |
|---|---|
| Input / điều kiện | Ghi `rate_version_no` để tái lập con số khi bị chất vấn |
| Error | 400 |

---

## 5. Other Notes

- Mọi thông điệp lỗi do trigger ném ra được trả **nguyên văn** cho người dùng, không thay bằng câu chung chung.
- Mã lỗi dùng chung tra ở [`_common/error-codes.md`](../../_common/error-codes.md).

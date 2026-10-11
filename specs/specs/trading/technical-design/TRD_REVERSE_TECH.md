---
id: TECH-TRD_REVERSE
title: Huỷ giao dịch bằng dòng đảo
type: technical
func_id: TRD_REVERSE
feature: trading
version: "0.1.0"
updated_by: nguyen-van-manh-c
updated: 2026-10-11
related: []
---

# TRD_REVERSE — Huỷ giao dịch bằng dòng đảo

> Biểu mẫu: **BM-2-901-53 v1.1** — Technical Design · SUN ASTERISK VIETNAM CO., LTD · ISO/IEC 27001:2013 & ISO 9001:2015

---

## 1. History of change

| No | Version | Action | Nội dung thay đổi | Ngày | Người sửa |
|---|---|---|---|---|---|
| 1 | 0.1.0 | Add New | Trích từ `src/app/api/trades/reverse/route.ts` của prototype LAB-3 | 2026-10-11 | nguyen-van-manh-c |

---

## 2. Sequence diagram

```mermaid
sequenceDiagram
    autonumber
    participant U as Người dùng
    participant A as API Route
    participant T as Trigger (PostgreSQL)
    participant D as Bảng dữ liệu
    U->>A: `POST /api/trades/reverse`
    A->>D: truy vấn dòng gốc
    A->>D: kiểm dòng gốc không phải dòng đảo
    A->>D: kiểm dòng gốc chưa bị đảo trước đó
    A->>D: INSERT dòng mới: `reverses_id` = id gốc, `quantity_kg` và `amount` âm
    A->>D: trả khối lượng về cho `lot`
    A->>D: ghi `audit_log` kèm lý do
    D-->>A: kết quả hoặc lỗi
    A-->>U: HTTP 2xx hoặc 4xx kèm thông điệp tiếng Việt
```

---

## 3. Description

Mã nguồn: `src/app/api/trades/reverse/route.ts`

Luồng xử lý chia làm các bước ở mục 4. Điểm chung của mọi hàm trong hệ thống này: **quy tắc nghiệp vụ
thi hành ở tầng database bằng trigger**, tầng API chỉ chuyển tiếp thông điệp lỗi cho người dùng đọc.
Xem [ADR-002](../../../_extra/decisions/ADR-002-quy-tac-o-tang-database.md).

---

## 4. Detail function

### 4.1. Tìm dòng gốc

| Mục | Nội dung |
|---|---|
| Input / điều kiện | `trade_id` phải tồn tại |
| Error | 404 |

### 4.2. Chặn đảo chồng

| Mục | Nội dung |
|---|---|
| Input / điều kiện | `reverses_id` của dòng gốc phải null |
| Error | 409 — đây đã là dòng đảo |

### 4.3. Chặn đảo hai lần

| Mục | Nội dung |
|---|---|
| Input / điều kiện | Không có dòng nào `reverses_id = trade_id` |
| Error | 409 — ⚠️ hiện kiểm ở tầng API, chưa có UNIQUE (R-06) |

### 4.4. Ghi dòng đảo

| Mục | Nội dung |
|---|---|
| Input / điều kiện | INSERT với số âm; dòng gốc **không đổi** |
| Error | 409 nếu trigger từ chối |

---

## 5. Other Notes

- Mọi thông điệp lỗi do trigger ném ra được trả **nguyên văn** cho người dùng, không thay bằng câu chung chung.
- Mã lỗi dùng chung tra ở [`_common/error-codes.md`](../../_common/error-codes.md).

# Giao dịch thỏa thuận và đấu giá

> Feature slug: `trading`

## Tài liệu của feature này

### Screen Specification — `BM-2-901-51`

| ID | Tiêu đề | Version | File |
|---|---|---|---|
| `SPEC-04-07` | Chốt giao dịch thỏa thuận | "0.1.0" | [`SCR_07_SPEC.md`](./screen-specification/SCR_07_SPEC.md) |
| `SPEC-04-08` | Danh sách và huỷ giao dịch | "0.1.0" | [`SCR_08_SPEC.md`](./screen-specification/SCR_08_SPEC.md) |
| `SPEC-04-09` | Ghi kết quả đấu giá | "0.1.0" | [`SCR_09_SPEC.md`](./screen-specification/SCR_09_SPEC.md) |
| `SPEC-04-10` | Lịch sử sửa kết quả đấu giá | "0.1.0" | [`SCR_10_SPEC.md`](./screen-specification/SCR_10_SPEC.md) |

### Function Specifications — `BM-2-901-54`

| ID | Tiêu đề | Version | File |
|---|---|---|---|
| `FUNC-TRD` | Đặc tả function module trading | "0.1.0" | [`TRD_FUNC.md`](./function-specifications/TRD_FUNC.md) |

### Technical Design — `BM-2-901-53`

| ID | Tiêu đề | Version | File |
|---|---|---|---|
| `TECH-TRD_CREATE` | Chốt giao dịch | "0.1.0" | [`TRD_CREATE_TECH.md`](./technical-design/TRD_CREATE_TECH.md) |
| `TECH-TRD_REVERSE` | Huỷ giao dịch bằng dòng đảo | "0.1.0" | [`TRD_REVERSE_TECH.md`](./technical-design/TRD_REVERSE_TECH.md) |

## Tài liệu mức hệ thống liên quan

### Database Design — `BM-2-901-50`

| ID | Tiêu đề | File |
|---|---|---|
| `DB-TRADE` | Giao dịch | [`TRADE_DB.md`](../system-design/database-design/trading/TRADE_DB.md) |

### API Design — `BM-2-901-52`

| ID | Tiêu đề | File |
|---|---|---|
| `API-TRD-1` | GET /api/trades | [`TRD-1_API.md`](../system-design/api-design/trading/TRD-1_API.md) |
| `API-TRD-2` | POST /api/trades | [`TRD-2_API.md`](../system-design/api-design/trading/TRD-2_API.md) |
| `API-TRD-3` | POST /api/trades/reverse | [`TRD-3_API.md`](../system-design/api-design/trading/TRD-3_API.md) |

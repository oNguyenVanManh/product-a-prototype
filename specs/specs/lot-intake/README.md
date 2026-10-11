# Tiếp nhận lô và thẩm định

> Feature slug: `lot-intake`

## Tài liệu của feature này

### Screen Specification — `BM-2-901-51`

| ID | Tiêu đề | Version | File |
|---|---|---|---|
| `SPEC-03-05` | Tiếp nhận lô hàng | "0.1.0" | [`SCR_05_SPEC.md`](./screen-specification/SCR_05_SPEC.md) |
| `SPEC-03-06` | Ghi kết quả thẩm định | "0.1.0" | [`SCR_06_SPEC.md`](./screen-specification/SCR_06_SPEC.md) |

### Function Specifications — `BM-2-901-54`

| ID | Tiêu đề | Version | File |
|---|---|---|---|
| `FUNC-LOT` | Đặc tả function module lot-intake | "0.1.0" | [`LOT_FUNC.md`](./function-specifications/LOT_FUNC.md) |

### Technical Design — `BM-2-901-53`

| ID | Tiêu đề | Version | File |
|---|---|---|---|
| `TECH-LOT_INSPECT` | Ghi kết quả thẩm định | "0.1.0" | [`LOT_INSPECT_TECH.md`](./technical-design/LOT_INSPECT_TECH.md) |

## Tài liệu mức hệ thống liên quan

### Database Design — `BM-2-901-50`

| ID | Tiêu đề | File |
|---|---|---|
| `DB-INSPECTION` | Kết quả thẩm định | [`INSPECTION_DB.md`](../system-design/database-design/lot-intake/INSPECTION_DB.md) |
| `DB-LOT` | Lô hàng | [`LOT_DB.md`](../system-design/database-design/lot-intake/LOT_DB.md) |

### API Design — `BM-2-901-52`

| ID | Tiêu đề | File |
|---|---|---|
| `API-LOT-1` | GET /api/lots | [`LOT-1_API.md`](../system-design/api-design/lot-intake/LOT-1_API.md) |
| `API-LOT-2` | POST /api/lots | [`LOT-2_API.md`](../system-design/api-design/lot-intake/LOT-2_API.md) |
| `API-LOT-3` | POST /api/lots/inspect | [`LOT-3_API.md`](../system-design/api-design/lot-intake/LOT-3_API.md) |

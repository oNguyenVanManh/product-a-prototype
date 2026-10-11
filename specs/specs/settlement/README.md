# Đối soát, chốt sổ và điều chỉnh

> Feature slug: `settlement`

## Tài liệu của feature này

### Screen Specification — `BM-2-901-51`

| ID | Tiêu đề | Version | File |
|---|---|---|---|
| `SPEC-06-14` | Bảng đối soát ngày | "0.1.0" | [`SCR_14_SPEC.md`](./screen-specification/SCR_14_SPEC.md) |
| `SPEC-06-15` | Khoá ngày nghiệp vụ | "0.1.0" | [`SCR_15_SPEC.md`](./screen-specification/SCR_15_SPEC.md) |
| `SPEC-06-16` | Tạo yêu cầu điều chỉnh sau chốt | "0.1.0" | [`SCR_16_SPEC.md`](./screen-specification/SCR_16_SPEC.md) |
| `SPEC-06-17` | Phê duyệt điều chỉnh | "0.1.0" | [`SCR_17_SPEC.md`](./screen-specification/SCR_17_SPEC.md) |
| `SPEC-06-18` | Quản lý tranh chấp | "0.1.0" | [`SCR_18_SPEC.md`](./screen-specification/SCR_18_SPEC.md) |

### Function Specifications — `BM-2-901-54`

| ID | Tiêu đề | Version | File |
|---|---|---|---|
| `FUNC-STL` | Đặc tả function module settlement | "0.1.0" | [`STL_FUNC.md`](./function-specifications/STL_FUNC.md) |

### Technical Design — `BM-2-901-53`

| ID | Tiêu đề | Version | File |
|---|---|---|---|
| `TECH-STL_LOCK` | Khoá ngày nghiệp vụ | "0.1.0" | [`STL_LOCK_TECH.md`](./technical-design/STL_LOCK_TECH.md) |

## Tài liệu mức hệ thống liên quan

### Database Design — `BM-2-901-50`

| ID | Tiêu đề | File |
|---|---|---|
| `DB-SETTLEMENT_DAY` | Ngày nghiệp vụ | [`SETTLEMENT_DAY_DB.md`](../system-design/database-design/settlement/SETTLEMENT_DAY_DB.md) |

### API Design — `BM-2-901-52`

| ID | Tiêu đề | File |
|---|---|---|
| `API-STL-1` | GET /api/settlement | [`STL-1_API.md`](../system-design/api-design/settlement/STL-1_API.md) |
| `API-STL-2` | POST /api/settlement/lock | [`STL-2_API.md`](../system-design/api-design/settlement/STL-2_API.md) |

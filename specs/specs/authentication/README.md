# Xác thực và phân quyền

> Feature slug: `authentication`

## Tài liệu của feature này

### Screen Specification — `BM-2-901-51`

| ID | Tiêu đề | Version | File |
|---|---|---|---|
| `SPEC-02-01` | Đăng nhập | "0.1.0" | [`SCR_01_SPEC.md`](./screen-specification/SCR_01_SPEC.md) |
| `SPEC-02-02` | Quản lý tài khoản và quyền | "0.1.0" | [`SCR_02_SPEC.md`](./screen-specification/SCR_02_SPEC.md) |

### Function Specifications — `BM-2-901-54`

| ID | Tiêu đề | Version | File |
|---|---|---|---|
| `FUNC-AUTH` | Đặc tả function module authentication | "0.1.0" | [`AUTH_FUNC.md`](./function-specifications/AUTH_FUNC.md) |

### Technical Design — `BM-2-901-53`

*Chưa có tài liệu loại này cho feature này.*

## Tài liệu mức hệ thống liên quan

### Database Design — `BM-2-901-50`

| ID | Tiêu đề | File |
|---|---|---|
| `DB-APP_USER` | Người dùng nội bộ | [`APP_USER_DB.md`](../system-design/database-design/authentication/APP_USER_DB.md) |

### API Design — `BM-2-901-52`

| ID | Tiêu đề | File |
|---|---|---|
| `API-AUTH-1` | POST /api/auth/login | [`AUTH-1_API.md`](../system-design/api-design/authentication/AUTH-1_API.md) |
| `API-AUTH-2` | POST /api/auth/logout | [`AUTH-2_API.md`](../system-design/api-design/authentication/AUTH-2_API.md) |
| `API-USR-1` | GET /api/users | [`USR-1_API.md`](../system-design/api-design/authentication/USR-1_API.md) |
| `API-USR-2` | PATCH /api/users | [`USR-2_API.md`](../system-design/api-design/authentication/USR-2_API.md) |

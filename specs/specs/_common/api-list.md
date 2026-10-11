# API list — bảng tra toàn hệ thống

> Screen Specification tham chiếu API bằng `API ID` ở bảng này. **Không tự khai API mới trong file spec.**

| API ID | Nhóm | Method | Endpoint | Mô tả | Tài liệu |
|---|---|---|---|---|---|
| `AUTH-1` | authentication | `POST` | `/api/auth/login` | — | [chi tiết](../system-design/api-design/authentication/AUTH-1_API.md) |
| `AUTH-2` | authentication | `POST` | `/api/auth/logout` | — | [chi tiết](../system-design/api-design/authentication/AUTH-2_API.md) |
| `USR-1` | authentication | `GET` | `/api/users` | — | [chi tiết](../system-design/api-design/authentication/USR-1_API.md) |
| `USR-2` | authentication | `PATCH` | `/api/users` | — | [chi tiết](../system-design/api-design/authentication/USR-2_API.md) |
| `DLV-1` | delivery | `GET` | `/api/deliveries` | — | [chi tiết](../system-design/api-design/delivery/DLV-1_API.md) |
| `DLV-2` | delivery | `POST` | `/api/deliveries` | — | [chi tiết](../system-design/api-design/delivery/DLV-2_API.md) |
| `INC-1` | incentive | `GET` | `/api/incentives` | — | [chi tiết](../system-design/api-design/incentive/INC-1_API.md) |
| `INC-2` | incentive | `POST` | `/api/incentives` | — | [chi tiết](../system-design/api-design/incentive/INC-2_API.md) |
| `LOT-1` | lot-intake | `GET` | `/api/lots` | — | [chi tiết](../system-design/api-design/lot-intake/LOT-1_API.md) |
| `LOT-2` | lot-intake | `POST` | `/api/lots` | — | [chi tiết](../system-design/api-design/lot-intake/LOT-2_API.md) |
| `LOT-3` | lot-intake | `POST` | `/api/lots/inspect` | — | [chi tiết](../system-design/api-design/lot-intake/LOT-3_API.md) |
| `PTY-1` | party-management | `GET` | `/api/parties` | — | [chi tiết](../system-design/api-design/party-management/PTY-1_API.md) |
| `STL-1` | settlement | `GET` | `/api/settlement` | — | [chi tiết](../system-design/api-design/settlement/STL-1_API.md) |
| `STL-2` | settlement | `POST` | `/api/settlement/lock` | — | [chi tiết](../system-design/api-design/settlement/STL-2_API.md) |
| `TRD-1` | trading | `GET` | `/api/trades` | — | [chi tiết](../system-design/api-design/trading/TRD-1_API.md) |
| `TRD-2` | trading | `POST` | `/api/trades` | — | [chi tiết](../system-design/api-design/trading/TRD-2_API.md) |
| `TRD-3` | trading | `POST` | `/api/trades/reverse` | — | [chi tiết](../system-design/api-design/trading/TRD-3_API.md) |

**Quy ước chung**

- Mọi phản hồi dạng `application/json`.
- Mọi API trừ `/api/auth/login` đòi cookie `pa_session` hợp lệ.
- Lỗi do quy tắc nghiệp vụ trả **409** kèm nguyên văn thông điệp từ trigger.
- Truy cập database đi qua `service_role` key ở phía server, không lộ ra trình duyệt.

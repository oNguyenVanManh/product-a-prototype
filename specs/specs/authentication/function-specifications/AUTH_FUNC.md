---
id: FUNC-AUTH
title: Đặc tả function module authentication
type: function
module_id: AUTH
feature: authentication
version: "0.1.0"
updated_by: nguyen-van-manh-c
updated: 2026-10-11
related: []
---

# AUTH — Function Specifications

> Biểu mẫu: **BM-2-901-54 v1.1** — Function Specifications · SUN ASTERISK VIETNAM CO., LTD · ISO/IEC 27001:2013 & ISO 9001:2015

---

## 1. Lịch sử sửa đổi

| No | Version | Action | Nội dung thay đổi | Ngày | Người sửa |
|---|---|---|---|---|---|
| 1 | 0.1.0 | Add New | Trích từ `src/lib/auth.ts` của prototype LAB-3 | 2026-10-11 | nguyen-van-manh-c |

---

## 2. Đặc tả function

### 2.1. `login`

| Mục | Giá trị |
|---|---|
| Return type | `Promise<Session \| null>` |
| Function name | `login` |

| Argument type | Argument name | Role of the argument |
|---|---|---|
| `string` | `email` | Email người dùng, chuẩn hoá về chữ thường |
| `string` | `password` | Mật khẩu demo, so với biến môi trường DEMO_PASSWORD |

**Function description**

Kiểm mật khẩu demo trước, rồi tra `app_user` theo email và `is_active = true`. Trả `null` nếu một trong hai bước thất bại — **không phân biệt** sai email với sai mật khẩu, để không rò rỉ danh sách tài khoản.

### 2.2. `setSession`

| Mục | Giá trị |
|---|---|
| Return type | `Promise<void>` |
| Function name | `setSession` |

| Argument type | Argument name | Role of the argument |
|---|---|---|
| `Session` | `s` | Phiên đăng nhập vừa xác thực |

**Function description**

Ký payload bằng HMAC-SHA256 với `SESSION_SECRET`, ghi cookie `pa_session` httpOnly, sameSite lax, hạn 8 tiếng (xấp xỉ một ca chợ).

### 2.3. `getSession`

| Mục | Giá trị |
|---|---|
| Return type | `Promise<Session \| null>` |
| Function name | `getSession` |

*Không có tham số.*

**Function description**

Đọc cookie, tách payload và chữ ký, so sánh bằng `timingSafeEqual` để không rò rỉ thông tin qua thời gian phản hồi. Trả `null` nếu chữ ký sai.

### 2.4. `proxy`

| Mục | Giá trị |
|---|---|
| Return type | `NextResponse` |
| Function name | `proxy` |

| Argument type | Argument name | Role of the argument |
|---|---|---|
| `NextRequest` | `req` | Request đang vào |

**Function description**

Chạy trên Edge runtime nên **không dùng được** module crypto của Node — chỉ kiểm tra CÓ cookie hay không. Xác minh chữ ký thật nằm ở `getSession()`. Hai lớp cộng lại thì cookie giả không qua được.

---
id: FUNC-STL
title: Đặc tả function module settlement
type: function
module_id: STL
feature: settlement
version: "0.1.0"
updated_by: nguyen-van-manh-c
updated: 2026-10-11
related: []
---

# STL — Function Specifications

> Biểu mẫu: **BM-2-901-54 v1.1** — Function Specifications · SUN ASTERISK VIETNAM CO., LTD · ISO/IEC 27001:2013 & ISO 9001:2015

---

## 1. Lịch sử sửa đổi

| No | Version | Action | Nội dung thay đổi | Ngày | Người sửa |
|---|---|---|---|---|---|
| 1 | 0.1.0 | Add New | Trích từ `src/app/api/settlement/route.ts · settlement/lock/route.ts` của prototype LAB-3 | 2026-10-11 | nguyen-van-manh-c |

---

## 2. Đặc tả function

### 2.1. `GET /api/settlement`

| Mục | Giá trị |
|---|---|
| Return type | `NextResponse` |
| Function name | `GET /api/settlement` |

*Không có tham số.*

**Function description**

Tổng hợp bảng đối soát theo ngày. Tổng tiền **cộng cả dòng đảo mang số âm** nên ra số ròng đúng mà không cần mệnh đề loại trừ. Riêng phép ĐẾM số giao dịch phải lọc `reverses_id IS NULL` — đây là chỗ dễ sai nhất của mô hình ghi-thêm.

### 2.2. `POST /api/settlement/lock`

| Mục | Giá trị |
|---|---|
| Return type | `NextResponse` |
| Function name | `POST /api/settlement/lock` |

| Argument type | Argument name | Role of the argument |
|---|---|---|
| `Request` | `req` | Body: business_day, lock |

**Function description**

Khoá hoặc mở lại một ngày nghiệp vụ. Chỉ `ROLE_SETTLEMENT` và `ROLE_SYS_ADMIN`; vai trò khác nhận 403. Khoá xong thì trigger chặn mọi lệnh ghi vào ngày đó.

---
id: FUNC-INC
title: Đặc tả function module incentive
type: function
module_id: INC
feature: incentive
version: "0.1.0"
updated_by: nguyen-van-manh-c
updated: 2026-10-11
related: []
---

# INC — Function Specifications

> Biểu mẫu: **BM-2-901-54 v1.1** — Function Specifications · SUN ASTERISK VIETNAM CO., LTD · ISO/IEC 27001:2013 & ISO 9001:2015

---

## 1. Lịch sử sửa đổi

| No | Version | Action | Nội dung thay đổi | Ngày | Người sửa |
|---|---|---|---|---|---|
| 1 | 0.1.0 | Add New | Trích từ `src/app/api/incentives/route.ts` của prototype LAB-3 | 2026-10-11 | nguyen-van-manh-c |

---

## 2. Đặc tả function

### 2.1. `POST /api/incentives`

| Mục | Giá trị |
|---|---|
| Return type | `NextResponse` |
| Function name | `POST /api/incentives` |

| Argument type | Argument name | Role of the argument |
|---|---|---|
| `Request` | `req` | Body: business_day |

**Function description**

Tính tiền khuyến khích cho một ngày. **Điểm mấu chốt:** tra biểu suất bằng `effective_from <= business_day` chứ không lấy bản mới nhất. Lưu `rate_version_no` đã dùng vào từng dòng để về sau tái lập được con số. Làm tròn XUỐNG đơn vị JPY theo BR-INC-01.

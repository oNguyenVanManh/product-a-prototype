---
id: API-LOT-1
title: GET /api/lots
type: api
method: GET
endpoint: /api/lots
feature: lot-intake
version: "0.1.0"
updated_by: nguyen-van-manh-c
updated: 2026-10-11
related: []
---

# LOT-1 — GET /api/lots

> Biểu mẫu: **BM-2-901-52 v1.1** — API Design · SUN ASTERISK VIETNAM CO., LTD · ISO/IEC 27001:2013 & ISO 9001:2015

---

## 1. History of change

| No | Ver | Action | Nội dung thay đổi | Ngày | Người sửa |
|---|---|---|---|---|---|
| 1 | 0.1.0 | Add new | Trích từ `src/app/api/lots/route.ts` của prototype LAB-3 | 2026-10-11 | nguyen-van-manh-c |

---

## 2. 内容 / Description

| Mục | Giá trị |
|---|---|
| Endpoint | `/api/lots` |
| Method | `GET` |
| Media type | `application/json` |
| Mã nguồn | `src/app/api/lots/route.ts` |

SCR-05 — danh sách lô hàng kèm kết quả thẩm định.

---

## 3. Request Params

| No. | Param Type | Key | Data Type | Required | Description |
|---|---|---|---|---|---|
| 1 | Header | `Cookie: pa_session` | string | ✓ | Phiên đăng nhập ký HMAC-SHA256 |

---

## 4. Responses

| Status code | Nội dung | Khi nào |
|---|---|---|
| `200` | OK | Trả dữ liệu |
| `400` | Bad request | Thiếu trường bắt buộc hoặc giá trị không hợp lệ |
| `401` | Unauthorized | Chưa đăng nhập hoặc chữ ký cookie sai |
| `500` | Internal error | Lỗi chưa bắt được; body trả JSON kèm thông điệp gốc |

---

## 5. Other Notes

- Toàn bộ truy cập database đi qua `service_role` key ở phía server, không bao giờ lộ ra trình duyệt.
- Mã lỗi dùng chung tra ở [`_common/error-codes.md`](../../../_common/error-codes.md).

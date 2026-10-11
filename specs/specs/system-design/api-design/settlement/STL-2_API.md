---
id: API-STL-2
title: POST /api/settlement/lock
type: api
method: POST
endpoint: /api/settlement/lock
feature: settlement
version: "0.1.0"
updated_by: nguyen-van-manh-c
updated: 2026-10-11
related: []
---

# STL-2 — POST /api/settlement/lock

> Biểu mẫu: **BM-2-901-52 v1.1** — API Design · SUN ASTERISK VIETNAM CO., LTD · ISO/IEC 27001:2013 & ISO 9001:2015

---

## 1. History of change

| No | Ver | Action | Nội dung thay đổi | Ngày | Người sửa |
|---|---|---|---|---|---|
| 1 | 0.1.0 | Add new | Trích từ `src/app/api/settlement/lock/route.ts` của prototype LAB-3 | 2026-10-11 | nguyen-van-manh-c |

---

## 2. 内容 / Description

| Mục | Giá trị |
|---|---|
| Endpoint | `/api/settlement/lock` |
| Method | `POST` |
| Media type | `application/json` |
| Mã nguồn | `src/app/api/settlement/lock/route.ts` |

SCR-15 — khoá ngày nghiệp vụ.  Khoá xong thì trigger ở Supabase chặn mọi INSERT giao dịch vào ngày đó. Chỉ vai trò đối soát được thao tác (BR-CLOSE-01).

---

## 3. Request Params

| No. | Param Type | Key | Data Type | Required | Description |
|---|---|---|---|---|---|
| 1 | Header | `Cookie: pa_session` | string | ✓ | Phiên đăng nhập (trừ `/api/auth/login`) |
| 2 | Body | — | object | ✓ | Xem mục 5 |

---

## 4. Responses

| Status code | Nội dung | Khi nào |
|---|---|---|
| `200` | OK | Cập nhật thành công |
| `400` | Bad request | Thiếu trường bắt buộc hoặc giá trị không hợp lệ |
| `401` | Unauthorized | Chưa đăng nhập hoặc chữ ký cookie sai |
| `403` | Forbidden | Vai trò không đủ quyền |
| `409` | Conflict | **Trigger ở database từ chối** — thông điệp trả nguyên văn tiếng Việt |
| `500` | Internal error | Lỗi chưa bắt được; body trả JSON kèm thông điệp gốc |

---

## 5. Other Notes

- Toàn bộ truy cập database đi qua `service_role` key ở phía server, không bao giờ lộ ra trình duyệt.
- Lỗi do quy tắc nghiệp vụ trả **409 kèm nguyên văn thông điệp từ trigger**, không thay bằng câu chung chung — người dùng cần biết chính xác vì sao bị chặn.
- Mã lỗi dùng chung tra ở [`_common/error-codes.md`](../../../_common/error-codes.md).

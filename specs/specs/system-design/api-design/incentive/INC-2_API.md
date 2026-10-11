---
id: API-INC-2
title: POST /api/incentives
type: api
method: POST
endpoint: /api/incentives
feature: incentive
version: "0.1.0"
updated_by: nguyen-van-manh-c
updated: 2026-10-11
related: []
---

# INC-2 — POST /api/incentives

> Biểu mẫu: **BM-2-901-52 v1.1** — API Design · SUN ASTERISK VIETNAM CO., LTD · ISO/IEC 27001:2013 & ISO 9001:2015

---

## 1. History of change

| No | Ver | Action | Nội dung thay đổi | Ngày | Người sửa |
|---|---|---|---|---|---|
| 1 | 0.1.0 | Add new | Trích từ `src/app/api/incentives/route.ts` của prototype LAB-3 | 2026-10-11 | nguyen-van-manh-c |

---

## 2. 内容 / Description

| Mục | Giá trị |
|---|---|
| Endpoint | `/api/incentives` |
| Method | `POST` |
| Media type | `application/json` |
| Mã nguồn | `src/app/api/incentives/route.ts` |

SCR-20 — kết quả tính thưởng thanh toán đúng hạn (完納奨励金). /
export async function GET() {
  if (!(await getSession()))
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });

  const [inc, rates] = await Promise.all([
    db().from("incentive")
      .select(" , party:party_id(c

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
| `201` | Created | Ghi mới thành công |
| `400` | Bad request | Thiếu trường bắt buộc hoặc giá trị không hợp lệ |
| `401` | Unauthorized | Chưa đăng nhập hoặc chữ ký cookie sai |
| `409` | Conflict | **Trigger ở database từ chối** — thông điệp trả nguyên văn tiếng Việt |
| `500` | Internal error | Lỗi chưa bắt được; body trả JSON kèm thông điệp gốc |

---

## 5. Other Notes

- Toàn bộ truy cập database đi qua `service_role` key ở phía server, không bao giờ lộ ra trình duyệt.
- Lỗi do quy tắc nghiệp vụ trả **409 kèm nguyên văn thông điệp từ trigger**, không thay bằng câu chung chung — người dùng cần biết chính xác vì sao bị chặn.
- Mã lỗi dùng chung tra ở [`_common/error-codes.md`](../../../_common/error-codes.md).

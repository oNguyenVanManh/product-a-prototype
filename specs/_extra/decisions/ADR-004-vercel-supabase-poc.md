---
id: ADR-004
title: Vercel + Supabase cho PoC, ECS Fargate + RDS cho production
type: decision
version: "0.1.0"
updated_by: nguyen-van-manh-c
updated: 2026-10-11
status: đã áp dụng
---

# ADR-004 — Vercel + Supabase cho PoC, ECS Fargate + RDS cho production

> ⚠️ **Không có biểu mẫu chuẩn cho ADR.** Bộ spec-standard (QC-01) không quy định loại tài liệu này,
> nên file được viết mới theo yêu cầu LAB-4. Bốn mục dưới đây theo khuôn ADR thông dụng:
> bối cảnh · lựa chọn · phương án đã bỏ · hệ quả.

---
**Bối cảnh.** LAB-1 đề xuất kiến trúc production ECS Fargate + RDS PostgreSQL Multi-AZ tại
ap-northeast-1, phù hợp NFR-AVL-01/03 và NFR-PRIV-01. LAB-3 lại ấn định stack Next.js + Vercel +
Supabase. Hai thứ này khác nhau.

**Lựa chọn.** Giữ cả hai như hai giai đoạn, không phải hai phương án cạnh tranh. PoC chạy trên
Vercel + Supabase để chứng minh nghiệp vụ. Production chuyển sang ECS + RDS. Mô hình dữ liệu giữ
nguyên vì cả hai đều là PostgreSQL.

Quyết định này **không phát sinh ở LAB-3** — bản brainstorm kiến trúc ở LAB-1 đã chốt sẵn
"MVP/PoC dùng vercel+supabase", nên đây là ghi vết lại chứ không phải đổi hướng.

**Phương án đã bỏ.**

| Phương án | Vì sao bỏ |
|---|---|
| Dựng luôn ECS + RDS cho PoC | Mất nhiều ngày hạ tầng để chứng minh thứ không liên quan tới hạ tầng |
| Giữ Vercel + Supabase cho production | Không đáp ứng được NFR-PRIV-01 nếu không chọn đúng vùng, và khách đã quen vận hành trên AWS |
| Dùng Supabase Edge Functions thay API Route | Khoá chặt vào Supabase, khó chuyển sang ECS về sau |

**Hệ quả.**

- Mô hình dữ liệu chuyển thẳng được: `01_schema.sql` chạy trên RDS không cần sửa
- Phần phải viết lại khi chuyển: lớp xác thực, cấu hình hạ tầng, job nền
- API Route là ranh giới chuyển đổi — giữ chúng thuần Next.js, không gọi API riêng của Supabase
- **Chi phí ẩn:** đội phải hiểu hai môi trường. Tài liệu vận hành phải viết cho môi trường đích,
  không phải môi trường đang chạy

---

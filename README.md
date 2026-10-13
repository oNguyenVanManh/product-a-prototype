# Prototype — Hệ thống hỗ trợ vận hành chợ bán buôn thủy sản

Bản prototype chạy thật cho **Product A** (LAB-3), dựng trên danh sách màn hình, feature list
và user stories đã làm ở LAB-1.

Khách hàng hư cấu: **Công ty CP Chợ Thủy sản Vịnh Sakura** (桜水産市場) — chợ sản xuất
(産地市場) quy mô vừa gần cảng cá, thu mua trực tiếp từ tàu cá.

---

## Truy cập

| | |
|---|---|
| **URL** | **<https://product-a-prototype-smoky.vercel.app>** |
| Mật khẩu chung | `sakura2026` |
| Triển khai trên | Vercel · database Supabase vùng Tokyo |

> ⚠️ **Nếu mở ra thấy trống dữ liệu:** Supabase bản miễn phí tự tạm dừng project sau 7 ngày không
> có truy vấn nào. App vẫn chạy nhưng không đọc được dữ liệu. Chủ dự án vào Supabase dashboard bấm
> **Restore project**, khoảng một phút sau là chạy lại bình thường.

Sáu tài khoản demo, mỗi tài khoản một vai trò nghiệp vụ khác nhau:

| Email | Vai trò | Xem được gì đặc biệt |
|---|---|---|
| `admin@sakura-market.example` | Quản trị hệ thống | Bật/tắt tài khoản, khoá sổ |
| `intake@sakura-market.example` | Tiếp nhận lô | Tiếp nhận lô hàng |
| `judge@sakura-market.example` | Thẩm định | Ghi hạng chất lượng |
| `trade@sakura-market.example` | Chốt giao dịch | Chốt giao dịch, huỷ bằng dòng đảo |
| `delivery@sakura-market.example` | Giao hàng | Ghi nhận giao hàng |
| `settlement@sakura-market.example` | Đối soát | Khoá sổ, tính tiền khuyến khích |

Đăng nhập bằng vai trò **Giao hàng** rồi thử khoá sổ ở màn hình Đối soát — hệ thống sẽ từ chối.
Đó là phân quyền thật ở tầng API, không phải ẩn nút.

### Bốn thứ đáng thử trong 5 phút

| # | Thử gì | Mong đợi |
|---|---|---|
| 1 | Mở URL khi chưa đăng nhập | Tự chuyển về `/login?next=…`, không xem được nội dung nào |
| 2 | Vai trò **Giao hàng** → màn Đối soát → bấm Khoá sổ | Lỗi 403, phân quyền ở tầng API chứ không phải ẩn nút |
| 3 | Vai trò **Chốt giao dịch** → màn Giao dịch → bấm **Huỷ** một dòng | Dòng gốc bị gạch ngang nhưng **vẫn còn trong sổ**, xuất hiện dòng đảo nền đỏ |
| 4 | Vai trò **Đối soát** → màn Tiền khuyến khích → tính cho `2026-09-29` rồi `2026-10-06` | Hai ngày dùng **hai phiên bản biểu suất khác nhau** (v1 1,5% và v2 2,0%) dù bấm cùng lúc |

Thứ 3 và thứ 4 là hai quy tắc nghiệp vụ lõi của đề, đều thi hành bằng trigger ở tầng database —
gọi thẳng API bằng `curl` cũng không lách được.

---

## Công nghệ

| Lớp | Dùng gì |
|---|---|
| Frontend | Next.js 16 App Router · React 19 · TypeScript · Tailwind CSS 4 |
| Backend | Next.js API Routes (12 route) |
| Database | Supabase PostgreSQL — đọc/ghi thật, không hard-code dữ liệu |
| Đăng nhập | Cookie httpOnly có chữ ký HMAC-SHA256 + proxy chặn ở cổng vào |
| Triển khai | Vercel |

Stack này đúng với nhánh PoC đã chốt ở LAB-1: bản production đề xuất ECS Fargate + RDS
PostgreSQL, còn bản MVP/PoC dùng Vercel + Supabase. Không phải đổi kiến trúc giữa chừng.

---

## Ba điểm đáng chú ý

### 1. Giao dịch thỏa thuận là luồng chính, không phải đấu giá

Tên gọi "chợ đấu giá" khiến người ngoài tưởng phiên đấu giá công khai (せり) là nghiệp vụ lõi.
Theo tài liệu khách hàng, phần lớn giá trị giao dịch thật lại đến từ **thỏa thuận trực tiếp giữa
hai bên (相対取引)** — khoảng 90%.

Prototype dựng **cả hai luồng dùng chung một sổ giao dịch**, và đặt tỷ trọng ngay ở màn hình đầu
tiên. Dữ liệu mẫu cũng sinh đúng tỷ lệ 90/10. Một hệ thống chỉ dựng quanh phiên đấu giá sẽ bỏ
sót phần lớn giá trị thật của chợ.

### 2. Sổ ghi-thêm — không sửa, không xoá

Bảng `trade` có trigger ở Supabase **chặn UPDATE và DELETE**. Huỷ một giao dịch không xoá dòng cũ
mà thêm một dòng mới mang số âm, trỏ `reverses_id` về dòng gốc.

Thử ở màn hình Giao dịch: bấm **Huỷ** trên một dòng bất kỳ. Dòng gốc sẽ bị gạch ngang nhưng vẫn
nằm nguyên trong sổ, và một dòng đảo màu đỏ xuất hiện. Bảng đối soát cộng cả số âm nên tổng tiền
tự động đúng mà không cần xoá gì.

### 3. Biểu suất tra theo ngày nghiệp vụ, không lấy bản mới nhất

Có hai phiên bản biểu suất thưởng: 1,5% hiệu lực từ 2026-01-01 và 2,0% từ 2026-10-05.

Ở màn hình **Tiền khuyến khích**, tính thưởng cho ngày `2026-09-29` rồi tính cho `2026-10-06` —
hai ngày dùng hai phiên bản khác nhau, dù bấm nút ở cùng một thời điểm. Phiên bản đã dùng được
lưu lại ở từng dòng kết quả để sau này vẫn tái lập được con số.

Nếu cài sai thành "lấy bản mới nhất", mỗi lần ban quản lý chợ đổi biểu suất thì toàn bộ kết quả
đã chốt của các kỳ trước sẽ đổi theo — sai nghiệp vụ và không giải trình được khi kiểm toán.

---

## Chạy ở máy

```bash
npm install
cp .env.example .env.local      # rồi điền giá trị thật
npm run dev                     # http://localhost:3000
```

### Dựng database

1. Tạo project trên [supabase.com](https://supabase.com)
2. Mở **SQL Editor**, chạy lần lượt:
   - `supabase/01_schema.sql` — 12 bảng, 5 kiểu liệt kê, 4 hàm, 3 trigger
   - `supabase/02_seed.sql` — dữ liệu mẫu 14 ngày
3. Vào **Project Settings → API**, chép `Project URL` và `service_role` key vào `.env.local`

Câu lệnh cuối của `02_seed.sql` in ra bảng kiểm nhanh — tỷ lệ thỏa thuận phải xấp xỉ 90%.

> `.env.local` chứa `service_role` key nên đã được `.gitignore` chặn. Đừng commit file này.

---

## Cấu trúc

```
src/
├── app/
│   ├── page.tsx              Tổng quan — tỷ trọng 90/10
│   ├── login/                SCR-01 đăng nhập
│   ├── parties/              SCR-03 bên tham gia, hai cấp pháp lý
│   ├── lots/                 SCR-05 tiếp nhận + SCR-06 thẩm định
│   ├── trades/               SCR-07 thỏa thuận + SCR-08 danh sách + SCR-09 đấu giá
│   ├── deliveries/           SCR-11 theo dõi + SCR-12 ghi nhận
│   ├── settlement/           SCR-14 đối soát + SCR-15 khoá sổ
│   ├── incentives/           SCR-20 tiền khuyến khích
│   ├── users/                SCR-02 tài khoản và quyền
│   └── api/                  12 API route gọi Supabase
├── components/               nav.tsx · ui.tsx
├── lib/                      supabase.ts · auth.ts
└── proxy.ts                  chặn người chưa đăng nhập
supabase/                     01_schema.sql · 02_seed.sql
```

---

## Tài liệu khác

**LAB-3 — prototype:**

- [`feature-list.md`](./feature-list.md) — làm gì, bỏ gì so với LAB-1, và vì sao
- [`screen-flow.md`](./screen-flow.md) — luồng di chuyển giữa các màn hình
- [`AI-report.md`](./AI-report.md) — cách làm việc với AI, chỗ AI sinh sai

**LAB-4 — bộ thiết kế đầy đủ:** [`specs/`](./specs/)

76 tài liệu theo 6 biểu mẫu chuẩn của công ty (BM-2-901-50/51/52/53/54/63), cấu trúc thư mục theo
QC-01 v1.1.0. Bắt đầu từ [`specs/README.md`](./specs/README.md).

Toàn bộ dữ liệu trong hệ thống là số liệu giả lập.

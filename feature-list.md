# Feature list — bản prototype so với kế hoạch LAB-1

LAB-1 lên kế hoạch **13 nhóm chức năng · 63 chức năng · 30 màn hình · 912 MD**.
Prototype này dựng **12 mã màn hình trên 9 trang**, phủ 7/13 nhóm chức năng.

Dưới đây là đối chiếu từng mục: làm gì, bỏ gì, và vì sao.

---

## 1. Đã làm — chạy thật, có đọc/ghi Supabase

| Mã màn hình LAB-1 | Trang trong prototype | Nhóm | Ghi thật gì vào database |
|---|---|---|---|
| SCR-01 Đăng nhập | `/login` | FEA-02 | Đọc `app_user`, ghi `audit_log` |
| SCR-02 Quản lý tài khoản và quyền | `/users` | FEA-02 | Đọc + cập nhật `app_user` |
| SCR-03 Danh sách và hồ sơ bên tham gia | `/parties` | FEA-01 | Đọc `party` + `party_qualification` |
| SCR-05 Tiếp nhận lô hàng | `/lots` | FEA-03 | Ghi `lot` |
| SCR-06 Ghi kết quả thẩm định | `/lots` | FEA-03 | Ghi `inspection`, cập nhật `lot.status` |
| SCR-07 Chốt giao dịch thỏa thuận | `/trades` | FEA-04 | Ghi `trade` kind=negotiated |
| SCR-08 Danh sách và huỷ giao dịch | `/trades` | FEA-04 | Ghi dòng đảo vào `trade` |
| SCR-09 Ghi kết quả đấu giá | `/trades` | FEA-04 | Ghi `trade` kind=auction |
| SCR-11 Bảng theo dõi giao hàng | `/deliveries` | FEA-05 | Đọc `delivery` |
| SCR-12 Ghi nhận lần giao hàng | `/deliveries` | FEA-05 | Ghi `delivery` |
| SCR-14 Bảng đối soát ngày | `/settlement` | FEA-06 | Tổng hợp từ `trade` + `settlement_day` |
| SCR-15 Khoá ngày nghiệp vụ | `/settlement` | FEA-06 | Cập nhật `settlement_day` |
| SCR-20 Kết quả tính thưởng | `/incentives` | FEA-07 | Ghi `incentive`, đọc `rate_version` |

Ba màn hình gộp chung một trang ở hai chỗ (`/lots` gộp SCR-05+06, `/trades` gộp SCR-07+08+09,
`/settlement` gộp SCR-14+15) vì chúng là các thao tác liên tiếp trên cùng một đối tượng — tách
ra thành trang riêng chỉ làm người dùng phải chuyển qua lại nhiều hơn.

### Ba quy tắc nghiệp vụ được thi hành ở tầng database, không phải ở giao diện

| Quy tắc | Cài ở đâu | Thử thế nào |
|---|---|---|
| Sổ ghi-thêm: không UPDATE/DELETE giao dịch | trigger `trade_no_update` / `trade_no_delete` | Bấm Huỷ ở `/trades` — sinh dòng đảo, dòng gốc còn nguyên |
| Ngày đã khoá sổ thì chặn ghi mới | trigger `trade_guard` | Khoá một ngày ở `/settlement` rồi thử chốt giao dịch vào ngày đó |
| Bên mua phải còn tư cách hợp lệ | hàm `party_is_qualified` trong `trade_guard` | PA-05 bị tạm ngưng — không xuất hiện trong dữ liệu giao dịch |
| Biểu suất tra theo ngày nghiệp vụ | hàm `rate_as_of` + truy vấn ở API | Tính thưởng 2026-09-29 và 2026-10-06 — hai phiên bản khác nhau |

---

## 2. Bỏ ngoài phạm vi prototype — và lý do

### 2.1 Nhóm bỏ hẳn (6/13 nhóm)

| Nhóm LAB-1 | Màn hình | Vì sao bỏ |
|---|---|---|
| FEA-08 Quản lý quy định và biểu suất | SCR-21, SCR-22 | Dữ liệu `rate_version` có sẵn 2 phiên bản để chứng minh quy tắc tra theo ngày. Màn hình tạo/duyệt phiên bản là CRUD có luồng phê duyệt — nhiều công, không chứng minh thêm điều gì về nghiệp vụ |
| FEA-09 Báo cáo và xuất dữ liệu | SCR-23 | 12 báo cáo cố định là công việc lặp, giá trị minh hoạ thấp |
| FEA-10 Kiểm toán và lưu trữ | SCR-25 | Bảng `audit_log` **đã ghi thật** ở mọi thao tác nhạy cảm, chỉ thiếu màn hình tra cứu. Phần khó đã làm, phần dễ bỏ |
| FEA-11 Thông báo | SCR-26, SCR-27 | Cần hạ tầng gửi mail và job nền — ngoài sức một prototype |
| FEA-12 Liên kết hệ thống kế toán | SCR-28 | Phụ thuộc hệ thống kế toán của khách mà bản thân RFP cũng chưa chốt phương thức kết nối |
| FEA-13 Danh mục nền và đồng bộ offline | SCR-29, SCR-30 | Đồng bộ offline cần hàng đợi phía thiết bị, là hạng mục kỹ thuật nặng nhất của cả dự án |

### 2.2 Màn hình bỏ trong nhóm đã làm

| Màn hình | Vì sao bỏ |
|---|---|
| SCR-04 Bảng theo dõi hiệu lực tư cách | Thông tin hiệu lực đã hiển thị ngay trong `/parties` kèm nhãn Sắp hết hạn / Hết hạn / Tạm ngưng |
| SCR-10 Lịch sử sửa kết quả đấu giá | Lịch sử sửa nằm ngay trong sổ giao dịch dưới dạng dòng đảo — đó chính là điểm lợi của sổ ghi-thêm |
| SCR-13 Ghi ngoại lệ giao hàng (có camera) | Chụp ảnh chứng cứ cần lưu trữ tệp. Phần ghi lý do ngoại lệ **đã làm** trong `/deliveries` |
| SCR-16 Tạo yêu cầu điều chỉnh | Luồng phê duyệt nhiều cấp. Bản chất "sửa sau khi chốt" đã thể hiện qua dòng đảo |
| SCR-17 Phê duyệt điều chỉnh | như trên |
| SCR-18 Quản lý tranh chấp | Nghiệp vụ phụ trợ, không chạm vào ba quy tắc lõi |
| SCR-19 Nhập trạng thái thanh toán | Dữ liệu `payment_status` có sẵn trong seed. Màn hình nhập tay là form CRUD đơn giản |
| SCR-24 Cổng tra cứu chỉ-đọc cho bên ngoài | Chính RFP còn mâu thuẫn về việc bên ngoài có tài khoản hay không (giả định ASM-15 của LAB-1 vẫn đang chờ khách trả lời) |

### 2.3 Ứng dụng native

LAB-1 giả định làm **cả web và native** cho 7 màn hình hiện trường (ASM-02), tương đương 67,2 MD.
Prototype **chỉ làm web**, vì đề bài LAB-3 ấn định stack Next.js + Vercel + Supabase.

Các màn hình hiện trường (`/lots`, `/deliveries`) được làm responsive để dùng được trên tablet.

---

## 3. Phần mock — và cần gì nếu làm thật

| Mục | Hiện tại làm gì | Làm thật thì cần gì |
|---|---|---|
| **Đăng nhập** | Cookie ký HMAC, mật khẩu chung một chuỗi trong biến môi trường | Supabase Auth hoặc OIDC nối hệ thống định danh của khách; mật khẩu riêng từng người, băm bcrypt; xác thực hai lớp cho vai trò quản trị (NFR-SEC-01 của LAB-1) |
| **Phiên bản quy định lưỡng thời gian** | Chỉ một chiều: `effective_from` + tra theo ngày nghiệp vụ | Bitemporal đủ: thêm trục thời gian ghi nhận (`recorded_at`) để trả lời được "ngày 15/10 chúng ta *tưởng* biểu suất của ngày 01/10 là bao nhiêu". Cần cho tranh chấp pháp lý |
| **Công thức tính thưởng** | Tỷ lệ × hệ số thuế 110/100, làm tròn xuống | Thứ tự phép tính và cơ sở áp thuế vẫn là câu hỏi chưa được khách trả lời (ASM-10 của LAB-1). Cần một ví dụ tính tay đầy đủ từ khách |
| **Trạng thái thanh toán** | Sinh sẵn trong seed | Nhập tay bởi bộ phận đối soát (đúng giả định ASM-09), hoặc nối hệ thống kế toán nếu khách xác nhận có nguồn dữ liệu |
| **Khối lượng giao dồn** | Ghi từng lần giao, chưa chặn giao vượt hợp đồng | Cộng dồn và chặn khi vượt; xử lý ngoại lệ thiếu/thừa/trả lại theo FR-DEL-02/03 |
| **Dữ liệu** | 20 bên tham gia · 50 lô · ~100 giao dịch · 14 ngày | Chuyển đổi từ dữ liệu thật của chợ. Độ sâu lịch sử cần chuyển vẫn chưa được khách chốt (ASM-06) |
| **Tích hợp bên thứ ba** | Không có | Interface kế toán (IF-ACC-01), gửi mail thông báo, lưu trữ ảnh chứng cứ |
| **Nhật ký kiểm toán** | Ghi thật vào `audit_log` nhưng chưa có màn hình tra cứu | Màn hình tra cứu có bộ lọc, và cơ chế chống sửa nhật ký |

---

## 4. Số liệu đối chiếu

| | LAB-1 lên kế hoạch | Prototype LAB-3 |
|---|---|---|
| Nhóm chức năng | 13 | 7 |
| Màn hình | 30 | 12 mã (9 trang) |
| Bảng dữ liệu | — | 12 |
| API route | — | 12 |
| Nền tảng | Web + Native | Chỉ Web (responsive cho tablet) |
| Effort ước tính | 912 MD | ~1,5 ngày với AI hỗ trợ |

Tỷ lệ phủ màn hình là 12/30 = 40%, nhưng **phủ đủ 3/3 quy tắc nghiệp vụ lõi** mà cả dự án xoay
quanh: sổ ghi-thêm, khoá ngày nghiệp vụ, và tra biểu suất theo ngày. Đó mới là thứ một prototype
cần chứng minh — phần còn lại phần lớn là CRUD.

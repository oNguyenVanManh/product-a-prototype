> Bộ spec-standard **không có biểu mẫu đối chiếu thiết kế với mã nguồn**. File này viết mới theo yêu cầu LAB-4.

---

# Đối chiếu thiết kế với mã nguồn

Mục tiêu học tập LAB-4 yêu cầu *"đối chiếu đúng với bảng dữ liệu đã tạo thật ở LAB-3, phát hiện
được chỗ prototype làm khác thiết kế"*. Tài liệu này là kết quả rà soát đó.

Rà **63 chức năng** và **18 yêu cầu phi chức năng** của LAB-1 với mã nguồn thật của LAB-3.

## Cách phân loại

| Nhãn | Nghĩa | Xử lý |
|---|---|---|
| **Có chủ đích** | Cố tình làm khác, có lý do, đã ghi ở `feature-list.md` của LAB-3 | Ghi vào ADR |
| **Nợ kỹ thuật** | Chưa làm hoặc làm tắt, biết rõ, phải trả trước khi lên production | Vào backlog LAB-5 |
| **Lỗi thật** | Prototype nói đã làm nhưng thực tế không thi hành được | Sửa ngay |

## Tổng hợp

| Loại | Số mục | Đã xử lý ở LAB-4 |
|---|---|---|
| Lỗi thật | 2 | ✅ cả 2 đã sửa |
| Nợ kỹ thuật | 9 | ghi vào backlog |
| Có chủ đích | 6 | ghi vào ADR |
| **Tổng** | **17** | |

Chức năng: **21/63 đã làm** (33%) · 42 chưa làm.
Phi chức năng: **4/18 đáp ứng** (22%) · 3 một phần · 11 chưa.

---

## 1. Lỗi thật — đã sửa ở LAB-4

### L-01 · Hai cấp pháp lý tách bằng enum nhưng không có gì thi hành

| | |
|---|---|
| **Thiết kế nói** | FNC-002 "Hai cấp pháp lý lưu riêng". Tài liệu khách mục 02-08 cấm coi 許可 và 承認 là cùng loại quyền |
| **Mã nguồn làm** | Có 2 giá trị enum riêng trong `qualification_ty`, nhưng **không có ràng buộc nào** buộc 許可 phải thuộc về 仲卸. Database chấp nhận gán giấy phép cho một 買出人 |
| **Vì sao nguy hiểm** | Nó *trông như* đã giải quyết. Đọc schema thấy hai enum riêng thì yên tâm. Ràng buộc thật chỉ tồn tại trong quy ước của dữ liệu mẫu — tức là không tồn tại |
| **Phát hiện bằng** | Grep schema tìm ràng buộc liên kết `qualification_ty` với `party_kind`, không thấy dòng nào |
| **Đã sửa** | Thêm trigger `qualification_matches_party_kind` ở `supabase/03_fix_lab4.sql`, commit `e445db4` |

### L-02 · Giao hàng vượt khối lượng hợp đồng không bị chặn

| | |
|---|---|
| **Thiết kế nói** | FNC-025 "Xác nhận hoàn tất giao hàng", FR-DEL-04/05 yêu cầu giao nhiều lần và cộng dồn |
| **Mã nguồn làm** | Mỗi lần giao ghi độc lập, không ai cộng lại. Một hợp đồng 100 kg nhận được 10 lần giao 100 kg |
| **Vì sao nguy hiểm** | Sai số lan thẳng xuống bảng đối soát và tính thưởng. Và không có cảnh báo nào |
| **Phát hiện bằng** | Đọc `api/deliveries/route.ts`, thấy chỉ kiểm `delivered_kg > 0` |
| **Đã sửa** | Thêm trigger `delivery_not_exceed_trade` cộng dồn, trừ dòng đảo, và chặn luôn khi ngày đã khoá sổ. Cùng commit `e445db4` |

---

## 2. Nợ kỹ thuật — vào backlog LAB-5

| Mã | Thiết kế yêu cầu | Prototype | Mức | Vì sao chưa làm |
|---|---|---|---|---|
| **N-01** | NFR-SEC-01 — MFA bắt buộc cho quản trị và vai trò phê duyệt | Mật khẩu chung một chuỗi, không MFA | **Cao** | PoC cần đổi vai trò nhanh để minh hoạ phân quyền |
| **N-02** | FNC-008/009/010 — xác thực đa yếu tố, hết hạn phiên, khoá tạm khi sai nhiều lần | Chỉ có hết hạn phiên 8 tiếng | **Cao** | như trên |
| **N-03** | Quy định lưỡng thời gian | Chỉ một trục `effective_from` | **Cao** | Kéo theo đổi mô hình truy vấn toàn bộ phần tính thưởng |
| **N-04** | NFR-AVL-02 — tiếp nhận lô và ghi giao hàng chạy offline | Không có | **Cao** | Phụ thuộc quyết định có làm native hay không (ADR-008) |
| **N-05** | FNC-048 + R-10 — nhật ký kiểm toán không được sửa | `audit_log` ghi thật nhưng **UPDATE/DELETE được** | **Cao** | Bỏ sót. Cùng loại lỗi với L-01 |
| **N-06** | FEA-12 — interface kế toán IF-ACC-01 | Không có | Trung bình | Phương thức kết nối vẫn là giả định ASM-14, khách chưa xác nhận |
| **N-07** | FEA-11 — thông báo trong ứng dụng và email | Không có | Trung bình | Cần hạ tầng gửi mail và job nền |
| **N-08** | FNC-049 — màn hình tra cứu nhật ký kiểm toán | Dữ liệu có, màn hình chưa | Trung bình | Phần khó đã làm, phần dễ bỏ |
| **N-09** | NFR-RET-01 — ảnh lưu 3 năm rồi chuyển lưu trữ lạnh | Không có lưu trữ ảnh | Thấp | SCR-13 chưa làm |

**N-05 đáng chú ý nhất.** Nó cùng dạng với L-01: thứ gì đó *trông như* đã làm. Bảng `audit_log`
ghi đầy đủ mọi thao tác nhạy cảm, nhưng người có quyền ghi database xoá được dấu vết của chính
mình. Với hệ thống mà lý do tồn tại là giải trình khi kiểm toán, đây là chỗ hở thật. Chưa sửa ở
LAB-4 vì nằm ngoài hai lỗi đã cam kết, nhưng nên ưu tiên cao ở LAB-5.

---

## 3. Khác có chủ đích — đã ghi vào ADR

| Mã | Thiết kế | Prototype | ADR |
|---|---|---|---|
| C-01 | ECS Fargate + RDS Multi-AZ, ap-northeast-1 | Vercel + Supabase | [ADR-004](./decisions/ADR-004-vercel-supabase-poc.md) |
| C-02 | Native cho 7 màn hiện trường, 67,2 MD | Chỉ web responsive | [ADR-008](./decisions/ADR-008-bo-native-khoi-poc.md) |
| C-03 | 30 màn hình | 12 mã màn hình trên 9 trang | `feature-list.md` |
| C-04 | 63 chức năng | 21 chức năng | `feature-list.md` |
| C-05 | Auth.js + TOTP | Cookie HMAC tự viết | [ADR-004](./decisions/ADR-004-vercel-supabase-poc.md) hệ quả |
| C-06 | SCR-16/17 yêu cầu điều chỉnh có phê duyệt | Dòng đảo trực tiếp | [ADR-001](./decisions/ADR-001-so-ghi-them.md) |

**C-06 cần xem lại khi lên production.** Dòng đảo giải quyết được *bản chất* của việc sửa sau
chốt, nhưng thiết kế LAB-1 còn đòi **luồng phê duyệt** — người đề nghị khác người duyệt (giả định
ASM-12). Hiện bất kỳ ai có vai trò chốt giao dịch đều đảo được, không cần ai duyệt.

---

## 4. Đối chiếu 63 chức năng

Ký hiệu: ✅ đã làm · ◐ làm một phần · ❌ chưa làm

| Nhóm | Chức năng | Trạng thái |
|---|---|---|
| **FEA-01** Bên tham gia | FNC-001 hồ sơ ✅ · FNC-002 hiệu lực ✅ · FNC-003 kiểm tại chốt ✅ · FNC-004 bảng theo dõi ◐ gộp vào `/parties` · FNC-005 job quét sắp hết hạn ❌ · FNC-006 cổng bên ngoài ❌ | 3✅ 1◐ 2❌ |
| **FEA-02** Xác thực | FNC-007 đăng nhập ✅ · FNC-008 MFA ❌ · FNC-009 phiên ◐ chỉ hết hạn · FNC-010 khoá tạm ❌ · FNC-011 quản lý tài khoản ✅ · FNC-012 kiểm quyền ◐ chỉ ở khoá sổ và bật/tắt · FNC-013 job dọn phiên ❌ | 2✅ 2◐ 3❌ |
| **FEA-03** Lô và thẩm định | FNC-014 tiếp nhận ✅ · FNC-015 thẩm định ✅ · FNC-016 trừ tồn ✅ · FNC-017 điều chỉnh lô ❌ | 3✅ 1❌ |
| **FEA-04** Giao dịch | FNC-018 thỏa thuận ✅ · FNC-019 từ chối khi thiếu điều kiện ✅ · FNC-020 huỷ ✅ · FNC-021 đấu giá ✅ · FNC-022 lịch sử sửa ◐ hiện trong sổ | 4✅ 1◐ |
| **FEA-05** Giao hàng | FNC-023 bảng theo dõi ✅ · FNC-024 ghi từng lần ✅ · FNC-025 xác nhận hoàn tất ✅ *(sửa ở LAB-4)* · FNC-026 ảnh chứng cứ ❌ · FNC-027 đối chiếu quyết toán ◐ · FNC-028 job tồn đọng ❌ | 3✅ 1◐ 2❌ |
| **FEA-06** Đối soát | FNC-029 bảng đối soát ✅ · FNC-030 khoá ngày ✅ · FNC-031 chặn sửa ngày đã khoá ✅ · FNC-032 yêu cầu điều chỉnh ❌ · FNC-033 phê duyệt + bút toán đảo ◐ có đảo, không có duyệt · FNC-034 tranh chấp ❌ | 3✅ 1◐ 2❌ |
| **FEA-07** Tiền khuyến khích | FNC-035 nhập thanh toán ❌ · FNC-036 tính thưởng ✅ · FNC-037 batch cuối kỳ ❌ · FNC-038 chênh lệch kỳ sau ❌ · FNC-039 màn hình kết quả ✅ | 2✅ 3❌ |
| **FEA-08** Quy định | FNC-040 tạo phiên bản ❌ · FNC-041 quay lui ❌ · FNC-042 tra theo ngày ✅ · FNC-043 nhật ký ❌ | 1✅ 3❌ |
| **FEA-09** Báo cáo | FNC-044..047 ❌ | 4❌ |
| **FEA-10** Kiểm toán | FNC-048 ghi nhật ký ✅ · FNC-049 tra cứu ❌ · FNC-050 job lưu lạnh ❌ · FNC-051 job chất lượng dữ liệu ❌ | 1✅ 3❌ |
| **FEA-11** Thông báo | FNC-052..055 ❌ | 4❌ |
| **FEA-12** Kế toán | FNC-056..058 ❌ | 3❌ |
| **FEA-13** Danh mục, offline | FNC-059..063 ❌ | 5❌ |

**Tổng: 21 ✅ · 8 ◐ · 34 ❌**

---

## 5. Đối chiếu 18 yêu cầu phi chức năng

| Mã | Yêu cầu | Trạng thái | Ghi chú |
|---|---|---|---|
| NFR-AVL-01 | 99,5% trong 02:00–10:00 JST | ◐ | Theo SLA mặc định của Vercel, chưa đo |
| NFR-AVL-02 | Tiếp nhận lô và giao hàng chạy offline | ❌ | Không có bất kỳ hình thức nào — N-04 |
| NFR-AVL-03 | RTO 4h / RPO 15 phút | ◐ | Supabase sao lưu mặc định, chưa diễn tập khôi phục |
| NFR-PERF-01 | Tra cứu p95 ≤ 2 giây | ❓ | Chưa đo. Dữ liệu mẫu quá nhỏ để kết luận |
| NFR-PERF-02 | Tải FIG-LOAD-01 không làm chậm giao dịch | ❓ | Chưa kiểm thử tải |
| NFR-SEC-01 | MFA cho quản trị | ❌ | N-01 |
| NFR-SEC-03 | Hết hạn phiên, khoá tạm, ghi log bất thường | ◐ | Chỉ có hết hạn phiên |
| NFR-SEC-04 | TLS, khoá bí mật tách khỏi mã nguồn | ✅ | `.env.local` bị `.gitignore` chặn, đã kiểm |
| NFR-PRIV-01 | Dữ liệu đặt tại vùng Nhật | ❓ | Phụ thuộc vùng chọn khi tạo Supabase project |
| NFR-RET-01 | Dữ liệu 7 năm, ảnh 3 năm rồi lưu lạnh | ❌ | N-09 |
| NFR-OPS-01 | Giám sát lỗi batch, xuất dữ liệu, thông báo | ❌ | Chưa có batch nào để giám sát |
| NFR-OPS-02 | Đổi quy định bằng cấu hình, không sửa dữ liệu lịch sử | ✅ | `rate_version` + `rate_as_of` |
| NFR-USE-01 | Thao tác được bằng bàn phím | ◐ | Form HTML chuẩn nên dùng được, chưa kiểm thử khả dụng |
| NFR-COMP-01 | 2 trình duyệt evergreen + tablet ≥10 inch | ✅ | Responsive, bảng có cuộn ngang |
| NFR-COMP-02 | iOS 16+ / Android 12+ | ❌ | Đã bỏ native — ADR-008 |
| NFR-A11Y-01 | WCAG 2.1 mức A | ❓ | Có nhãn form và cấu trúc ngữ nghĩa, chưa kiểm thử |
| NFR-BATCH-01 | Báo cáo ngày xong trước 11:00 JST | ❌ | Chưa có báo cáo |
| NFR-REL-01 | Phát hành qua App Store và Google Play | ❌ | Đã bỏ native |

**4 ✅ · 4 ◐ · 6 ❌ · 4 ❓ chưa đo**

Bốn mục ❓ không phải "chưa làm" mà là **chưa có bằng chứng**. Đây là khác biệt quan trọng khi
đưa vào backlog: việc cần làm là *đo*, không phải *xây*.

---

## 6. Thứ tự ưu tiên đề xuất cho LAB-5

| Ưu tiên | Mục | Lý do |
|---|---|---|
| 1 | N-05 nhật ký kiểm toán không sửa được | Cùng dạng lỗi với L-01, chạm trực tiếp vào lý do hệ thống tồn tại |
| 2 | R-05, R-06 ràng buộc dòng đảo | Hiện chỉ kiểm ở tầng API, lách được |
| 3 | N-01, N-02 xác thực | Chặn go-live, không thương lượng được |
| 4 | R-03, R-10 các ràng buộc còn thiếu | Rẻ, làm nhanh |
| 5 | N-03 lưỡng thời gian | Đắt nhưng cần trước khi có tranh chấp tiền thật |
| 6 | C-06 luồng phê duyệt điều chỉnh | Cần khách xác nhận ASM-12 trước |
| 7 | N-06, N-07 interface kế toán và thông báo | Phụ thuộc bên ngoài |
| 8 | Bốn mục ❓ — đo hiệu năng và khả năng tiếp cận | Cần môi trường có dữ liệu thật |

---

## 7. Kết quả kiểm chứng trên database thật

Ngày 2026-10-11, sau khi nạp schema và dữ liệu mẫu lên Supabase (vùng Tokyo), toàn bộ quy tắc
nghiệp vụ được kiểm bằng cách gọi thẳng REST API của Supabase bằng khoá `service_role` — tức
**bỏ qua hoàn toàn tầng ứng dụng**. Đây là phép thử đúng nghĩa cho ADR-002: nếu quy tắc chỉ nằm ở
tầng API thì những lệnh dưới đây đều lọt.

### 7.1 Dữ liệu đã nạp

| Bảng | Số dòng | | Chỉ số | Giá trị |
|---|---|---|---|---|
| `party` | 20 | | tỷ lệ 相対取引 | **87,8%** |
| `party_qualification` | 11 | | dòng đảo | 1 |
| `lot` | 48 | | ngày đã khoá sổ | 3 |
| `inspection` | 48 | | | |
| `trade` | 67 | | | |
| `delivery` | 66 | | | |
| `settlement_day` | 12 | | | |
| `rate_version` | 2 | | | |
| `payment_status` | 52 | | | |

Tỷ lệ 87,8% dao động quanh 90% vì script seed dùng `random()` cho khối lượng và số lần bán mỗi lô.

### 7.2 Sáu lệnh ghi vi phạm — cả sáu đều bị chặn

| # | Lệnh thử | Kết quả | Thông điệp từ trigger |
|---|---|---|---|
| 1 | Gán 許可 cho BY-01 (買出人) | ✅ chặn | *Giấy phép 許可 chỉ cấp cho 仲卸, không cấp cho buyer.* |
| 2 | Gán 承認 cho một 仲卸 | ✅ chặn | *Chấp thuận 承認 chỉ cấp cho 売買参加者, không cấp cho intermediate.* |
| 3 | `UPDATE` bảng `trade` | ✅ chặn | *Bảng trade là sổ ghi-thêm: không được UPDATE.* |
| 4 | `DELETE` bảng `trade` | ✅ chặn | *Bảng trade là sổ ghi-thêm: không được DELETE.* |
| 5 | Chốt giao dịch vào ngày đã khoá | ✅ chặn | *Ngày nghiệp vụ 2026-09-28 đã khoá sổ.* |
| 6 | Ghi giao hàng vượt hợp đồng | ✅ chặn | xem 7.3 |

Sau khi chạy hết, số dòng của `trade`, `party_qualification` và `delivery` **không đổi** — không
lệnh vi phạm nào để lại dữ liệu bẩn.

### 7.3 Phép cộng dồn giao hàng — kiểm ở biên

Lần thử đầu bốc trúng giao dịch đã bị đảo trong dữ liệu mẫu, nên bị chặn vì *"đã bị huỷ"* chứ chưa
thực sự kiểm phép cộng dồn. Chạy lại với giao dịch chưa đảo, thuộc ngày chưa khoá sổ:

| Thử | Kết quả |
|---|---|
| Giao gấp 10 lần hợp đồng (502 kg / 50,2 kg) | ✅ chặn — *đã giao 50,20 kg, lần này 502,00 kg, hợp đồng chỉ 50,20 kg* |
| Giao vượt **đúng 0,01 kg** | ✅ chặn — thông điệp tương tự |

Chặn đúng tới đơn vị nhỏ nhất, và thông điệp nêu đủ ba con số để người dùng hiểu ngay vì sao.

### 7.4 ADR-003 — tra biểu suất theo ngày nghiệp vụ

Gọi API tính thưởng hai lần liên tiếp, **cùng một thời điểm**, chỉ khác ngày nghiệp vụ:

| Ngày nghiệp vụ | Phiên bản được dùng | Tỷ lệ | Hiệu lực từ |
|---|---|---|---|
| 2026-09-29 | **v1** | 1,5% | 2026-01-01 |
| 2026-10-06 | **v2** | 2,0% | 2026-10-05 |

Nếu cài sai thành "lấy bản mới nhất" thì cả hai ngày đều ra v2. Đây là bằng chứng trực tiếp cho
ADR-003.

### 7.5 Phân quyền và bảo vệ cổng vào

| Thử | Kết quả |
|---|---|
| Vai trò Giao hàng gọi API khoá sổ | ✅ HTTP 403 — *Chỉ bộ phận đối soát hoặc quản trị mới được khoá sổ* |
| Gọi `/api/trades` khi chưa đăng nhập | ✅ HTTP 401 — *Chưa đăng nhập* |

### 7.6 Cập nhật bốn mục trước đây "chưa đo"

| Mã | Trước | Sau khi kiểm |
|---|---|---|
| NFR-SEC-04 | ✅ | giữ nguyên — `.env.local` bị `.gitignore` chặn, đã xác nhận |
| NFR-PRIV-01 | ❓ | ✅ **đã đáp ứng** — project Supabase tạo ở vùng Northeast Asia (Tokyo) |
| NFR-PERF-01/02 | ❓ | vẫn ❓ — 67 giao dịch quá ít để kết luận. Cần bộ dữ liệu theo FIG-LOAD-01 |
| NFR-A11Y-01 | ❓ | vẫn ❓ — cần chạy công cụ kiểm tự động |

### 7.7 Một khiếm khuyết phát hiện trong lúc kiểm

Khi `.env.local` chưa điền, API đăng nhập ném lỗi chưa bắt, Next.js trả về trang HTML thay vì
JSON. Trang login gọi `r.json()` nên nghẹn, nút kẹt ở *"Đang kiểm tra…"* và **không hiện lỗi gì**.

Người dùng không có cách nào biết nguyên nhân. Đã sửa: API bọc `try/catch` trả JSON kèm thông điệp
gốc, trang login đọc dạng text trước rồi mới phân tích, và `setBusy(false)` chuyển vào `finally`.

Bài học cùng loại với L-01 và N-05: **thứ gì đó hỏng im lặng thì tệ hơn thứ hỏng ồn ào.**

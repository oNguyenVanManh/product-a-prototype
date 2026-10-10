# ADR — Architecture Decision Records

Tám quyết định kiến trúc đứng sau prototype. Mỗi quyết định ghi đủ bốn mục: bối cảnh, lựa chọn,
phương án đã bỏ, hệ quả.

| # | Quyết định | Trạng thái |
|---|---|---|
| [ADR-001](#adr-001) | Sổ giao dịch ghi-thêm, sửa bằng dòng đảo | Đã áp dụng |
| [ADR-002](#adr-002) | Quy tắc nghiệp vụ đặt ở tầng database | Đã áp dụng |
| [ADR-003](#adr-003) | Tra quy định theo ngày nghiệp vụ | Đã áp dụng, còn khuyết |
| [ADR-004](#adr-004) | Vercel + Supabase cho PoC, ECS + RDS cho production | Đã áp dụng |
| [ADR-005](#adr-005) | Một bảng giao dịch cho cả hai luồng | Đã áp dụng |
| [ADR-006](#adr-006) | Hai cấp pháp lý tách bảng riêng | Đã áp dụng |
| [ADR-007](#adr-007) | Thẩm định giữ người trong vòng lặp | Đã áp dụng |
| [ADR-008](#adr-008) | Bỏ ứng dụng native khỏi phạm vi PoC | Đã áp dụng |

---

## ADR-001 {#adr-001}
### Sổ giao dịch ghi-thêm, sửa bằng dòng đảo

**Bối cảnh.** Tài liệu khách yêu cầu dữ liệu đã chốt phải giải trình được khi kiểm toán
(FR-CORR-02), và dữ liệu sau khi khoá sổ không được sửa trực tiếp (BR-CLOSE-01). Chợ vừa tự ban
hành quy tắc vận hành riêng sau sửa đổi luật 2020, nên khả năng bị soi lại là có thật. Đồng thời
nghiệp vụ chợ có sai sót hàng ngày — nhập nhầm khối lượng, nhầm bên mua — nên phải sửa được.

**Lựa chọn.** Bảng `trade` chỉ cho INSERT. Huỷ hoặc sửa một giao dịch = thêm dòng mới có
`reverses_id` trỏ về dòng gốc, `quantity_kg` và `amount` mang dấu âm. Dòng gốc không bao giờ đổi.

**Phương án đã bỏ.**

| Phương án | Vì sao bỏ |
|---|---|
| Cột `is_cancelled` + UPDATE | Mất thông tin ai huỷ lúc nào vì sao. Và một khi đã cho UPDATE thì không có gì ngăn sửa tiếp các cột khác |
| Bảng lịch sử riêng `trade_history` | Phải đồng bộ hai bảng bằng trigger. Truy vấn tổng tiền phải hợp nhất hai nguồn, dễ lệch |
| Event sourcing đầy đủ | Đúng về lý thuyết nhưng nặng quá mức cho quy mô 1.200 giao dịch/ngày. Mọi truy vấn đơn giản đều phải dựng lại trạng thái |

**Hệ quả.**

- Tổng tiền một ngày là `SUM(amount)` — cộng cả số âm nên ra số ròng đúng, không cần mệnh đề loại trừ
- Mọi truy vấn **đếm số giao dịch** phải nhớ lọc `reverses_id IS NULL`, nếu không sẽ đếm cả dòng đảo. Đây là cái bẫy cho người mới, phải ghi rõ trong tài liệu dev
- Bảng `trade` lớn nhanh hơn. Ở tải thiết kế, sau 7 năm vượt 3 triệu dòng — cần phân mảnh theo năm
- Một dòng gốc chỉ được đảo một lần. Hiện kiểm ở tầng API, **chưa có ràng buộc UNIQUE** (xem [02-database.md](./02-database.md) mục R-06)

---

## ADR-002 {#adr-002}
### Quy tắc nghiệp vụ đặt ở tầng database, không ở tầng ứng dụng

**Bối cảnh.** Ba quy tắc lõi — không sửa sổ, không ghi vào ngày đã khoá, bên mua phải còn tư cách
— là lý do hệ thống tồn tại. Nếu chúng chỉ là câu `if` trong API route thì gọi thẳng database,
chạy script sửa dữ liệu, hoặc một API route viết sau quên kiểm đều lách được.

**Lựa chọn.** Thi hành bằng trigger và hàm trong PostgreSQL. Tầng ứng dụng chỉ chuyển tiếp thông
điệp lỗi do trigger ném ra cho người dùng đọc.

**Phương án đã bỏ.**

| Phương án | Vì sao bỏ |
|---|---|
| Kiểm ở tầng service trong mã ứng dụng | Lách được. Và mỗi lần thêm đường ghi mới lại phải nhớ kiểm lại |
| Row Level Security của Supabase | RLS tốt cho phân quyền theo hàng, không diễn đạt được quy tắc "chỉ INSERT, cấm UPDATE" hay "cộng dồn rồi so với hợp đồng" |
| Thủ tục lưu trữ cho mọi thao tác ghi | Dồn quá nhiều logic xuống database, khó kiểm thử và khó đọc |

**Hệ quả.**

- Quy tắc không lách được, kể cả khi thao tác trực tiếp trên database
- Thông điệp lỗi viết bằng tiếng Việt ngay trong SQL, hiện thẳng lên giao diện — người dùng hiểu ngay vì sao bị chặn
- **Đổi lại:** logic nghiệp vụ nằm ở hai nơi. Người đọc mã TypeScript không thấy được quy tắc. Bắt buộc phải có tài liệu này
- Kiểm thử quy tắc cần database thật, không mock được
- Chuyển sang database khác sẽ phải viết lại phần trigger

---

## ADR-003 {#adr-003}
### Tra quy định theo ngày nghiệp vụ, không lấy bản mới nhất

**Bối cảnh.** GOV-RULE-01 cho phép ban quản lý chợ đổi biểu suất thưởng tối đa 4 lần mỗi năm.
Tiền khuyến khích là tiền thật trả cho bên tham gia. Nếu đổi biểu suất hôm nay mà kết quả đã chốt
của tháng trước đổi theo thì không giải trình được khi kiểm toán.

**Lựa chọn.** Hàm `rate_as_of(ngày)` lấy phiên bản có `effective_from <= ngày`, sắp xếp giảm dần,
lấy một bản. Số phiên bản đã dùng lưu vào cột `incentive.rate_version_no` của từng dòng kết quả.

**Phương án đã bỏ.**

| Phương án | Vì sao bỏ |
|---|---|
| Lấy biểu suất mới nhất | Sai nghiệp vụ. Và sai một cách im lặng: mã vẫn chạy, vẫn ra số, không báo lỗi gì |
| Sao chép biểu suất vào từng dòng khi tính | Chống được hồi tố nhưng mất khả năng kiểm chứng ngược — không biết số đó lấy từ phiên bản nào |
| Lưỡng thời gian đầy đủ | Đúng nhất nhưng kéo theo đổi mô hình truy vấn toàn bộ phần tính thưởng. Để lại cho bản production |

**Hệ quả.**

- Tính lại một ngày cũ luôn ra cùng kết quả, bất kể đã đổi biểu suất bao nhiêu lần
- Cột `rate_version_no` cho phép tái lập con số khi bị chất vấn
- **Khuyết còn lại:** chỉ có một trục thời gian. Không trả lời được *"ngày 15/10 ta tưởng biểu
  suất ngày 01/10 là bao nhiêu"*. Nếu khách ban hành quy định có hiệu lực hồi tố, lỗ hổng này
  thành vấn đề thật. Xếp vào nợ kỹ thuật — chi tiết ở [02-database.md](./02-database.md) mục 4.1

---

## ADR-004 {#adr-004}
### Vercel + Supabase cho PoC, ECS Fargate + RDS cho production

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

## ADR-005 {#adr-005}
### Một bảng giao dịch cho cả 相対取引 và せり

**Bối cảnh.** Tên gọi "chợ đấu giá" làm người ngoài tưởng phiên đấu giá là nghiệp vụ chính. Thực
tế thỏa thuận trực tiếp chiếm khoảng 90% giá trị. Cả hai đều là giao dịch có hiệu lực pháp lý như
nhau, cùng chịu quy tắc khoá sổ, cùng vào bảng đối soát, cùng tính thưởng.

**Lựa chọn.** Một bảng `trade`, cột `kind` phân biệt hai loại. Cột `hand_sign` chỉ có nghĩa với
dòng đấu giá, để null với dòng thỏa thuận.

**Phương án đã bỏ.**

| Phương án | Vì sao bỏ |
|---|---|
| Hai bảng `negotiated_trade` và `auction_trade` | Mọi báo cáo, phép đối soát, quy tắc khoá sổ phải viết hai lần. Tỷ trọng 90/10 không tính được bằng một truy vấn |
| Bảng chung + bảng mở rộng cho đấu giá | Đúng về chuẩn hoá nhưng thêm một phép nối cho đúng một cột |
| Dựng "auction engine" làm trung tâm | Chính là cái bẫy của đề. Làm vậy là bỏ sót 90% giá trị thật |

**Hệ quả.**

- Tỷ trọng tính được bằng một truy vấn, hiển thị ngay màn hình đầu
- Mọi quy tắc viết một lần, áp cho cả hai luồng
- **Đổi lại:** một cột thưa (`hand_sign` null với 90% số dòng). Chấp nhận được
- Nếu sau này đấu giá phát sinh nhiều thuộc tính riêng (thời điểm bắt đầu phiên, người điều khiển,
  giá khởi điểm), sẽ phải xem lại quyết định này

---

## ADR-006 {#adr-006}
### Hai cấp pháp lý tách bảng riêng, có ràng buộc đúng cặp vai trò

**Bối cảnh.** Mục 02-08 tài liệu khách phân biệt 許可 (giấy phép, cấp cho 仲卸, thủ tục xét duyệt
nặng) và 承認 (chấp thuận, cấp cho 売買参加者, thủ tục nhẹ hơn). Tài liệu cấm đích danh việc coi
hai thứ này là cùng một loại quyền. 買出人 không có tư cách giao dịch trực tiếp, phải mua qua
trung gian.

**Lựa chọn.** Bảng `party_qualification` riêng, kiểu `qualification_ty` hai giá trị, trigger
`qualification_kind_check` buộc đúng cặp vai trò.

**Phương án đã bỏ.**

| Phương án | Vì sao bỏ |
|---|---|
| Cờ `can_trade` trên bảng `party` | Gộp hai cấp thành một — chính điều tài liệu khách cấm |
| Hai cột `permit_no` và `approval_no` trên `party` | Mất lịch sử. Và không kiểm được tư cách "vào ngày nghiệp vụ D" |
| Chỉ tách enum, không ràng buộc | **Đây là cách PoC làm ban đầu** — nhìn như đã tách nhưng database vẫn cho gán 許可 cho một 買出人. Phát hiện ở LAB-4, đã sửa |

**Hệ quả.**

- Kiểm tư cách hỏi được **"vào ngày nghiệp vụ D"**, nên giao dịch hôm qua vẫn hợp lệ dù giấy phép
  hết hạn sáng nay
- Màn hình chốt giao dịch chỉ liệt kê 仲卸 và 売買参加者 trong ô chọn bên mua — hệ quả trực tiếp
  của mô hình, không phải lọc cho gọn
- **Bài học:** tách enum mà không có ràng buộc thi hành thì chỉ là tách trên giấy. Cái bẫy ở đây
  là nó *trông như* đã giải quyết

---

## ADR-007 {#adr-007}
### Thẩm định độ tươi giữ người trong vòng lặp

**Bối cảnh.** CAP-HUMAN-01 liệt kê bốn thao tác buộc phải giữ con người. SCOPE-OUT-01 loại việc
tự động chấm điểm chất lượng ra khỏi phạm vi. Thẩm định độ tươi bằng mắt tại bến là kinh nghiệm
nghề, không phải phép tính.

**Lựa chọn.** Bảng `inspection` chỉ có hạng do người chọn (A/B/C), ghi chú, và tên người thẩm
định. Cố tình **không có** cột điểm do máy tính ra.

**Phương án đã bỏ.**

| Phương án | Vì sao bỏ |
|---|---|
| Thêm cột gợi ý của hệ thống để người xác nhận | Trông vô hại nhưng tạo neo tâm lý. Và mở đường cho "bật chế độ tự động" sau này — đúng thứ SCOPE-OUT-01 cấm |
| Chấm điểm từ ảnh | Ngoài phạm vi, và không ai chịu trách nhiệm khi sai |

**Hệ quả.**

- Luôn truy được ai đã thẩm định lô nào
- Cấu trúc bảng tự nó **ngăn** việc thêm tự động hoá sau này mà không ai để ý — muốn thêm phải sửa
  schema, tức là phải có người duyệt
- Năng suất phụ thuộc người. Đây là lựa chọn của khách, không phải giới hạn kỹ thuật

---

## ADR-008 {#adr-008}
### Bỏ ứng dụng native khỏi phạm vi PoC

**Bối cảnh.** LAB-1 giả định làm cả web và native cho 7 màn hình hiện trường (ASM-02, 67,2 MD
ròng), kèm NFR-COMP-02 (iOS 16+, Android 12+) và NFR-REL-01 (phát hành qua App Store và Google
Play). Nhưng tài liệu khách **không yêu cầu native ở bất kỳ đâu** — NFR-COMP-01 chỉ nói "chạy
trên trình duyệt hiện hành và hỗ trợ tablet". LAB-3 lại ấn định stack web.

**Lựa chọn.** PoC chỉ làm web, các màn hình hiện trường làm responsive để dùng được trên tablet.
Native vẫn giữ trong phạm vi production như một tuỳ chọn cần khách xác nhận.

**Phương án đã bỏ.**

| Phương án | Vì sao bỏ |
|---|---|
| Làm native song song | Ngoài stack LAB-3 ấn định, và tốn 67 MD cho thứ khách chưa yêu cầu |
| Bỏ native hẳn khỏi cả bản production | Chưa đủ căn cứ. NFR-AVL-02 đòi tiếp nhận lô và ghi giao hàng chạy offline — PWA làm được một phần nhưng hàng đợi dài và đồng bộ xung đột thì native vững hơn |
| Dựng PWA có hàng đợi offline ngay ở PoC | Đáng làm nhưng là hạng mục kỹ thuật nặng nhất, không chứng minh thêm gì về nghiệp vụ |

**Hệ quả.**

- Cắt 67,2 MD khỏi phạm vi PoC
- NFR-AVL-02 (chạy offline) **chưa được đáp ứng bằng bất kỳ hình thức nào** — đây là khoảng trống
  thật, không phải chỉ là hoãn
- NFR-COMP-02 và NFR-REL-01 treo cho tới khi khách xác nhận có cần ứng dụng cài đặt hay không
- Câu hỏi này nên đưa vào vòng hỏi đáp với khách trước khi chốt báo giá production

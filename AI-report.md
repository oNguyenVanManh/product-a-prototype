# AI report — cách dùng AI ở LAB-3

## 1. Công cụ và cách ra lệnh

| Công cụ | Dùng để làm gì |
|---|---|
| Claude Code (Opus 5) | Sinh toàn bộ mã nguồn, schema SQL, dữ liệu mẫu và 4 tài liệu này |
| `/tkm:help` | Hỏi bước tiếp theo sau khi xong LAB-2, trước khi bắt tay vào LAB-3 |
| `create-next-app` | Dựng khung Next.js 16 + TypeScript + Tailwind |
| `openpyxl` + `python-pptx` | Đọc lại output LAB-1 (screen list, user stories, feature list) làm đầu vào |
| `npx tsc --noEmit` | Kiểm kiểu trước khi compile |
| `gh` CLI | Tạo repo và đẩy mã nguồn |

### Cách ra lệnh — điểm khác so với LAB-1 và LAB-2

Ở hai lab trước, phần lớn lệnh là **"sinh ra tài liệu X"**. Ở lab này, lệnh hiệu quả nhất lại là
**"đọc đầu ra cũ rồi suy ra đầu vào mới"**:

> Đọc `output/project_a/final/product_a_screen_list.xlsx` lấy đủ 30 màn hình, đề xuất 10 màn
> cho prototype, giải thích vì sao chọn và vì sao bỏ.

Khác biệt quan trọng: không đưa cho AI một tờ giấy trắng. LAB-1 đã sinh ra 30 màn hình có mã, có
nhóm, có vai trò — bắt AI bám đúng bộ mã đó thì prototype mới truy vết ngược về estimation được,
và `feature-list.md` mới có cái để đối chiếu.

### Chặn một cái bẫy ngay trong đề bài

Đề bài LAB-3 gợi ý cho Product A: *"màn hình ghi nhận kết quả phiên đấu giá tại chợ + màn hình
quản lý vai trò/phân quyền"*.

Làm đúng hai màn đó là rơi vào đúng cái bẫy mà tài liệu khách hàng cài sẵn: tên gọi "chợ đấu giá"
làm người ngoài tưởng đấu giá là nghiệp vụ chính, trong khi thực tế **thỏa thuận trực tiếp
(相対取引) chiếm khoảng 90% giá trị**.

Nên phạm vi được chốt lại là **cả hai luồng dùng chung một sổ giao dịch**, và tỷ trọng 90/10 được
đặt ngay ở màn hình đầu tiên. Dữ liệu mẫu cũng sinh đúng tỷ lệ đó. Đây là quyết định của con
người, không phải của AI — AI đi theo đề bài thì đã dựng mỗi màn đấu giá.

---

## 2. Con người tham gia review ở giai đoạn nào

| Giai đoạn | Người làm gì |
|---|---|
| Chốt phạm vi | Chọn 10 màn hình, bác gợi ý "chỉ làm màn đấu giá" của đề bài |
| Duyệt schema | Đọc `01_schema.sql` trước khi cho viết một dòng mã ứng dụng nào |
| Sau mỗi cụm mã | Chạy `tsc --noEmit` rồi compile, không để dồn đến cuối |
| Trước khi đẩy mã | Kiểm `.gitignore` có chặn `.env.local` không |

Điểm quan trọng nhất là **duyệt schema trước khi viết giao diện**. Schema sai thì 9 trang phía
trên đều phải viết lại; schema đúng thì phần còn lại gần như là việc tay.

---

## 3. Chỗ AI sinh sai — phát hiện và sửa

| # | Lỗi | Phát hiện bằng | Đã sửa thế nào |
|---|---|---|---|
| 1 | **Quy tắc nghiệp vụ bị cài ở tầng giao diện.** Bản đầu, việc chặn ghi vào ngày đã khoá sổ chỉ là một câu `if` trong API route. Gọi thẳng database vẫn ghi được. | Tự hỏi lại: "nếu người khác gọi API bằng curl thì sao?" | Chuyển xuống trigger `trade_guard` ở Postgres. Giờ dù thao tác trực tiếp trên database cũng bị chặn |
| 2 | **Sổ ghi-thêm chỉ là lời hứa.** Bảng `trade` ban đầu không có gì ngăn `UPDATE`. Gọi là append-only nhưng không có cơ chế nào bảo đảm | Đọc lại schema và tìm từ "append-only" xem nó được *thi hành* ở đâu | Thêm trigger `trade_no_update` và `trade_no_delete` ném lỗi ở tầng database |
| 3 | **Tra biểu suất bằng `order by effective_from desc limit 1` mà quên điều kiện `<= ngày nghiệp vụ`.** Tức là luôn lấy bản mới nhất. Chạy thì không báo lỗi gì, kết quả vẫn ra số — nhưng sai nghiệp vụ hoàn toàn | So lại với ghi chú GOV-RULE-01 trong `product_a_functions_list.xlsx` của LAB-1 | Thêm `.lte("effective_from", business_day)` và lưu `rate_version_no` đã dùng vào từng dòng kết quả để tái lập được |
| 4 | **Thứ tự nạp dữ liệu mẫu sai.** Bản đầu khoá sổ 3 ngày *trước* khi chèn giao dịch, nên trigger chặn luôn và seed chạy ra bảng rỗng | Chạy thử, thấy số giao dịch bằng 0 | Đảo thứ tự: nạp giao dịch xong mới khoá sổ. Chính lỗi này lại là bằng chứng ràng buộc có hiệu lực thật |
| 5 | **`cookies()` gọi thẳng trong layout làm hỏng compile.** Next.js 16 bật Cache Components, nên trang tĩnh như 404 không prerender được | Lệnh compile báo lỗi `Route "/_not-found": encountered uncached or runtime data` | Tách thành component `SessionNav` rồi bọc `<Suspense>` |
| 6 | **Quên `<Suspense>` quanh `useSearchParams()`** ở hai trang login và trades | Cũng từ lỗi compile | Bọc Suspense, thêm fallback |
| 7 | **Màn hình giao dịch liệt kê cả 買出人 trong ô chọn bên mua.** Nhìn thì vô hại, nhưng sai hai cấp pháp lý — người mua lẻ không có tư cách giao dịch trực tiếp | Đối chiếu với mô tả hai cấp 許可/承認 trong tài liệu LAB-1 | Lọc còn 仲卸 và 売買参加者. Trigger ở database cũng chặn tiếp lớp hai |

### Nhận xét về các lỗi này

Lỗi 1, 2, 3, 7 đều **chạy được bình thường và không báo lỗi gì**. Compile sạch, giao diện hiện
đẹp, bấm nút ra kết quả. Chỉ sai về nghiệp vụ.

Lỗi 5, 6 thì ngược lại — compile báo ngay, sửa trong vài phút.

Đây là điểm đáng nhớ nhất của lab này: **loại lỗi mà công cụ bắt được là loại rẻ nhất.** Loại lỗi
đắt là loại trông vẫn đúng. Và cả 4 lỗi đắt ở trên đều chỉ lộ ra khi đối chiếu ngược lại tài liệu
nghiệp vụ của LAB-1 — không có cách nào bắt được chúng nếu chỉ nhìn vào mã nguồn.

---

## 4. Điểm tự tin và điểm chưa tốt

### Tự tin

**Duyệt schema trước, viết giao diện sau.** Schema là chỗ quy tắc nghiệp vụ sống. Duyệt nó khi nó
còn là 300 dòng SQL dễ hơn nhiều so với phát hiện sai sau khi đã có 9 trang dựa lên.

**Ép quy tắc nghiệp vụ xuống tầng database.** Ba quy tắc lõi của đề đều là trigger, không phải
câu `if` trong mã ứng dụng. AI có xu hướng cài ở chỗ gần nhất với nơi nó đang viết, tức là tầng
API — phải chủ động yêu cầu đẩy xuống.

**Dùng chính đầu ra của LAB-1 làm đầu vào.** Mỗi màn hình trong prototype đều mang mã SCR của
LAB-1, nên `feature-list.md` đối chiếu được từng dòng thay vì nói chung chung.

### Chưa tốt

**Không có test tự động.** Ba quy tắc lõi đang được chứng minh bằng cách thao tác tay trên giao
diện. Đúng ra phải có vài test gọi API và khẳng định đúng lỗi được ném ra — như vậy lần sửa mã
sau mới biết có làm hỏng gì không. Lần này bỏ qua vì giới hạn thời gian, nhưng đây là chỗ nếu làm
thật thì không được bỏ.

**Chưa thử các trường hợp biên.** Chốt giao dịch đúng bằng khối lượng còn lại, hai người cùng
chốt một lô cùng lúc, đảo một giao dịch đã giao hàng xong — đều chưa thử.

**Nhận lời khuyên của AI về stack mà không tự kiểm.** Next.js 16 vừa bật Cache Components theo
mặc định, và điều đó gây ra lỗi 5, 6 ở trên. Nếu đọc ghi chú phát hành trước thì đã tránh được.

**Mật khẩu chung một chuỗi cho cả 6 tài khoản.** Chấp nhận được với prototype và đã ghi rõ trong
`feature-list.md` là phần mock, nhưng cần nói trước để người review không tưởng đó là thiết kế
thật.

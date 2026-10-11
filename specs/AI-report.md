# AI report — LAB-4

## 1. Công cụ và cách ra lệnh

| Công cụ | Dùng để làm gì |
|---|---|
| Claude Code (Opus 5) | Sinh toàn bộ 113 file markdown, 30 ảnh wireframe, và script sinh |
| `/tkm:help` | Hỏi bước tiếp theo sau khi xong LAB-3 |
| `curl` + script bóc HTML | Tải 6 biểu mẫu và 3 tài liệu quy trình từ `framgia.github.io` về local |
| `openpyxl` | Đọc lại 6 file output LAB-1 làm nguồn cho Requirement Document |
| `python-pptx` | Khảo sát bộ template xlsx v3.10 (hướng đã bỏ, xem mục 3) |
| `mermaid-cli` | Render 9 sơ đồ mermaid ra PNG |
| `PIL` | Render 30 wireframe ASCII ra PNG |
| Script Python tự viết | Sinh hàng loạt — 30 Screen Spec, 12 DB, 17 API, 8 Function, 6 Technical |

### Cách ra lệnh — điểm khác so với ba lab trước

LAB-1 và LAB-2 là *"sinh ra tài liệu X"*. LAB-3 là *"đọc đầu ra cũ rồi suy ra đầu vào mới"*.
LAB-4 khác cả ba: **"trích dữ liệu thật từ mã nguồn rồi đổ vào khuôn có sẵn"**.

Ba nguồn dữ liệu, không nguồn nào là văn xuôi do AI bịa:

```
supabase/01_schema.sql  →  regex trích 12 bảng × cột  →  12 Database Design
src/app/api/**/route.ts →  regex trích 17 endpoint     →  17 API Design
output LAB-1 (.xlsx)    →  openpyxl đọc 63 func/18 NFR →  3 Requirement Document
```

Lệnh hiệu quả nhất của lab này không phải lệnh viết tài liệu, mà là lệnh **đọc chính xác**:

> Trích từ `01_schema.sql` tất cả `create table`, mỗi cột lấy tên, kiểu, khoá ngoại, CHECK,
> default. Xuất ra JSON. Không tự thêm cột nào không có trong file.

Có JSON đó rồi thì sinh 12 file Database Design chỉ là việc đổ khuôn — và quan trọng hơn, **không
có chỗ cho AI bịa**.

---

## 2. Con người tham gia review ở giai đoạn nào

| Giai đoạn | Người làm gì | Kết quả |
|---|---|---|
| Xác định bộ chuẩn | **Bác bỏ hai lần đoán sai của AI** | xem mục 3, lỗi #1 |
| Chốt phạm vi | Chọn làm đủ 6 biểu mẫu thay vì rút gọn | +7h nhưng bộ spec đầy đủ |
| Chốt vị trí repo | Chấp nhận lệch QC-01, yêu cầu ghi rõ lý do | mục 3.3 của `README.md` |
| Sau mỗi nhóm file | Đếm số file sinh ra, đối chiếu với số mong đợi | bắt được 17 ≠ 12 endpoint |
| Trước khi đẩy mã | Kiểm `.gitignore` vẫn chặn `.env.local` | ✅ |

---

## 3. Chỗ AI sinh sai — phát hiện và sửa

| # | Lỗi | Phát hiện bằng | Đã sửa thế nào |
|---|---|---|---|
| 1 | **Đoán sai bộ spec-standard hai lần.** Lần đầu AI kết luận đó là 36 template markdown trong kit Takumi. Lần hai, sau khi tìm thấy folder `template/` trong repo, kết luận là bộ xlsx v3.10. Cả hai đều sai — bộ đang áp dụng là 6 biểu mẫu markdown trên `framgia.github.io` | **Người dùng chỉ ra đường dẫn đúng.** AI không có cách nào tự biết — cả hai thứ nó tìm thấy đều có thật và đều trông hợp lý | Tải bộ đúng về local, làm lại kế hoạch từ đầu. Hai hướng cũ bỏ hoàn toàn |
| 2 | **Lập kế hoạch dựa trên bộ chuẩn chưa xác nhận.** Sau khi đoán lần một, AI viết ngay kế hoạch 8,5h chi tiết tới từng bước — trên nền một giả định chưa ai xác nhận | Đọc lại kế hoạch thấy nó rất cụ thể nhưng cơ sở thì mong manh | Từ đó mọi kế hoạch đều mở đầu bằng câu *"bộ chuẩn là cái nào"*, và hỏi trước khi lên lịch |
| 3 | **Đếm nhầm 12 API.** Kế hoạch ghi *"12 API Design"* vì đếm số file `route.ts`. Thực tế 12 file chứa **17 endpoint** — một file có cả `GET` và `POST` | Script trích xuất in ra `API route: 17` | Sinh 17 file thay vì 12. Nếu tin con số trong kế hoạch thì mất 5 endpoint |
| 4 | **Lệnh `sed` hỏng cú pháp.** Dùng `\|` làm phân cách trong khi nội dung thay thế cũng chứa `\|` | Chạy xong kiểm lại file thấy không đổi gì | Lệnh lỗi nên không làm gì — vô hại. Nhưng nếu nó *có* chạy thì đã làm hỏng bảng markdown. Từ đó chuyển sang sửa file bằng Python |
| 5 | **Trang login kẹt im lặng.** Khi `.env.local` chưa điền, API ném lỗi chưa bắt, Next trả HTML thay vì JSON; trang login gọi `r.json()` nên nghẹn, nút kẹt mãi ở *"Đang kiểm tra…"*, **không hiện lỗi gì** | Người dùng báo *"không login được"* — không có thông tin gì thêm vì màn hình không nói gì | Bọc `try/catch` ở API, đọc `text()` trước khi `JSON.parse` ở trang, `setBusy(false)` chuyển vào `finally` |
| 6 | **Test trigger chặn nhầm lý do.** Test L-02 (giao vượt hợp đồng) báo ✅ nhưng thông điệp là *"Giao dịch này đã bị huỷ"* — AI bốc trúng đúng giao dịch đã bị đảo trong seed, nên chưa thực sự kiểm phép cộng dồn | Đọc kỹ thông điệp lỗi thay vì chỉ nhìn ✅ | Chạy lại với giao dịch chưa đảo, thuộc ngày chưa khoá. Kiểm thêm ở biên: vượt đúng 0,01 kg cũng bị chặn |
| 7 | **Hướng dẫn không nói rõ lệnh chạy ở đâu.** Viết `cat … \| pbcopy` cho bước nạp SQL mà không nói đó là lệnh Terminal; người dùng dán nguyên vào Supabase SQL Editor | Lỗi `syntax error at or near "cat"` | Chép thẳng vào clipboard hộ, và thêm bảng phân biệt *Terminal* với *SQL Editor* |

### Nhận xét về bảy lỗi này

Chia làm ba loại, và chúng khác nhau về mức độ nguy hiểm:

**Loại công cụ bắt được** (#4, #5): compile báo, chạy báo. Rẻ nhất.

**Loại chỉ lộ khi đếm lại** (#3, #6): kết quả *trông* đúng — có ✅, có con số. Chỉ sai khi đối
chiếu với nguồn gốc.

**Loại AI không thể tự biết** (#1, #2, #7): AI không có cách nào biết bộ chuẩn nào đang áp dụng,
hay người dùng đang ngồi trước màn hình nào. Cả ba lỗi này đều cần **người dùng nói ra**.

Lỗi #1 đáng nhớ nhất. AI tìm thấy hai bộ template, cả hai đều có thật, đều nằm trong tầm với,
đều trông hợp lý — và cả hai đều sai. Nó không "bịa" gì cả; nó suy luận hợp lý từ dữ liệu không
đủ. Đây là kiểu sai nguy hiểm vì **không có dấu hiệu nào để nghi ngờ**.

---

## 4. Điểm tự tin và điểm chưa tốt

### Tự tin

**Trích dữ liệu bằng script thay vì để AI đọc và viết lại.** 12 bảng và 17 endpoint lấy bằng regex
từ file thật, xuất JSON, rồi đổ khuôn. AI không chạm vào con số nào. Nếu thay bằng *"đọc schema rồi
viết tài liệu"* thì gần như chắc chắn có cột bị bịa thêm hoặc bỏ sót.

**Phân biệt nguồn đặc tả ngay trong sản phẩm.** 13 màn đối chiếu được mã nguồn và 17 màn suy diễn
được đánh dấu khác nhau — khác ở mục 3 của file, và khác cả ở **viền cam của ảnh** để nhận ra ngay
khi mở. LAB-5 break task sẽ biết chỗ nào chắc.

**Hỏi trước khi làm ở đúng chỗ đáng hỏi.** Ba lần hỏi: bộ chuẩn nào, đặt ở đâu, độ sâu bao nhiêu.
Cả ba đều là câu hỏi mà đoán sai thì phải làm lại từ đầu — và lần hỏi thứ nhất đúng là đã cứu cả
bài, vì cả hai lần đoán trước đều sai.

### Chưa tốt

**Vẫn lập kế hoạch trước khi xác nhận cơ sở.** Lỗi #2. Kế hoạch 8,5h viết rất chi tiết trên một
giả định chưa ai xác nhận. Đáng lẽ câu hỏi *"bộ chuẩn là cái nào"* phải đi trước, không phải đi
kèm.

**Không có kiểm tự động cho bộ spec.** 113 file markdown với frontmatter, liên kết chéo, bảng
`_index` — không có script nào kiểm liên kết chết, frontmatter thiếu trường, hay `_index` lệch với
thực tế. Nếu làm thật thì đây là chỗ phải có CI.

**17 Screen Spec suy diễn vẫn là suy diễn.** Đánh dấu rõ là tốt, nhưng không thay được việc hỏi
khách. Bốn giả định ở mục 6 của `PREMISE.md` vẫn treo từ LAB-1 tới giờ — qua bốn lab rồi.

**Ảnh wireframe là ASCII render ra PNG, không phải bản vẽ.** Biểu mẫu `BM-2-901-51` ghi rõ:
*"Ảnh thiết kế tạo bằng Figma / Draw.io / Adobe XD. **Không** vẽ màn hình bằng Excel hay
Spreadsheet."* Ảnh ở đây tuy không phải Excel nhưng cũng không phải công cụ thiết kế — đây là chỗ
lệch chuẩn tôi không che, nhưng cũng chưa khắc phục được trong phạm vi bài tập.

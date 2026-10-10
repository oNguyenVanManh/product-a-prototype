# Wireframe

Hai mức chi tiết, vì hai nhóm màn hình có độ tin cậy khác nhau:

- **Mức A — 9 trang đã code.** Bố cục đối chiếu được với app đang chạy, từng vùng ứng với thành
  phần thật trong mã nguồn.
- **Mức B — 18 màn chưa code.** Khối bố cục và vùng chức năng, đủ để break task nhưng chưa phải
  bản vẽ thi công.

Ký hiệu dùng chung:

```
[ nút ]      nút bấm          ( ▾ )  ô chọn         [___]  ô nhập
┌─┐ └─┘      khung vùng       ※      ghi chú ràng buộc nghiệp vụ
```

---

## Khung chung — áp cho mọi trang sau khi đăng nhập

```
┌──────────────────────────────────────────────────────────────────────────┐
│ 桜水産市場   Hệ thống hỗ trợ vận hành chợ bán buôn thủy sản               │
│                              Hoàng Văn Soát · ROLE_SETTLEMENT [Đăng xuất]│
├──────────────────────────────────────────────────────────────────────────┤
│ Tổng quan │ Bên tham gia │ Lô hàng │ Giao dịch │ Giao hàng │ Đối soát │ … │
│           │ FEA-01       │ FEA-03  │ FEA-04    │ FEA-05    │ FEA-06   │   │
└──────────────────────────────────────────────────────────────────────────┘
   ※ Thanh điều hướng chỉ hiện khi có phiên hợp lệ.
   ※ Mục nào vai trò hiện tại không có quyền thì ẩn khỏi thanh.
   ※ Dưới 640px: thanh cuộn ngang, bảng cuộn ngang trong khung riêng.
```

---

## Mức A — 9 trang đã code

### A1 · `/login` — SCR-01

```
                    ┌────────────────────────────────┐
                    │          桜水産市場             │
                    │  Hệ thống hỗ trợ vận hành chợ  │
                    │       bán buôn thủy sản        │
                    └────────────────────────────────┘
                    ┌────────────────────────────────┐
                    │ ⚠ Email hoặc mật khẩu không    │  ← chỉ hiện khi lỗi
                    │   đúng                          │
                    │                                 │
                    │ Tài khoản                       │
                    │ ( Đối soát — settlement@… ▾ )   │
                    │                                 │
                    │ Mật khẩu                        │
                    │ [ •••••••••              ]      │
                    │                                 │
                    │ [ Đăng nhập ]                   │
                    └────────────────────────────────┘
                      Prototype LAB-3. Dữ liệu giả lập.

   ※ Thông điệp lỗi KHÔNG phân biệt sai email với sai mật khẩu.
   ※ Người lạ mở bất kỳ URL nào đều bị đưa về đây kèm ?next=
```

### A2 · `/` — Tổng quan

```
Tổng quan vận hành
Prototype LAB-3 · 10 màn hình · dữ liệu đọc/ghi thật trên Supabase

┌──────────────┐┌──────────────┐┌──────────────┐┌──────────────┐
│ 相対取引      ││ せり          ││ Tổng giá trị ││ Ngày đã khoá │
│              ││              ││              ││              │
│   89.7%      ││   10.3%      ││ ¥48,231,500  ││   3 / 12     │
│ ¥43,2tr      ││ ¥5,0tr       ││ đã trừ đảo   ││              │
│ luồng chính  ││ luồng phụ    ││              ││              │
└──────────────┘└──────────────┘└──────────────┘└──────────────┘
   ※ Bốn ô này là thứ người xem thấy đầu tiên. Tỷ trọng 相対取引
     đặt ở vị trí số 1 có chủ đích — xem ADR-005.

┌─ Vì sao tỷ trọng này quan trọng ────────────────────────────────┐
│ Tên gọi "chợ đấu giá" khiến người ngoài tưởng phiên đấu giá      │
│ công khai là luồng chính. Thực tế phần lớn giá trị đến từ thỏa  │
│ thuận trực tiếp…                                                 │
│ [Xem giao dịch thỏa thuận →] [Xem kết quả đấu giá →]            │
└──────────────────────────────────────────────────────────────────┘

┌─ Theo ngày nghiệp vụ ───────────────────────────────────────────┐
│ Ngày       │Trạng thái│Thỏa thuận │Đấu giá │Đảo│Tổng    │Tỷ trọng│
│ 2026-10-09 │ Đang mở  │ 7 · ¥3,2tr│1·¥0,4tr│ — │¥3,6tr  │ 88.9%  │
│ 2026-10-08 │ Đang mở  │ 8 · ¥3,9tr│1·¥0,3tr│ — │¥4,2tr  │ 92.9%  │
│ 2026-09-30 │ Đã khoá  │ 6 · ¥2,8tr│1·¥0,5tr│ 1 │¥3,3tr  │ 84.8%  │
└──────────────────────────────────────────────────────────────────┘
```

### A3 · `/parties` — SCR-03 + SCR-04

```
Bên tham gia và tư cách giao dịch          SCR-03 · FEA-01

┌─ Hai cấp pháp lý khác nhau ─────────────────────────────────────┐
│ ┌─ 許可 — Giấy phép ──────┐  ┌─ 承認 — Chấp thuận ──────────┐  │
│ │ Cấp cho 仲卸 đơn vị     │  │ Cấp cho 売買参加者 bên tham  │  │
│ │ trung gian. Thủ tục     │  │ gia mua bán. Thủ tục nhẹ    │  │
│ │ nặng hơn.               │  │ hơn, cơ chế ĐỘC LẬP.        │  │
│ └─────────────────────────┘  └──────────────────────────────┘  │
│ 買出人 không có tư cách trực tiếp — phải mua qua trung gian.    │
└──────────────────────────────────────────────────────────────────┘
   ※ Khối giải thích này đặt TRƯỚC bảng có chủ đích: người đọc
     phải hiểu hai cấp khác nhau trước khi nhìn dữ liệu.

┌─ Danh sách (20) ────────────────────────────────────────────────┐
│ Mã   │Tên              │Vai trò tham gia chợ│Tư cách      │Đến      │Trạng thái   │
│ IM-01│Trung gian Hama… │仲卸 trung gian     │許可 KYOKA-01│2027-03-31│ Hợp lệ     │
│ IM-06│Trung gian Nagisa│仲卸 trung gian     │許可 KYOKA-06│2026-10-31│ Sắp hết hạn│
│ PA-05│Khách sạn Shira… │売買参加者          │承認 SHONIN-05│2027-03-31│ Tạm ngưng  │
│ BY-01│Quán ăn Isoya    │買出人 mua lẻ       │— không có — │—        │Mua qua t.gian│
└──────────────────────────────────────────────────────────────────┘
```

### A4 · `/lots` — SCR-05 + SCR-06

```
Lô hàng và thẩm định                SCR-05 tiếp nhận · SCR-06 thẩm định

┌─ Thẩm định do người làm, hệ thống chỉ ghi lại ──────────────────┐
│ Độ tươi đánh giá bằng mắt tại bến. Hệ thống KHÔNG có phép tính  │
│ nào suy ra hạng — chỉ lưu hạng do người thẩm định chọn.         │
└──────────────────────────────────────────────────────────────────┘

┌─ Tiếp nhận lô mới ──────────────────────────────────────────────┐
│ Đơn vị bán buôn      Loài thủy sản    Khối lượng (kg)           │
│ ( WS-01 Vịnh… ▾ )    [_____________]  [________]   [Tiếp nhận]  │
└──────────────────────────────────────────────────────────────────┘
   ※ Ô chọn CHỈ liệt kê 卸売業者.
   ※ Ngày đã khoá sổ → nút trả lỗi 409, không phải ẩn nút.

┌─ Lô hàng (50) ──────────────────────────────────────────────────┐
│ Mã lô             │Ngày      │Loài      │Khối lượng│Còn lại │Thẩm định│
│ LOT-20261009-01   │2026-10-09│Cá ngừ    │ 184,5 kg │ 62,3 kg│ Hạng A  │
│ LOT-20261009-02   │2026-10-09│Mực ống   │ 97,2 kg  │ 97,2 kg│[A][B][C]│
└──────────────────────────────────────────────────────────────────┘
   ※ Lô chưa thẩm định hiện 3 nút A/B/C. Không có nút "tự động".
```

### A5 · `/trades` — SCR-07 + SCR-08 + SCR-09

```
Giao dịch       SCR-07 thỏa thuận · SCR-08 danh sách · SCR-09 đấu giá

┌─ Chốt giao dịch mới ────────────────────────────────────────────┐
│ Loại giao dịch               Lô hàng            Bên mua          │
│ ( 相対取引 — Thỏa thuận ▾ )  ( LOT-…-01 ▾ )    ( IM-01 … ▾ )    │
│                                                                   │
│ Khối lượng (kg)   Đơn giá (JPY/kg)   [Ký hiệu tay]               │
│ [___________]     [____________]     [_________]  ← chỉ khi せり │
│                                                                   │
│ [ Chốt giao dịch ]  Hệ thống sẽ chặn nếu ngày đã khoá sổ, bên   │
│                      mua hết tư cách, hoặc lô không đủ hàng.     │
└──────────────────────────────────────────────────────────────────┘
   ※ Ô "Bên mua" CHỈ liệt kê 仲卸 và 売買参加者 — 買出人 không có
     tư cách giao dịch trực tiếp. Đây là hệ quả mô hình, không
     phải lọc cho gọn.
   ※ Ô "Ký hiệu tay" chỉ hiện khi chọn せり, và do NHÂN VIÊN nhập
     tay — SCOPE-OUT-02 cấm OCR.

┌─ Sổ giao dịch (104) ──────────────────── ( Tất cả ▾ ) ──────────┐
│ Mã          │Ngày      │Loại     │Lô      │Bên mua│K.lượng│Tiền │  │
│ TRD-…-003   │2026-10-09│ 相対    │LOT-…01 │IM-01  │ 45 kg │¥…   │[Huỷ]│
│ TRD-…-010   │2026-10-09│ せり ヤリ│LOT-…02 │PA-02  │ 30 kg │¥…   │[Huỷ]│
│ T̶R̶D̶-̶…̶-̶0̶0̶1̶   │2̶0̶2̶6̶-̶1̶0̶-̶0̶8̶│ 相̶対̶    │…       │…      │…      │…    │     │
│ TRD-…-001-REV│2026-10-08│相対 đảo │…       │…      │-52 kg │-¥…  │     │
└──────────────────────────────────────────────────────────────────┘
   ※ Dòng bị gạch ngang = đã bị đảo. Dòng nền đỏ = chính là dòng đảo.
   ※ Dòng gốc KHÔNG biến mất. Đây là biểu hiện trực quan của ADR-001.
```

### A6 · `/deliveries` — SCR-11 + SCR-12

```
Theo dõi giao hàng           SCR-11 bảng theo dõi · SCR-12 ghi nhận

┌─ Ghi nhận một lần giao ─────────────────────────────────────────┐
│ Giao dịch          Khối lượng giao  Kết quả        Lý do        │
│ ( TRD-…-003 ▾ )    [__________]     ( Giao đủ ▾ )  [__________] │
│                                      [ Ghi nhận ]               │
└──────────────────────────────────────────────────────────────────┘
   ※ Một giao dịch giao được NHIỀU LẦN, hệ thống cộng dồn.
   ※ Tổng các lần giao không vượt hợp đồng — trigger chặn, trả 409
     kèm số đã giao / lần này / hợp đồng. Thêm ở LAB-4, xem L-02.
   ※ "Lý do" bắt buộc khi chọn Ngoại lệ.

┌─ Lịch sử giao hàng (112) ───────────────────────────────────────┐
│ Giao dịch │Ngày GD   │Bên mua│Đã giao│Trên hợp đồng│Kết quả│Lý do│
│ TRD-…-003 │2026-10-09│IM-01  │ 45 kg │ 45 kg       │ Đủ    │ —   │
│ TRD-…-004 │2026-10-09│PA-01  │ 38 kg │ 54 kg       │ Thiếu │Hao…│
└──────────────────────────────────────────────────────────────────┘
```

### A7 · `/settlement` — SCR-14 + SCR-15

```
Đối soát và chốt sổ        SCR-14 bảng đối soát · SCR-15 khoá ngày

┌─ Khoá ngày nghiệp vụ được thi hành ở tầng database ─────────────┐
│ Khi một ngày đã khoá, trigger trong Supabase TỪ CHỐI mọi lệnh   │
│ ghi vào ngày đó. Dù gọi thẳng API hay thao tác trực tiếp trên   │
│ database, dữ liệu đã chốt vẫn không đổi được.                   │
└──────────────────────────────────────────────────────────────────┘

┌─ Bảng đối soát theo ngày (12) ──────────────────────────────────┐
│ Ngày      │Thỏa thuận│Đấu giá│Đảo│Tổng ròng│Tỷ trọng│T.thái │     │
│2026-10-09 │7 ·¥3,2tr │1·¥0,4 │ — │ ¥3,6tr  │ 88.9%  │Đang mở│[Khoá sổ]│
│2026-09-30 │6 ·¥2,8tr │1·¥0,5 │ 1 │ ¥3,3tr  │ 84.8%  │Đã khoá│[Mở lại] │
└──────────────────────────────────────────────────────────────────┘
   ※ Bấm "Khoá sổ" hiện hộp xác nhận nêu rõ hệ quả trước khi thực hiện.
   ※ Vai trò khác SET/ADM bấm vào nhận lỗi 403.
   ※ Cột "Tổng ròng" cộng cả số âm của dòng đảo.
```

### A8 · `/incentives` — SCR-20

```
Tiền khuyến khích thanh toán đúng hạn    完納奨励金 · SCR-20 · FEA-07

┌─ Biểu suất tra theo ngày nghiệp vụ, không lấy bản mới nhất ─────┐
│ Khi tính thưởng cho một ngày, hệ thống lấy biểu suất CÓ HIỆU    │
│ LỰC VÀO CHÍNH NGÀY ĐÓ…                                          │
│  ┌─ Phiên bản 1 ───────┐  ┌─ Phiên bản 2 ───────┐              │
│  │ 1,50% · thuế 1,1000 │  │ 2,00% · thuế 1,1000 │              │
│  │ Hiệu lực 2026-01-01 │  │ Hiệu lực 2026-10-05 │              │
│  └─────────────────────┘  └─────────────────────┘              │
│  Thử tính 2026-09-29 rồi 2026-10-06 — hai phiên bản khác nhau   │
│  dù bấm nút ở cùng một thời điểm.                               │
└──────────────────────────────────────────────────────────────────┘

┌─ Tính thưởng cho một ngày ──────────────────────────────────────┐
│ Ngày nghiệp vụ   [ 2026-10-05 ]   [ Tính thưởng ]               │
│ Cơ sở tính là tổng giao dịch đã chốt, đã TRỪ dòng đảo.          │
└──────────────────────────────────────────────────────────────────┘

┌─ Kết quả đã tính (14) ──────────────────────────────────────────┐
│ Ngày      │Bên tham gia │Cơ sở tính│Biểu suất │T.toán   │Thưởng │
│2026-10-05 │IM-01 Hama…  │¥1,245,000│2,00% (v2)│Đúng hạn │¥27,390│
│2026-10-05 │PA-02 Umi    │¥  892,000│2,00% (v2)│Quá hạn  │     0 │
└──────────────────────────────────────────────────────────────────┘
   ※ Cột biểu suất hiện SỐ PHIÊN BẢN đã dùng — để tái lập con số
     khi bị chất vấn. Xem ADR-003.
```

### A9 · `/users` — SCR-02

```
Tài khoản và quyền                              SCR-02 · FEA-02

┌─ Người dùng nội bộ (6) ─────────────────────────────────────────┐
│ Email                      │Họ tên        │Vai trò       │T.thái │    │
│ admin@sakura-market.example│Quản trị hệ…  │Quản trị hệ…  │Đang HĐ│[Tắt]│
│ trade@sakura-market.example│Lê Văn Giao   │Chốt giao dịch│Đang HĐ│[Tắt]│
└──────────────────────────────────────────────────────────────────┘
   Chỉ vai trò quản trị hệ thống mới đổi được trạng thái. Mọi thao
   tác bật/tắt đều ghi vào nhật ký kiểm toán.
   ※ Không tự tắt tài khoản của chính mình — trả 409.
```

---

## Mức B — 18 màn chưa code

Khối bố cục và vùng chức năng. Chưa phải bản vẽ thi công — cần khách xác nhận phần suy diễn
trước khi code (xem cột Nguồn ở [04-screen-spec.md](./04-screen-spec.md)).

### B1 · Nhóm danh sách có bộ lọc — SCR-22, SCR-23, SCR-25

```
┌─ Bộ lọc ────────────────────────────────────────────────────────┐
│ Từ ngày [____] Đến ngày [____] ( Loại ▾ ) ( Người dùng ▾ ) [Lọc]│
└──────────────────────────────────────────────────────────────────┘
┌─ Kết quả (N) ──────────────────────────── [Xuất CSV] ───────────┐
│ ...bảng kết quả, phân trang...                                  │
└──────────────────────────────────────────────────────────────────┘
   ※ SCR-25 nhật ký kiểm toán: CHỈ ĐỌC tuyệt đối, có khung mở rộng
     để xem detail dạng JSON.
   ※ SCR-23 báo cáo: chỉ chạy được cho ngày ĐÃ khoá sổ.
```

### B2 · Nhóm form có luồng phê duyệt — SCR-16, SCR-17, SCR-21

```
┌─ Người đề nghị lập ─────────────────────────────────────────────┐
│ Đối tượng ( ... ▾ )   Loại thay đổi ( ... ▾ )                   │
│ Giá trị mới [________]                                           │
│ Lý do [_______________________________]  ※ tối thiểu 20 ký tự   │
│                                   [ Lưu nháp ] [ Gửi duyệt ]    │
└──────────────────────────────────────────────────────────────────┘
┌─ Người duyệt xử lý ─────────────────────────────────────────────┐
│ ...thông tin yêu cầu, chỉ đọc...                                │
│ Ý kiến [_____________________]      [ Duyệt ] [ Từ chối ]       │
└──────────────────────────────────────────────────────────────────┘
   ※ Người duyệt PHẢI khác người đề nghị — chặn ở tầng database.
   ※ Số cấp phê duyệt vẫn là giả định ASM-12, khách chưa xác nhận.
   ※ Duyệt xong sinh bút toán đảo TỰ ĐỘNG, không sửa dòng gốc.
```

### B3 · Nhóm nhập liệu đơn giản — SCR-19, SCR-27, SCR-29, SCR-30

```
┌─ Danh sách hiện có ──────────────────────── [+ Thêm mới] ───────┐
│ ...bảng, mỗi dòng có [Sửa] [Xoá]...                             │
└──────────────────────────────────────────────────────────────────┘
┌─ Form thêm/sửa (hiện khi bấm) ──────────────────────────────────┐
│ Trường 1 [______]  Trường 2 ( ▾ )  Trường 3 [______]            │
│                                      [ Huỷ ] [ Lưu ]            │
└──────────────────────────────────────────────────────────────────┘
   ※ SCR-19 trạng thái thanh toán: một bên một ngày CHỈ MỘT dòng.
   ※ SCR-30 tham số hệ thống: đổi tham số ghi audit_log kèm giá
     trị cũ và mới.
```

### B4 · SCR-13 · Ghi ngoại lệ giao hàng kèm ảnh

```
┌─ Ngoại lệ giao hàng ────────────────────────────────────────────┐
│ Lần giao ( TRD-…-004 / 38kg ▾ )                                 │
│ Loại ( Thiếu hàng ▾ )                                           │
│ Mô tả [_________________________________________]               │
│                                                                   │
│ Ảnh chứng cứ ┌──────┐┌──────┐┌──────┐  [+ Thêm ảnh]            │
│              │ IMG1 ││ IMG2 ││  +   │  tối đa 5 ảnh, 10MB/ảnh  │
│              └──────┘└──────┘└──────┘                           │
│                                      [ Huỷ ] [ Ghi nhận ]       │
└──────────────────────────────────────────────────────────────────┘
   ※ Màn hình hiện trường — bố cục ưu tiên tablet, nút lớn, ít chữ.
   ※ Ảnh lưu S3, lifecycle chuyển Glacier sau 3 năm (NFR-RET-01).
   ※ Không xoá được ảnh sau khi ngày đã khoá sổ.
```

### B5 · SCR-24 · Cổng tra cứu chỉ-đọc cho bên ngoài

```
┌──────────────────────────────────────────────────────────────────┐
│ 桜水産市場 · Cổng tra cứu          Trung gian Hamasaki [Đăng xuất]│
├──────────────────────────────────────────────────────────────────┤
│ Giao dịch của tôi │ Giao hàng │ Tiền khuyến khích                │
└──────────────────────────────────────────────────────────────────┘
┌─ Giao dịch của tôi ─────────────────────────────────────────────┐
│ ...CHỈ dữ liệu của chính bên tham gia này...                    │
└──────────────────────────────────────────────────────────────────┘
   ※ Thanh điều hướng KHÁC hẳn bản nội bộ — chỉ 3 mục.
   ※ Không thấy đơn giá của giao dịch bên khác.
   ※ MÂU THUẪN TRONG TÀI LIỆU KHÁCH: SCOPE-OUT-04 loại cổng tự
     phục vụ nhưng chỗ khác lại nhắc. Giả định ASM-15 chờ trả lời
     — ĐỪNG code màn này trước khi khách xác nhận.
```

### B6 · SCR-26 · Hộp thông báo

```
┌─ Thông báo (3 chưa đọc) ──────────────── [Đánh dấu đã đọc hết] ─┐
│ ● KHẨN  Xuất dữ liệu kế toán ngày 2026-10-08 thất bại  2 giờ   │
│ ● Quan trọng  IM-06 còn 20 ngày hết hạn giấy phép      5 giờ   │
│ ○ Thường  Ngày 2026-10-07 đã khoá sổ                   1 ngày  │
└──────────────────────────────────────────────────────────────────┘
   ※ Chỉ thấy thông báo gửi cho vai trò của mình.
   ※ ● chưa đọc · ○ đã đọc.
```

### B7 · SCR-28 · Quản lý xuất dữ liệu kế toán

```
┌─ Xuất dữ liệu đối soát ─────────────────────────────────────────┐
│ Ngày nghiệp vụ ( 2026-09-30 ▾ )  ※ chỉ ngày ĐÃ khoá sổ         │
│                                        [ Sinh và đẩy SFTP ]     │
└──────────────────────────────────────────────────────────────────┘
┌─ Lịch sử phát hành ─────────────────────────────────────────────┐
│ Ngày      │Tên tệp           │Thời điểm đẩy│Thử lại│Trạng thái │  │
│2026-09-30 │SETTLE_20260930.csv│10:42 JST   │ 0     │Thành công │  │
│2026-09-29 │SETTLE_20260929.csv│—           │ 3     │Thất bại   │[Thử lại]│
└──────────────────────────────────────────────────────────────────┘
   ※ Phương thức kết nối vẫn là giả định ASM-14 — nợ kỹ thuật N-06.
   ※ Xuất lại được nhưng PHẢI ghi lý do.
```

### B8 · SCR-18 · Quản lý tranh chấp

```
┌─ Tranh chấp (4 đang mở) ──────────────────── [+ Mở tranh chấp] ─┐
│ Mã   │Đối tượng  │Bên khiếu nại│Nội dung      │Trạng thái│Ngày  │
│ DSP-1│TRD-…-004  │IM-01        │Thiếu 16 kg…  │Đang xử lý│10-09 │
└──────────────────────────────────────────────────────────────────┘
   ※ Không đóng được nếu chưa nhập kết luận.
```

---

## Ghi chú cho người triển khai

| Điểm | Yêu cầu |
|---|---|
| Khung màn hình hiện trường | SCR-05, SCR-06, SCR-12, SCR-13 phải dùng được trên tablet ≥10 inch, nút đủ lớn cho thao tác bằng tay đeo găng |
| Bàn phím | NFR-USE-01 đòi nhập lô, chốt giao dịch, ghi giao hàng thao tác được hoàn toàn bằng bàn phím — không bắt buộc dùng chuột |
| Bảng rộng | Mọi bảng đặt trong khung cuộn ngang riêng, không để cả trang cuộn ngang |
| Thông điệp lỗi | Hiện nguyên văn thông điệp từ trigger, không thay bằng câu chung chung — người dùng cần biết CHÍNH XÁC vì sao bị chặn |
| Màu sắc | Không dùng màu làm phương tiện truyền đạt duy nhất (NFR-A11Y-01) — dòng đảo vừa đổi màu nền vừa có nhãn chữ "đảo" |

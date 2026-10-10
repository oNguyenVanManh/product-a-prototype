# Screen spec — 30 màn hình

Đặc tả chi tiết để đội dev triển khai mà không cần hỏi lại. Đây là đầu vào trực tiếp cho việc
break task ở LAB-5.

## Nguồn của mỗi đặc tả

Cột **Nguồn** ở mỗi màn hình cho biết đặc tả này dựa trên đâu. Đây là thông tin quan trọng khi
break task: hai loại có độ tin cậy khác nhau.

| Ký hiệu | Nghĩa | Độ tin cậy |
|---|---|---|
| **C** | Đối chiếu được với mã nguồn LAB-3 — từng field, từng ràng buộc kiểm chứng được | Cao. 13 màn |
| **S** | Suy diễn từ `product_a_functions_list.xlsx` và `product_a_userstories.xlsx` của LAB-1 | Thấp hơn. 17 màn, cần khách xác nhận trước khi code |

---

## Quy ước chung

### Sáu vai trò hệ thống

| Mã | Vai trò | Mã đầy đủ trong database |
|---|---|---|
| ADM | Quản trị hệ thống | `ROLE_SYS_ADMIN` |
| INT | Tiếp nhận lô | `ROLE_INTAKE` |
| JUD | Thẩm định | `ROLE_JUDGE` |
| TRA | Chốt giao dịch | `ROLE_TRADE` |
| DEL | Giao hàng | `ROLE_DELIVERY` |
| SET | Đối soát | `ROLE_SETTLEMENT` |

### Mức quyền

| Ký hiệu | Nghĩa |
|---|---|
| **F** | Đầy đủ — xem và thao tác |
| **R** | Chỉ đọc — xem được, không sửa |
| **–** | Không truy cập — trang không hiện trên thanh điều hướng |

### Quy ước validation áp cho mọi màn

| Quy tắc | Áp dụng |
|---|---|
| Mọi khối lượng và số tiền | `numeric`, không âm trừ dòng đảo, tối đa 2 chữ số thập phân |
| Mọi ngày nghiệp vụ | Kiểu `date`, múi giờ JST, không nhận ngày tương lai trừ `effective_from` |
| Mọi thao tác nhạy cảm | Ghi `audit_log` kèm `actor_id`, `action`, `entity`, `detail` |
| Mọi lỗi do quy tắc nghiệp vụ | Trả HTTP 409 kèm thông điệp tiếng Việt nguyên văn từ trigger |
| Mọi lỗi do thiếu quyền | Trả HTTP 403 |
| Mọi lỗi do chưa đăng nhập | Trả HTTP 401, trang chuyển hướng về `/login?next=` |

---

## Ma trận quyền — 30 màn × 6 vai trò

| Màn hình | ADM | INT | JUD | TRA | DEL | SET |
|---|---|---|---|---|---|---|
| SCR-01 Đăng nhập | **F** | **F** | **F** | **F** | **F** | **F** |
| SCR-02 Quản lý tài khoản và quyền | **F** | R | R | R | R | R |
| SCR-03 Danh sách và hồ sơ bên tham gia | **F** | R | R | R | R | **F** |
| SCR-04 Bảng theo dõi hiệu lực tư cách | R | – | – | R | – | **F** |
| SCR-05 Tiếp nhận lô hàng | **F** | **F** | R | R | R | R |
| SCR-06 Ghi kết quả thẩm định | **F** | R | **F** | R | – | R |
| SCR-07 Chốt giao dịch thỏa thuận | **F** | – | – | **F** | R | R |
| SCR-08 Danh sách và huỷ giao dịch | **F** | – | – | **F** | R | **F** |
| SCR-09 Ghi kết quả đấu giá | **F** | – | – | **F** | R | R |
| SCR-10 Lịch sử sửa kết quả đấu giá | R | – | – | R | – | R |
| SCR-11 Bảng theo dõi giao hàng | R | – | – | R | **F** | **F** |
| SCR-12 Ghi nhận lần giao hàng | **F** | – | – | – | **F** | **F** |
| SCR-13 Ghi ngoại lệ giao hàng kèm ảnh | **F** | – | – | – | **F** | R |
| SCR-14 Bảng đối soát ngày | R | – | – | R | R | **F** |
| SCR-15 Khoá ngày nghiệp vụ | **F** | – | – | – | – | **F** |
| SCR-16 Tạo yêu cầu điều chỉnh sau chốt | **F** | – | – | **F** | R | **F** |
| SCR-17 Phê duyệt điều chỉnh | **F** | – | – | – | – | **F** |
| SCR-18 Quản lý tranh chấp | **F** | – | R | R | **F** | **F** |
| SCR-19 Nhập trạng thái thanh toán | **F** | – | – | – | – | **F** |
| SCR-20 Kết quả tính thưởng | R | – | – | – | – | **F** |
| SCR-21 Quản lý phiên bản biểu suất | **F** | – | – | – | – | R |
| SCR-22 Nhật ký phiên bản quy định | R | – | – | – | – | R |
| SCR-23 Trung tâm báo cáo | **F** | R | R | R | R | **F** |
| SCR-24 Cổng tra cứu chỉ-đọc cho bên ngoài | **F** | – | – | – | – | R |
| SCR-25 Tra cứu nhật ký kiểm toán | **F** | – | – | – | – | R |
| SCR-26 Hộp thông báo | **F** | **F** | **F** | **F** | **F** | **F** |
| SCR-27 Cấu hình thông báo | **F** | – | – | – | – | R |
| SCR-28 Quản lý xuất dữ liệu kế toán | **F** | – | – | – | – | **F** |
| SCR-29 Quản lý lịch chợ | **F** | R | R | R | R | **F** |
| SCR-30 Danh mục và tham số hệ thống | **F** | R | R | R | R | R |

Ba màn hình chỉ **SET** và **ADM** thao tác được: SCR-15 khoá sổ, SCR-20 tính thưởng,
SCR-28 xuất dữ liệu kế toán. Đây là ba chỗ chạm trực tiếp vào tiền và vào dữ liệu đã chốt.

---

## Đặc tả từng màn hình


### Nhóm FEA-02

#### SCR-01 · Đăng nhập

| | |
|---|---|
| **Nhóm** | FEA-02 |
| **Trang** | `/login` |
| **Nguồn** | ✅ C — đối chiếu mã nguồn |
| **Quyền** | ADM F · INT F · JUD F · TRA F · DEL F · SET F |

**Field**

| Tên | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| `email` | Chọn từ danh sách | Bắt buộc | 6 tài khoản demo |
| `password` | Mật khẩu | Bắt buộc | Kiểu password, không hiện ký tự |

**Validation**

- Email phải tồn tại trong app_user và is_active = true
- Mật khẩu so với DEMO_PASSWORD trong biến môi trường
- Sai thì trả 401 kèm thông điệp chung, KHÔNG nói sai email hay sai mật khẩu

**Trạng thái**

- Trống → đang nhập → đang kiểm tra → thành công chuyển tới ?next= · thất bại hiện lỗi

> Tạo cookie pa_session ký HMAC-SHA256, httpOnly, 8 tiếng. Ghi audit_log action=LOGIN.

#### SCR-02 · Quản lý tài khoản và quyền

| | |
|---|---|
| **Nhóm** | FEA-02 |
| **Trang** | `/users` |
| **Nguồn** | ✅ C — đối chiếu mã nguồn |
| **Quyền** | ADM F · INT R · JUD R · TRA R · DEL R · SET R |

**Field**

| Tên | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| `email` | text | chỉ đọc | Khoá duy nhất |
| `full_name` | text | chỉ đọc |  |
| `role` | enum 6 giá trị | chỉ đọc | Có CHECK ở database |
| `is_active` | boolean | sửa được | Nút Bật/Tắt |

**Validation**

- Chỉ ROLE_SYS_ADMIN đổi được is_active, vai trò khác nhận lỗi 403
- Không tự tắt tài khoản của chính mình — trả 409

**Trạng thái**

- Đang hoạt động ⇄ Đã tắt

> Mọi lần bật/tắt ghi audit_log action=ENABLE_USER / DISABLE_USER.


### Nhóm FEA-01

#### SCR-03 · Danh sách và hồ sơ bên tham gia

| | |
|---|---|
| **Nhóm** | FEA-01 |
| **Trang** | `/parties` |
| **Nguồn** | ✅ C — đối chiếu mã nguồn |
| **Quyền** | ADM F · INT R · JUD R · TRA R · DEL R · SET F |

**Field**

| Tên | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| `code` | text | chỉ đọc | Khoá duy nhất, ví dụ IM-01 |
| `name` | text | chỉ đọc |  |
| `kind` | party_kind | chỉ đọc | 4 vai trò tham gia chợ |
| `qualification.kind` | permit / approval | chỉ đọc | 許可 hoặc 承認 |
| `qualification.cert_no` | text | chỉ đọc |  |
| `qualification.valid_to` | date | chỉ đọc | Nền tảng cho nhãn trạng thái |
| `qualification.suspended` | boolean | chỉ đọc |  |

**Validation**

- 許可 chỉ gán được cho 仲卸, 承認 chỉ gán cho 売買参加者 — trigger qualification_kind_check
- 買出人 không có dòng tư cách nào, hiển thị 'Mua qua trung gian'
- valid_to < hôm nay → nhãn Hết hạn; còn ≤ 30 ngày → Sắp hết hạn

**Trạng thái**

- Hợp lệ · Sắp hết hạn · Hết hạn · Tạm ngưng · Mua qua trung gian

> Đây là màn hình thể hiện rõ nhất hai cấp pháp lý. Xem ADR-006.

#### SCR-04 · Bảng theo dõi hiệu lực tư cách

| | |
|---|---|
| **Nhóm** | FEA-01 |
| **Trang** | `(gộp vào /parties)` |
| **Nguồn** | 📋 S — suy diễn từ LAB-1 |
| **Quyền** | ADM R · INT - · JUD - · TRA R · DEL - · SET F |

**Field**

| Tên | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| `party.code / name` | text | chỉ đọc |  |
| `qualification.valid_to` | date | chỉ đọc | Sắp xếp tăng dần |
| `số ngày còn lại` | số tính ra | chỉ đọc | valid_to trừ hôm nay |
| `đã gửi cảnh báo` | boolean | chỉ đọc | Do FNC-005 đặt |

**Validation**

- Mặc định lọc còn ≤ 30 ngày
- Cho phép đổi ngưỡng cảnh báo

**Trạng thái**

- Còn hiệu lực · Sắp hết hạn · Hết hạn

> Prototype gộp thông tin này vào SCR-03. Tách riêng khi cần theo dõi chủ động hàng ngày.


### Nhóm FEA-03

#### SCR-05 · Tiếp nhận lô hàng

| | |
|---|---|
| **Nhóm** | FEA-03 |
| **Trang** | `/lots` |
| **Nguồn** | ✅ C — đối chiếu mã nguồn |
| **Quyền** | ADM F · INT F · JUD R · TRA R · DEL R · SET R |

**Field**

| Tên | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| `wholesaler_id` | chọn từ danh sách | Bắt buộc | Chỉ liệt kê 卸売業者 |
| `species` | text | Bắt buộc | Tên loài thủy sản |
| `quantity_kg` | numeric(10,2) | Bắt buộc, > 0 | CHECK ở database |
| `lot_code` | text | hệ thống sinh | LOT-YYYYMMDD-NN |
| `business_day` | date | mặc định hôm nay |  |

**Validation**

- quantity_kg phải > 0 — CHECK ở database
- Ngày đã khoá sổ thì chặn tiếp nhận, trả 409 kèm lý do
- lot_code sinh theo số thứ tự trong ngày, không trùng

**Trạng thái**

- received → inspected → published → traded → delivered

> Màn hình hiện trường: dùng được trên tablet. Thiết kế gốc có cả bản native (ADR-008).

#### SCR-06 · Ghi kết quả thẩm định

| | |
|---|---|
| **Nhóm** | FEA-03 |
| **Trang** | `/lots` |
| **Nguồn** | ✅ C — đối chiếu mã nguồn |
| **Quyền** | ADM F · INT R · JUD F · TRA R · DEL - · SET R |

**Field**

| Tên | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| `lot_id` | chọn lô | Bắt buộc | Lô chưa có kết quả |
| `grade` | A / B / C | Bắt buộc | NGƯỜI chọn, không có gợi ý máy |
| `note` | text | Tuỳ chọn |  |
| `inspected_by` | uuid | hệ thống gán | Từ phiên đăng nhập |

**Validation**

- grade chỉ nhận A, B hoặc C — CHECK ở database
- KHÔNG có bất kỳ phép tính nào suy ra grade — SCOPE-OUT-01 cấm

**Trạng thái**

- Chưa thẩm định → đã thẩm định

> Cấu trúc bảng cố tình không có cột điểm máy tính. Xem ADR-007.


### Nhóm FEA-04

#### SCR-07 · Chốt giao dịch thỏa thuận

| | |
|---|---|
| **Nhóm** | FEA-04 |
| **Trang** | `/trades` |
| **Nguồn** | ✅ C — đối chiếu mã nguồn |
| **Quyền** | ADM F · INT - · JUD - · TRA F · DEL R · SET R |

**Field**

| Tên | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| `kind` | negotiated | cố định ở màn này | 相対取引 |
| `lot_id` | chọn lô còn hàng | Bắt buộc | Hiện khối lượng còn lại |
| `buyer_id` | chọn bên mua | Bắt buộc | CHỈ 仲卸 và 売買参加者 |
| `quantity_kg` | numeric(10,2) | Bắt buộc, > 0 |  |
| `unit_price` | numeric(10,2) | Bắt buộc, > 0 | JPY/kg |
| `amount` | numeric(12,2) | hệ thống tính | quantity × unit_price |

**Validation**

- quantity_kg không vượt lot.remaining_kg — trả 409 kèm số còn lại
- Ngày đã khoá sổ → trigger trade_check chặn
- Bên mua phải còn tư cách hợp lệ VÀO NGÀY NGHIỆP VỤ — hàm party_is_qualified
- 買出人 không xuất hiện trong ô chọn — hệ quả của hai cấp pháp lý

**Trạng thái**

- Chốt xong là bất biến. Sửa = ghi dòng đảo (SCR-08)

> LUỒNG CHÍNH, ~90% giá trị giao dịch. Xem ADR-005.

#### SCR-08 · Danh sách và huỷ giao dịch

| | |
|---|---|
| **Nhóm** | FEA-04 |
| **Trang** | `/trades` |
| **Nguồn** | ✅ C — đối chiếu mã nguồn |
| **Quyền** | ADM F · INT - · JUD - · TRA F · DEL R · SET F |

**Field**

| Tên | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| `trade_code` | text | chỉ đọc |  |
| `kind` | negotiated / auction | lọc được | Nhãn 相対 hoặc せり |
| `reverses_id` | uuid | chỉ đọc | Khác null = dòng đảo |
| `lý do huỷ` | text | Bắt buộc khi huỷ | Ghi vào audit_log |

**Validation**

- Không UPDATE, không DELETE — trigger chặn ở database
- Dòng đã là dòng đảo thì không đảo tiếp — trả 409
- Một dòng gốc chỉ đảo một lần — kiểm ở tầng API (chưa có UNIQUE, xem R-06)

**Trạng thái**

- Bình thường · Đã bị đảo (gạch ngang) · Là dòng đảo (nền đỏ)

> Huỷ trả lại khối lượng cho lô. Xem ADR-001.

#### SCR-09 · Ghi kết quả đấu giá

| | |
|---|---|
| **Nhóm** | FEA-04 |
| **Trang** | `/trades` |
| **Nguồn** | ✅ C — đối chiếu mã nguồn |
| **Quyền** | ADM F · INT - · JUD - · TRA F · DEL R · SET R |

**Field**

| Tên | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| `kind` | auction | cố định ở màn này | せり |
| `hand_sign` | text | Tuỳ chọn | Ký hiệu tay, NHÂN VIÊN NHẬP TAY |
| `các field còn lại` | như SCR-07 |  |  |

**Validation**

- Như SCR-07
- hand_sign chỉ ghi khi kind = auction, ngược lại ép null
- KHÔNG có OCR hay nhận dạng ảnh — SCOPE-OUT-02 cấm

**Trạng thái**

- Như SCR-08

> LUỒNG PHỤ, ~10% giá trị. Dùng CHUNG bảng trade với SCR-07.

#### SCR-10 · Lịch sử sửa kết quả đấu giá

| | |
|---|---|
| **Nhóm** | FEA-04 |
| **Trang** | `(gộp vào /trades)` |
| **Nguồn** | 📋 S — suy diễn từ LAB-1 |
| **Quyền** | ADM R · INT - · JUD - · TRA R · DEL - · SET R |

**Field**

| Tên | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| `trade_code gốc` | text | chỉ đọc |  |
| `trade_code dòng đảo` | text | chỉ đọc |  |
| `người thực hiện` | text | chỉ đọc | Từ audit_log |
| `lý do` | text | chỉ đọc | Từ audit_log.detail |

**Validation**

- Chỉ đọc, không sửa được

**Trạng thái**

- —

> Prototype thể hiện lịch sử ngay trong sổ giao dịch — đó là điểm lợi của mô hình ghi-thêm.


### Nhóm FEA-05

#### SCR-11 · Bảng theo dõi giao hàng

| | |
|---|---|
| **Nhóm** | FEA-05 |
| **Trang** | `/deliveries` |
| **Nguồn** | ✅ C — đối chiếu mã nguồn |
| **Quyền** | ADM R · INT - · JUD - · TRA R · DEL F · SET F |

**Field**

| Tên | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| `trade.trade_code` | text | chỉ đọc |  |
| `delivered_kg` | numeric | chỉ đọc | Từng lần |
| `trade.quantity_kg` | numeric | chỉ đọc | Khối lượng hợp đồng |
| `status` | delivery_status | chỉ đọc |  |
| `exception_reason` | text | chỉ đọc |  |

**Validation**

- Chỉ đọc

**Trạng thái**

- pending · partial · completed · exception

> Màn hình hiện trường, dùng được trên tablet.

#### SCR-12 · Ghi nhận lần giao hàng

| | |
|---|---|
| **Nhóm** | FEA-05 |
| **Trang** | `/deliveries` |
| **Nguồn** | ✅ C — đối chiếu mã nguồn |
| **Quyền** | ADM F · INT - · JUD - · TRA - · DEL F · SET F |

**Field**

| Tên | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| `trade_id` | chọn giao dịch | Bắt buộc | Loại dòng đảo |
| `delivered_kg` | numeric(10,2) | Bắt buộc, > 0 |  |
| `status` | completed / partial / exception | Bắt buộc |  |
| `exception_reason` | text | Bắt buộc khi status = exception |  |

**Validation**

- Tổng các lần giao KHÔNG vượt khối lượng hợp đồng ròng — trigger delivery_quantity_check
- Khối lượng hợp đồng ròng = dòng gốc cộng mọi dòng đảo trỏ về nó
- Giao dịch đã bị đảo hết thì không ghi giao hàng được
- Ngày đã khoá sổ thì chặn

**Trạng thái**

- Như SCR-11

> Ràng buộc cộng dồn THÊM Ở LAB-4 sau khi phát hiện thiếu — xem L-02.

#### SCR-13 · Ghi ngoại lệ giao hàng kèm ảnh

| | |
|---|---|
| **Nhóm** | FEA-05 |
| **Trang** | `(chưa làm)` |
| **Nguồn** | 📋 S — suy diễn từ LAB-1 |
| **Quyền** | ADM F · INT - · JUD - · TRA - · DEL F · SET R |

**Field**

| Tên | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| `delivery_id` | chọn lần giao | Bắt buộc |  |
| `loại ngoại lệ` | thiếu / thừa / trả lại / hỏng | Bắt buộc |  |
| `ảnh chứng cứ` | tệp ảnh | Bắt buộc, tối đa 5 ảnh | Lưu S3, lifecycle 3 năm |
| `mô tả` | text | Bắt buộc |  |

**Validation**

- Ảnh tối đa 10 MB mỗi tệp, định dạng JPEG hoặc PNG
- Không xoá được ảnh sau khi ngày đã khoá sổ

**Trạng thái**

- Đã ghi nhận → đã xử lý

> Cần lưu trữ ảnh (NFR-RET-01). Chưa làm — nợ kỹ thuật N-09.


### Nhóm FEA-06

#### SCR-14 · Bảng đối soát ngày

| | |
|---|---|
| **Nhóm** | FEA-06 |
| **Trang** | `/settlement` |
| **Nguồn** | ✅ C — đối chiếu mã nguồn |
| **Quyền** | ADM R · INT - · JUD - · TRA R · DEL R · SET F |

**Field**

| Tên | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| `business_day` | date | chỉ đọc |  |
| `negotiated_amt / auction_amt` | numeric | chỉ đọc | Cộng CẢ dòng đảo |
| `reversal_cnt` | số | chỉ đọc | Số dòng đảo trong ngày |
| `total_amt` | numeric | chỉ đọc | Số ròng |
| `negotiated_share` | % | chỉ đọc | Tỷ trọng thỏa thuận |
| `is_locked` | boolean | chỉ đọc |  |

**Validation**

- Tổng tiền cộng cả số âm của dòng đảo nên ra số ròng đúng
- Đếm số giao dịch phải lọc reverses_id IS NULL

**Trạng thái**

- Đang mở · Đã khoá

> Tỷ trọng thỏa thuận là con số quan trọng nhất của đề.

#### SCR-15 · Khoá ngày nghiệp vụ

| | |
|---|---|
| **Nhóm** | FEA-06 |
| **Trang** | `/settlement` |
| **Nguồn** | ✅ C — đối chiếu mã nguồn |
| **Quyền** | ADM F · INT - · JUD - · TRA - · DEL - · SET F |

**Field**

| Tên | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| `business_day` | date | Bắt buộc |  |
| `lock` | boolean | Bắt buộc | true = khoá, false = mở lại |
| `locked_by` | uuid | hệ thống gán |  |
| `locked_at` | timestamptz | hệ thống gán |  |

**Validation**

- CHỈ ROLE_SETTLEMENT và ROLE_SYS_ADMIN — vai trò khác nhận 403
- Khoá xong thì trigger chặn mọi INSERT giao dịch và giao hàng vào ngày đó
- Mở lại được nhưng ghi audit_log action=UNLOCK_SETTLEMENT_DAY

**Trạng thái**

- Đang mở ⇄ Đã khoá

> Thi hành ở trigger, không phải ở giao diện. Xem ADR-002.

#### SCR-16 · Tạo yêu cầu điều chỉnh sau chốt

| | |
|---|---|
| **Nhóm** | FEA-06 |
| **Trang** | `(chưa làm)` |
| **Nguồn** | 📋 S — suy diễn từ LAB-1 |
| **Quyền** | ADM F · INT - · JUD - · TRA F · DEL R · SET F |

**Field**

| Tên | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| `trade_id` | chọn giao dịch | Bắt buộc | Giao dịch trong ngày đã khoá |
| `loại điều chỉnh` | sửa khối lượng / sửa giá / huỷ | Bắt buộc |  |
| `giá trị mới` | numeric | Bắt buộc khi sửa |  |
| `lý do` | text | Bắt buộc, tối thiểu 20 ký tự |  |
| `người đề nghị` | uuid | hệ thống gán |  |

**Validation**

- Chỉ áp dụng cho giao dịch thuộc ngày ĐÃ khoá sổ
- Người đề nghị phải khác người duyệt (ASM-12)

**Trạng thái**

- Nháp → chờ duyệt → đã duyệt → đã sinh bút toán · bị từ chối

> Prototype dùng dòng đảo trực tiếp, KHÔNG có luồng phê duyệt — xem C-06.

#### SCR-17 · Phê duyệt điều chỉnh

| | |
|---|---|
| **Nhóm** | FEA-06 |
| **Trang** | `(chưa làm)` |
| **Nguồn** | 📋 S — suy diễn từ LAB-1 |
| **Quyền** | ADM F · INT - · JUD - · TRA - · DEL - · SET F |

**Field**

| Tên | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| `danh sách yêu cầu chờ duyệt` | bảng | chỉ đọc |  |
| `quyết định` | duyệt / từ chối | Bắt buộc |  |
| `ý kiến` | text | Bắt buộc khi từ chối |  |

**Validation**

- Người duyệt phải khác người đề nghị — chặn ở tầng database
- Duyệt xong sinh bút toán đảo tự động, không sửa dòng gốc

**Trạng thái**

- Chờ duyệt → đã duyệt · bị từ chối

> Số cấp phê duyệt vẫn là giả định ASM-12, khách chưa xác nhận.

#### SCR-18 · Quản lý tranh chấp

| | |
|---|---|
| **Nhóm** | FEA-06 |
| **Trang** | `(chưa làm)` |
| **Nguồn** | 📋 S — suy diễn từ LAB-1 |
| **Quyền** | ADM F · INT - · JUD R · TRA R · DEL F · SET F |

**Field**

| Tên | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| `đối tượng tranh chấp` | giao dịch / lần giao hàng | Bắt buộc |  |
| `bên khiếu nại` | chọn bên tham gia | Bắt buộc |  |
| `nội dung` | text | Bắt buộc |  |
| `ảnh chứng cứ` | tệp | Tuỳ chọn |  |
| `kết luận` | text | Bắt buộc khi đóng |  |

**Validation**

- Không đóng được tranh chấp nếu chưa có kết luận

**Trạng thái**

- Mới → đang xử lý → đã đóng

> Nghiệp vụ phụ trợ, không chạm quy tắc lõi.


### Nhóm FEA-07

#### SCR-19 · Nhập trạng thái thanh toán

| | |
|---|---|
| **Nhóm** | FEA-07 |
| **Trang** | `(chưa làm, dữ liệu có sẵn)` |
| **Nguồn** | 📋 S — suy diễn từ LAB-1 |
| **Quyền** | ADM F · INT - · JUD - · TRA - · DEL - · SET F |

**Field**

| Tên | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| `party_id` | chọn bên tham gia | Bắt buộc |  |
| `business_day` | date | Bắt buộc |  |
| `due_date` | date | hệ thống tính | business_day + N ngày, N cấu hình |
| `paid_date` | date | Tuỳ chọn | null = chưa thanh toán |

**Validation**

- Một bên một ngày chỉ một dòng — UNIQUE (party_id, business_day)
- paid_date không được trước business_day (chưa có ràng buộc, xem R-07)

**Trạng thái**

- Chưa thanh toán → đã thanh toán

> Giả định ASM-09: bộ phận đối soát NHẬP TAY, không có interface vào.

#### SCR-20 · Kết quả tính thưởng

| | |
|---|---|
| **Nhóm** | FEA-07 |
| **Trang** | `/incentives` |
| **Nguồn** | ✅ C — đối chiếu mã nguồn |
| **Quyền** | ADM R · INT - · JUD - · TRA - · DEL - · SET F |

**Field**

| Tên | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| `business_day` | date | Bắt buộc để tính |  |
| `base_amount` | numeric | hệ thống tính | Tổng giao dịch đã chốt, TRỪ dòng đảo |
| `rate_version_no` | int | hệ thống gán | Phiên bản ĐÃ DÙNG, lưu để giải trình |
| `rate_pct` | numeric | hệ thống lấy | Từ rate_as_of(business_day) |
| `on_time` | boolean | hệ thống tính | paid_date <= due_date |
| `incentive_amt` | numeric | hệ thống tính | floor(base × rate% × tax_factor) |

**Validation**

- Biểu suất tra theo NGÀY NGHIỆP VỤ, không lấy bản mới nhất — GOV-RULE-01
- base_amount <= 0 thì bỏ qua, không tính thưởng
- Trả sau hạn hoặc chưa trả → incentive_amt = 0
- Làm tròn XUỐNG đơn vị JPY — BR-INC-01
- Một bên một ngày một kết quả — UNIQUE (party_id, business_day)

**Trạng thái**

- Chưa tính → đã tính (ghi đè được bằng upsert)

> Thứ tự phép tính và cơ sở áp thuế vẫn là giả định ASM-10. Xem ADR-003.


### Nhóm FEA-08

#### SCR-21 · Quản lý phiên bản biểu suất

| | |
|---|---|
| **Nhóm** | FEA-08 |
| **Trang** | `(chưa làm, dữ liệu có sẵn)` |
| **Nguồn** | 📋 S — suy diễn từ LAB-1 |
| **Quyền** | ADM F · INT - · JUD - · TRA - · DEL - · SET R |

**Field**

| Tên | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| `version_no` | int | hệ thống sinh | Tăng dần, duy nhất |
| `effective_from` | date | Bắt buộc | Được phép đặt ngày tương lai |
| `rate_pct` | numeric(5,2) | Bắt buộc, > 0 |  |
| `tax_factor` | numeric(6,4) | Bắt buộc | Mặc định 1.1000 theo BR-INC-01 |
| `approved_by` | uuid | Bắt buộc | Phải khác người tạo |

**Validation**

- Tối đa 4 phiên bản mỗi năm — GOV-RULE-01
- Không hai phiên bản cùng effective_from (chưa có ràng buộc, xem R-08)
- Người tạo phải khác người duyệt
- Không sửa được phiên bản đã qua ngày hiệu lực

**Trạng thái**

- Nháp → chờ duyệt → có hiệu lực → đã thay thế

> Thiếu trục thời gian thứ hai (recorded_at) — nợ kỹ thuật N-03.

#### SCR-22 · Nhật ký phiên bản quy định

| | |
|---|---|
| **Nhóm** | FEA-08 |
| **Trang** | `(chưa làm)` |
| **Nguồn** | 📋 S — suy diễn từ LAB-1 |
| **Quyền** | ADM R · INT - · JUD - · TRA - · DEL - · SET R |

**Field**

| Tên | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| `version_no / effective_from / rate_pct` |  | chỉ đọc |  |
| `người tạo / người duyệt` | text | chỉ đọc |  |
| `thời điểm ghi nhận` | timestamptz | chỉ đọc | Chính là recorded_at còn thiếu |

**Validation**

- Chỉ đọc, không sửa, không xoá

**Trạng thái**

- —

> Màn hình này chính là chỗ trục thời gian thứ hai sẽ lộ giá trị.


### Nhóm FEA-09

#### SCR-23 · Trung tâm báo cáo

| | |
|---|---|
| **Nhóm** | FEA-09 |
| **Trang** | `(chưa làm)` |
| **Nguồn** | 📋 S — suy diễn từ LAB-1 |
| **Quyền** | ADM F · INT R · JUD R · TRA R · DEL R · SET F |

**Field**

| Tên | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| `loại báo cáo` | RPT-01..12 | Bắt buộc | 9 báo cáo ngày, 3 báo cáo tháng |
| `khoảng thời gian` | date range | Bắt buộc |  |
| `bộ lọc bên tham gia` | chọn nhiều | Tuỳ chọn |  |
| `định dạng xuất` | CSV | Bắt buộc |  |

**Validation**

- Báo cáo ngày chỉ chạy cho ngày ĐÃ khoá sổ
- Khoảng thời gian tối đa 1 năm mỗi lần xuất

**Trạng thái**

- Đang sinh → sẵn sàng tải · lỗi

> Batch sinh báo cáo phải xong trước 11:00 JST — NFR-BATCH-01.


### Nhóm FEA-01

#### SCR-24 · Cổng tra cứu chỉ-đọc cho bên ngoài

| | |
|---|---|
| **Nhóm** | FEA-01 |
| **Trang** | `(chưa làm)` |
| **Nguồn** | 📋 S — suy diễn từ LAB-1 |
| **Quyền** | ADM F · INT - · JUD - · TRA - · DEL - · SET R |

**Field**

| Tên | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| `giao dịch của chính mình` | bảng | chỉ đọc |  |
| `trạng thái giao hàng` | bảng | chỉ đọc |  |
| `kết quả tính thưởng` | bảng | chỉ đọc |  |

**Validation**

- Chỉ thấy dữ liệu của chính bên tham gia đó, không thấy bên khác
- Không thấy đơn giá của giao dịch bên khác

**Trạng thái**

- —

> MÂU THUẪN TRONG TÀI LIỆU KHÁCH: SCOPE-OUT-04 loại cổng tự phục vụ nhưng chỗ khác lại nhắc. Giả định ASM-15 chờ khách trả lời.


### Nhóm FEA-10

#### SCR-25 · Tra cứu nhật ký kiểm toán

| | |
|---|---|
| **Nhóm** | FEA-10 |
| **Trang** | `(chưa làm, dữ liệu có sẵn)` |
| **Nguồn** | 📋 S — suy diễn từ LAB-1 |
| **Quyền** | ADM F · INT - · JUD - · TRA - · DEL - · SET R |

**Field**

| Tên | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| `khoảng thời gian` | date range | Bắt buộc |  |
| `actor_id` | chọn người dùng | Tuỳ chọn |  |
| `action` | chọn loại thao tác | Tuỳ chọn |  |
| `entity / entity_id` | text | Tuỳ chọn |  |
| `detail` | jsonb | chỉ đọc | Hiện dạng cây |

**Validation**

- Chỉ đọc tuyệt đối
- Bảng audit_log PHẢI chặn UPDATE/DELETE — hiện CHƯA có, xem N-05

**Trạng thái**

- —

> Dữ liệu đã ghi thật từ LAB-3, chỉ thiếu màn hình. Ưu tiên cao ở LAB-5.


### Nhóm FEA-11

#### SCR-26 · Hộp thông báo

| | |
|---|---|
| **Nhóm** | FEA-11 |
| **Trang** | `(chưa làm)` |
| **Nguồn** | 📋 S — suy diễn từ LAB-1 |
| **Quyền** | ADM F · INT F · JUD F · TRA F · DEL F · SET F |

**Field**

| Tên | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| `danh sách thông báo` | bảng | chỉ đọc | Mới nhất trước |
| `đã đọc` | boolean | sửa được |  |
| `mức độ` | thường / quan trọng / khẩn | chỉ đọc |  |

**Validation**

- Chỉ thấy thông báo gửi cho vai trò của mình

**Trạng thái**

- Chưa đọc → đã đọc

> Cần bộ điều phối gửi và job thử lại — nợ kỹ thuật N-07.

#### SCR-27 · Cấu hình thông báo

| | |
|---|---|
| **Nhóm** | FEA-11 |
| **Trang** | `(chưa làm)` |
| **Nguồn** | 📋 S — suy diễn từ LAB-1 |
| **Quyền** | ADM F · INT - · JUD - · TRA - · DEL - · SET R |

**Field**

| Tên | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| `loại sự kiện` | chọn từ danh sách | Bắt buộc |  |
| `vai trò nhận` | chọn nhiều | Bắt buộc |  |
| `kênh` | trong ứng dụng / email / cả hai | Bắt buộc |  |
| `ngưỡng cảnh báo` | số | Tuỳ chọn | Ví dụ số ngày trước hạn |

**Validation**

- Mỗi loại sự kiện phải có ít nhất một vai trò nhận

**Trạng thái**

- Bật ⇄ Tắt


### Nhóm FEA-12

#### SCR-28 · Quản lý xuất dữ liệu kế toán

| | |
|---|---|
| **Nhóm** | FEA-12 |
| **Trang** | `(chưa làm)` |
| **Nguồn** | 📋 S — suy diễn từ LAB-1 |
| **Quyền** | ADM F · INT - · JUD - · TRA - · DEL - · SET F |

**Field**

| Tên | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| `business_day` | date | Bắt buộc | Chỉ ngày đã khoá sổ |
| `trạng thái phát hành` | enum | chỉ đọc |  |
| `tên tệp` | text | hệ thống sinh |  |
| `thời điểm đẩy SFTP` | timestamptz | chỉ đọc |  |
| `số lần thử lại` | int | chỉ đọc |  |

**Validation**

- Chỉ xuất được ngày ĐÃ khoá sổ
- Một ngày xuất lại được nhưng phải ghi lý do

**Trạng thái**

- Chờ xuất → đang đẩy → thành công · thất bại (thử lại)

> Phương thức kết nối vẫn là giả định ASM-14 — nợ kỹ thuật N-06.


### Nhóm FEA-13

#### SCR-29 · Quản lý lịch chợ

| | |
|---|---|
| **Nhóm** | FEA-13 |
| **Trang** | `(chưa làm)` |
| **Nguồn** | 📋 S — suy diễn từ LAB-1 |
| **Quyền** | ADM F · INT R · JUD R · TRA R · DEL R · SET F |

**Field**

| Tên | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| `ngày` | date | Bắt buộc |  |
| `loại ngày` | họp chợ / nghỉ | Bắt buộc | Mặc định Chủ nhật nghỉ |
| `ghi chú` | text | Tuỳ chọn |  |

**Validation**

- Không đặt ngày nghỉ cho ngày đã có giao dịch

**Trạng thái**

- Họp chợ ⇄ Nghỉ

> Prototype dùng quy ước cứng Chủ nhật nghỉ trong dữ liệu mẫu.

#### SCR-30 · Danh mục và tham số hệ thống

| | |
|---|---|
| **Nhóm** | FEA-13 |
| **Trang** | `(chưa làm)` |
| **Nguồn** | 📋 S — suy diễn từ LAB-1 |
| **Quyền** | ADM F · INT R · JUD R · TRA R · DEL R · SET R |

**Field**

| Tên | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| `danh mục loài thủy sản` | bảng | sửa được |  |
| `số ngày hạn thanh toán N` | int | sửa được | Dùng ở SCR-19 |
| `ngưỡng cảnh báo hết hạn tư cách` | int | sửa được | Mặc định 30 ngày |
| `thời hạn phiên đăng nhập` | int | sửa được | Mặc định 8 tiếng |

**Validation**

- Chỉ ROLE_SYS_ADMIN sửa được
- Đổi tham số ghi audit_log kèm giá trị cũ và mới

**Trạng thái**

- —

> Prototype để các tham số này ở biến môi trường hoặc hằng số trong mã.

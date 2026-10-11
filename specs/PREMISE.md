# PREMISE — tiền đề bổ sung sau LAB-1

LAB-1 giao ra 14 sản phẩm dựa trên **20 giả định** và một bản ước lượng 912 MD. Từ đó tới LAB-4 có
thêm ba lần ra quyết định: dựng prototype thật ở LAB-3, nhận review chéo ở LAB-2, và đối chiếu
thiết kế với mã nguồn ở LAB-4.

Tài liệu này chốt lại những gì đã đổi, để người đọc bộ spec không phải tự so với LAB-1.

---

## 1. Chốt một hướng ở những chỗ LAB-1 để mở

LAB-1 đề xuất nhiều hướng ở bốn chỗ. Bộ spec này chốt một hướng duy nhất.

| # | LAB-1 để mở | **Chốt ở LAB-4** | Căn cứ |
|---|---|---|---|
| 1 | Kiến trúc: AWS ECS+RDS cho production, Vercel+Supabase cho PoC | **Hai giai đoạn, không phải hai phương án.** PoC chạy Vercel+Supabase; production ECS+RDS. Mô hình dữ liệu giữ nguyên vì cả hai đều PostgreSQL | [ADR-004](./_extra/decisions/ADR-004-vercel-supabase-poc.md) |
| 2 | Native app cho 7 màn hiện trường (ASM-02, 67,2 MD) | **Bỏ khỏi phạm vi PoC.** Màn hình hiện trường làm responsive cho tablet. Native giữ ở production như tuỳ chọn cần khách xác nhận | [ADR-008](./_extra/decisions/ADR-008-bo-native-khoi-poc.md) |
| 3 | Sửa giao dịch sau khi chốt: nhiều cách | **Sổ ghi-thêm, sửa bằng dòng đảo.** Không có cột `is_cancelled`, không có bảng lịch sử riêng | [ADR-001](./_extra/decisions/ADR-001-so-ghi-them.md) |
| 4 | Quy định lưỡng thời gian (bitemporal) | **Chỉ làm một trục `effective_from`.** Trục `recorded_at` hoãn sang production | [ADR-003](./_extra/decisions/ADR-003-tra-quy-dinh-theo-ngay.md) |

---

## 2. Tính năng bỏ bớt so với LAB-1

LAB-1 lên kế hoạch **13 nhóm · 63 chức năng · 30 màn hình**. Prototype LAB-3 dựng **21 chức năng ·
12 mã màn hình**. Bộ spec LAB-4 đặc tả **đủ 30 màn hình**, nhưng phân biệt rõ hai mức tin cậy.

| Nhóm | LAB-1 | Prototype LAB-3 | Spec LAB-4 |
|---|---|---|---|
| FEA-01 Bên tham gia | 6 chức năng | 3 ✅ 1 ◐ 2 ❌ | 3 màn, đặc tả đủ |
| FEA-02 Xác thực | 7 | 2 ✅ 2 ◐ 3 ❌ | 2 màn |
| FEA-03 Lô và thẩm định | 4 | 3 ✅ 1 ❌ | 2 màn |
| FEA-04 Giao dịch | 5 | 4 ✅ 1 ◐ | 4 màn |
| FEA-05 Giao hàng | 6 | 3 ✅ 1 ◐ 2 ❌ | 3 màn |
| FEA-06 Đối soát | 6 | 3 ✅ 1 ◐ 2 ❌ | 5 màn |
| FEA-07 Tiền khuyến khích | 5 | 2 ✅ 3 ❌ | 2 màn |
| FEA-08..13 | 29 | 1 ✅ 28 ❌ | 10 màn |

**Lý do bỏ** ghi đầy đủ ở [`../feature-list.md`](../feature-list.md) của LAB-3. Tóm tắt: các nhóm
FEA-09 đến FEA-13 phần lớn là CRUD, báo cáo và job nền — không chứng minh thêm điều gì về ba quy
tắc nghiệp vụ lõi mà cả dự án xoay quanh.

---

## 3. Giả định đặt thêm sau LAB-1

Tám giả định mới, không có trong 20 giả định của LAB-1:

| # | Giả định mới | Phát sinh từ đâu | Ảnh hưởng nếu sai |
|---|---|---|---|
| P-01 | Mật khẩu demo dùng chung một chuỗi cho cả 6 tài khoản | Cần đổi vai trò nhanh khi minh hoạ phân quyền | Phải thay bằng Supabase Auth hoặc OIDC của khách — nợ N-01 |
| P-02 | Phiên đăng nhập hết hạn sau 8 tiếng | Xấp xỉ một ca chợ (02:00–10:00 JST) | Khách muốn khác thì sửa một hằng số |
| P-03 | Hạng thẩm định chỉ có 3 mức A/B/C | RFP không nêu thang điểm cụ thể | Thang khác → sửa CHECK ở database, không ảnh hưởng luồng |
| P-04 | Một lô bán tách được cho nhiều người mua, trừ dần `remaining_kg` | Suy từ BR-LOT-02 | Nếu một lô chỉ bán nguyên → bỏ cột `remaining_kg`, đơn giản hơn |
| P-05 | Dòng đảo được **miễn** kiểm tra tư cách bên mua | Dòng đảo chỉ sửa sai cho dòng cũ, không phải giao dịch mới | Nếu phải kiểm → không đảo được giao dịch của bên vừa hết hạn giấy phép |
| P-06 | Ngày nghiệp vụ đã khoá vẫn **mở lại được**, có ghi nhật ký | RFP không cấm mở lại | Nếu cấm tuyệt đối → bỏ nhánh unlock, thêm luồng điều chỉnh có phê duyệt |
| P-07 | Chủ nhật chợ nghỉ | Quy ước phổ biến của 産地市場 | Lịch chợ thật khác → cần SCR-29 quản lý lịch |
| P-08 | Tỷ lệ dữ liệu mẫu 90% thỏa thuận / 10% đấu giá | FIG-009 của RFP | — đây là con số của RFP, không phải giả định tự đặt |

---

## 4. Hai lỗi phát hiện ở LAB-4 và đã sửa

Khi đối chiếu thiết kế LAB-1 với mã nguồn LAB-3, hai chỗ *trông như đã làm* nhưng thực tế không
thi hành được. Cả hai đã sửa, commit tách riêng `e445db4`.

| Mã | Lỗi | Đã sửa bằng |
|---|---|---|
| **L-01** | Hai cấp pháp lý tách bằng enum nhưng **không ràng buộc gì** — database vẫn cho gán 許可 cho một 買出人 | trigger `qualification_kind_check` |
| **L-02** | Giao hàng vượt khối lượng hợp đồng **không bị chặn** — hợp đồng 100 kg nhận được 10 lần giao 100 kg | trigger `delivery_quantity_check` |

Cả hai đã kiểm chứng trên database thật: gọi thẳng REST API bằng `service_role`, bỏ qua tầng ứng
dụng — vẫn bị chặn. Chi tiết ở [`_extra/design-vs-code.md`](./_extra/design-vs-code.md) mục 7.

---

## 5. Một khoảng trống vẫn còn

**N-05 — nhật ký kiểm toán sửa được.** Bảng `audit_log` ghi đầy đủ mọi thao tác nhạy cảm, nhưng
chưa chặn UPDATE/DELETE như bảng `trade`. Người có quyền ghi database xoá được dấu vết của chính
mình.

Cùng dạng lỗi với L-01: thứ gì đó *trông như* đã giải quyết. Với một hệ thống mà lý do tồn tại là
giải trình được khi kiểm toán, đây là chỗ hở không nhỏ.

**Chưa sửa ở LAB-4** vì nằm ngoài hai lỗi đã cam kết. Xếp **ưu tiên 1** cho LAB-5.

---

## 6. Bốn câu hỏi vẫn chờ khách trả lời

Bốn giả định của LAB-1 ảnh hưởng trực tiếp tới thiết kế trong bộ spec này, khách **chưa trả lời**:

| Mã | Câu hỏi | Spec nào đang đứng trên giả định này |
|---|---|---|
| ASM-09 | Nguồn dữ liệu trạng thái thanh toán đúng hạn | `SCR_19_SPEC` · `PAYMENT_STATUS_DB` |
| ASM-10 | Thứ tự phép tính thưởng và cơ sở áp thuế | `SCR_20_SPEC` · `INC_CALC_TECH` |
| ASM-12 | Ma trận quyền phê duyệt sửa sau chốt | `SCR_16_SPEC` · `SCR_17_SPEC` |
| ASM-15 | Bên ngoài có tài khoản đăng nhập không | `SCR_24_SPEC` — **mâu thuẫn trong chính RFP** |

`SCR_24` là trường hợp nặng nhất: SCOPE-OUT-04 loại cổng tự phục vụ nhưng chỗ khác trong RFP lại
nhắc tới. **Đừng code màn này trước khi khách xác nhận.**

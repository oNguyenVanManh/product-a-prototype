# Error codes — mã thông điệp dùng chung

> Mọi màn hình và API tham chiếu mã ở đây. **Không tự chế mã mới trong file spec.**

| Mã | Loại | Thông điệp | Dùng ở đâu |
|---|---|---|---|
| `M_01` | Error | {field} là bắt buộc | mọi form có item Required = Có |
| `M_02` | Error | {field} không được để trống | như trên |
| `M_03` | Error | {field} phải lớn hơn {value} | khối lượng, đơn giá |
| `M_10` | Error | Email hoặc mật khẩu không đúng | SCR-01 — **không** phân biệt sai email với sai mật khẩu |
| `M_20` | Error | Lô {lot_code} chỉ còn {n} kg, không bán được {m} kg | SCR-07, SCR-09 |
| `M_21` | Error | Bên mua không có tư cách giao dịch hợp lệ vào ngày {date} | trigger `trade_check` |
| `M_22` | Error | Giấy phép 許可 chỉ cấp cho 仲卸, không cấp cho {kind} | trigger `qualification_kind_check` |
| `M_23` | Error | Chấp thuận 承認 chỉ cấp cho 売買参加者, không cấp cho {kind} | trigger `qualification_kind_check` |
| `M_30` | Error | Ngày nghiệp vụ {date} đã khoá sổ, không ghi thêm được | trigger `trade_check`, `delivery_quantity_check` |
| `M_31` | Error | Bảng trade là sổ ghi-thêm: không được {op} | trigger `trade_no_update`, `trade_no_delete` |
| `M_32` | Error | Giao vượt hợp đồng: đã giao {a} kg, lần này {b} kg, hợp đồng chỉ {c} kg | trigger `delivery_quantity_check` |
| `M_33` | Error | Giao dịch này đã bị huỷ, không ghi giao hàng được | trigger `delivery_quantity_check` |
| `M_40` | Error | Chưa đăng nhập | mọi API, HTTP 401 |
| `M_41` | Error | Chỉ bộ phận đối soát hoặc quản trị mới được khoá sổ | SCR-15, HTTP 403 |
| `M_42` | Error | Không tự tắt tài khoản của chính mình được | SCR-02, HTTP 409 |
| `M_50` | Error | Chưa có biểu suất nào có hiệu lực vào ngày {date} | SCR-20 |

> Thông điệp của các mã `M_2x`–`M_3x` do **trigger PostgreSQL** ném ra và được API trả **nguyên văn**.
> Không thay bằng câu chung chung — người dùng cần biết chính xác vì sao bị chặn.

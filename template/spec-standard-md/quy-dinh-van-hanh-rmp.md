# BỘ QUY ĐỊNH KHI VẬN HÀNH REQUIREMENT MANAGEMENT PROCESS

    

RMP-QD01 · version 1.1.0 · cập nhật 2026-10-05

  RMP mô tả theo bước (ba phase, mỗi phase đánh số bước từ 1 — ví dụ Phase 2 - B1 — và Flow CR). Bộ này gom lại theo chủ đề — liên kết task với tài liệu, trạng thái, phê duyệt, version, tag release — để khi cần tra một chủ đề thì không phải đọc lại từng bước.

  Không có luật mới ở đây. Mỗi quy định đều trỏ về bước gốc trong RMP. Bộ này mâu thuẫn với RMP thì lấy RMP làm chuẩn — và báo để sửa bộ này. Chỗ nào ghi Đề xuất là chưa chốt, chưa phải quy định.

  Ai đọc cái gì: Dev/QA cần §8 là đủ · BrSE cần §1 → §6 · Tech Lead cần §3, §4 · PL cần §2 (phần Pending) và §8.

## MỤC LỤC

    

  - 1. Liên kết giữa task trên GitHub Project và tài liệu trên repo

  - 2. Trạng thái công việc trên GitHub Project

  - 3. Phê duyệt của khách hàng — ô Approve

  - 4. Cách đánh version cho tài liệu

  - 5. Cách đánh tag release cho tài liệu

  - 6. Tài liệu bị huỷ hoặc bị thay thế

  - 7. Trạng thái của từng dòng bên trong tài liệu

  - 8. Dev/QA được làm theo bản nào

## 1. Liên kết giữa task trên GitHub Project và tài liệu trên repo

    

### Mỗi bên giữ một thứ

    

  
    
| 
        | GitHub Project | Management Repository
     |
  
  
    
| 
      Giữ | Việc — Status, người làm, sprint, thảo luận | Tài liệu — nội dung, version, History of change
     |
    
| 
      Ghi ở đây | Bằng chứng gốc và bằng chứng phê duyệt · bốn ô duyệt đi tắt (Phase 3 - B1 việc 2) · comment Pending · quyết định và chi phí của CR | version / updated ở frontmatter · dòng History of change · ô Approve (chỉ link tới bằng chứng trên Issue) · dòng _index.md
     |
    
| 
      Không ghi ở đây | Nội dung tài liệu — không chép nội dung file vào Issue | Status công việc — không ghi vào frontmatter, không ghi vào _index.md
     |
  

### Nguồn sự thật khi ba nơi lệch nhau

    

Mỗi loại thông tin có một nơi gốc:

  
    
| 
      Thông tin | Nơi gốc | Nơi phản chiếu
     |
  
  
    
| 
      version / updated | Frontmatter trong file .md | Dòng cuối History of change · dòng trong _index.md — cập nhật trong cùng PR với file
     |
    
| 
      Trạng thái công việc | Status của task trên GitHub Project | —
     |
    
| 
      Khách hàng đã duyệt version nào | Cột Approve trong History of change | Status Closed của task trên GitHub Project (trừ tài liệu yêu cầu Nhánh A — Closed mà ô Approve trống)
     |
  

version lệch nhau thì lấy frontmatter làm chuẩn, rồi sửa hai nơi còn lại ngay trong lượt đó.

Vì sao tách: phê duyệt là sự kiện đã xảy ra, gắn với đúng một version — ghi cạnh version đó thì nó đi theo file, nằm trong git history, ai mở file cũng đọc được mà không cần quyền Project. Trạng thái công việc đổi liên tục và thuộc về việc — ghi thêm một bản vào file thì hai nơi sớm muộn lệch. Đổi lại: người sửa file không thấy cảnh báo “đã có người làm” ngay trong file — phải xem liên kết trên Project trước khi sửa (§4).

### Ánh xạ task ↔ tài liệu

    

  
    
| 
      Trên GitHub Project | Trên repo | Quy tắc | Bước
     |
  
  
    
| 
      Epic — tracker [Epic], label type:epic (tuỳ dự án) | Không có file, không có mã REQ | Gom nhiều Story — mỗi Story vẫn có tài liệu yêu cầu riêng. Dự án tự quyết có dùng hay không | Phase 1 - B1 việc 1 · RMP Cấu trúc task
     |
    
| 
      Story — tracker [Story], label type:story | Không có file riêng — số của Story là mã REQ, dùng đặt tên file tài liệu yêu cầu | Task cha của tính năng. Tiêu đề chỉ ghi tên tính năng, không nhét mã. Story ghi Nhánh A hay Nhánh B. Không mang Status của tài liệu | Phase 1 - B1 việc 1
     |
    
| 
      Task con viết tài liệu yêu cầu — sub-issue dưới Story, tracker [Documentation], Document Type = Requirement Document, label type:documentation + doctype:requirement | Một file requirements/REQ-{số Story}-{slug}.md + một dòng requirements/_index.md | Một Story một task con viết tài liệu yêu cầu, BrSE tạo, tiêu đề [DOCUMENTATION] {tên tính năng}. Status của tài liệu yêu cầu chạy trên task con này | Phase 1 - B1 việc 2 · Phase 1 - B2, B3, B4
     |
    
| 
      Sub-issue spec — dưới Story, cùng cấp với task con viết tài liệu yêu cầu, tracker [Documentation], Document Type = loại spec, label type:documentation + doctype:spec | Một file spec + một dòng _index.md của loại spec đó | 1 sub-issue = 1 file spec = 1 dòng _index.md. | Phase 2 - B1 việc 2
     |
    
| 
      Issue CR — tracker [Change Request], label type:changerequest | Dòng History mới trong file bị ảnh hưởng, ghi link Issue CR · lý do · người yêu cầu. Hồ sơ CR là chính Issue CR — không lập file trong repo | Không mở tài liệu mới cho CR — sửa đúng file đang có | Phase 1 - B1 việc 1 (b) · Flow CR
     |
    
| 
      Issue Investigation — tracker [Investigation], label type:investigation | Không có file — trả lời trong Issue | Chỉ sửa chữ cho rõ thì tăng PATCH; phải sửa code/testcase thì chuyển sang CR trên chính Issue đó | Phase 1 - B1 việc 1 (c)
     |
    
| 
      Issue phát triển · issue testcase | Không có file — liên kết với sub-issue của spec (sub-issue hoặc trường liên kết) | Không có việc nào trong sprint mà không trỏ về được một spec | Phase 3 - B2 việc 1, 2
     |
    
| 
      Pull Request | Thay đổi trên file | Mô tả PR ghi Refs #{sub-issue} và issue phát triển / testcase liên quan — GitHub tự sinh cross-reference | Phase 2 - B3 việc 1
     |
  

Liên kết ba chiều khi vào phát triển: issue spec ↔ issue phát triển ↔ PR code — gắn ngay đầu Phase 3 - B2, không để tới lúc spec đổi mới đi tìm. Thiếu liên kết này thì không biết phải báo cho ai khi tài liệu đổi version.

Phase 1 - B1 không thêm dòng nào vào _index.md — dòng đầu tiên sinh ở Phase 1 - B2 / B3. Yêu cầu chưa có file thì còn là việc, chỉ sống trên Project. Bảng planned và mã tạm REQ-{YYMM}-{số} trong các _index.md viết theo bản cũ phải gỡ — ISS-57.

### Branch, PR và nhãn

    

  
    
| 
      Loại | Quy ước | Bước
     |
  
  
    
| 
      Nhánh của đợt | ver/{tên} — mỗi version / milestone / phase một nhánh, checkout từ main một lần lúc khởi tạo. Mọi PR tài liệu về nhánh này | QC-01 §2
     |
    
| 
      Nhánh đã release | main — chỉ nhận merge từ nhánh version lúc release, không viết trực tiếp | QC-01 §2
     |
    
| 
      Branch viết tài liệu yêu cầu | feature/req-{slug} — checkout từ ver/{tên}, PR về đúng nhánh đó | Phase 1 - B2, B3 việc 1 · Phase 1 - B2 việc 7 · Phase 1 - B4 việc 1
     |
    
| 
      Branch viết spec | feature/spec-{slug} — checkout từ ver/{tên}, PR về đúng nhánh đó | Phase 2 - B2 việc 1 · Phase 2 - B3 việc 1
     |
    
| 
      Branch sửa theo CR | cr/{slug} — checkout từ nhánh version đang chạy, kể cả CR cho tài liệu đã release; không sửa trực tiếp trên main hay nhánh version | Flow CR việc 4 · QC-01 §2 quy tắc 4
     |
    
| 
      Lý do đóng Issue khi khách hàng bỏ chức năng | dropped-by-client | Phase 3 - B5 việc 6
     |
    
| 
      Thông báo Dev/QA | Request review Dev/QA trên PR; approval của Dev/QA chính là biên nhận đã đọc | Phase 2 - B3 việc 1 · Phase 2 - B6
     |
  

Hệ quả: trong lúc một đợt đang làm, tài liệu đã duyệt của đợt đó chỉ có trên nhánh version — Dev, QA và người review đọc nhánh version, không đọc main (QC-01 §2).

### Bằng chứng nằm trên Issue

    

Mọi bằng chứng lưu trên Issue; repo chỉ link tới.

  
    
| 
      Bằng chứng | Khi nào | Bước
     |
  
  
    
| 
      Yêu cầu gốc của khách hàng (mail, chat, file) | Mở Issue | Phase 1 - B1 việc 1
     |
    
| 
      Tài liệu requirement khách hàng gửi — tên file · phiên bản · ngày nhận | Nhánh A | Phase 1 - B1 việc 3
     |
    
| 
      Đã gửi khách hàng review version nào, ngày nào | Chuyển In Review — ngày này là mốc tính thời hạn review | Phase 1 - B4 việc 1 · Phase 2 - B4 việc 1
     |
    
| 
      Khách hàng xác nhận — mail · biên bản họp ghi rõ nội dung chốt · approval trên PR · comment trên Issue | Trước khi điền ô Approve | Phase 1 - B4 việc 3 · Phase 2 - B4 việc 3
     |
    
| 
      Bốn ô duyệt đi tắt | PL cho vào sprint khi chưa có Approve | Phase 3 - B1 việc 2
     |
    
| 
      Comment vào Pending | Khách hàng bảo dừng | Phase 3 - B4 việc 2
     |
    
| 
      Đánh giá tác động · phê duyệt scope/cost của CR | Trước khi sửa tài liệu | Flow CR việc 2, 3
     |
  

## 2. Trạng thái công việc trên GitHub Project

    

Status gắn trên task tài liệu: task con viết tài liệu yêu cầu và sub-issue của từng file spec — cả hai nằm dưới Story. Story là task cha, không mang Status của tài liệu. Luật gốc: RMP §V.2.

  
    
| 
      Status | Nghĩa | Ai đổi
     |
  
  
    
| 
      New | Mới mở ticket, chưa bắt đầu viết | BrSE, khi mở ticket
     |
    
| 
      In Progress | Đang viết — gồm cả vòng review nội bộ qua PR. Khách hàng trả về phải sửa thì cũng quay về đây | Người viết
     |
    
| 
      In Review | Đã gửi khách hàng, chờ phản hồi — bằng chứng đã gửi lưu trên Issue | BrSE
     |
    
| 
      Closed | Đã chốt mốc chuẩn — khách hàng đã duyệt, đổi cùng lượt điền ô Approve. Nhánh A: đổi khi PR merge, ô Approve trống | Người ghi nhận ô Approve: BrSE (tài liệu yêu cầu) · Tech Lead (spec); Nhánh A: BrSE
     |
    
| 
      Pending | Khách hàng yêu cầu tạm dừng | BrSE đổi; PL quyết khi gỡ
     |
  

### Bảng chuyển trạng thái

    

  
    
| 
      Từ → Đến | Điều kiện | Ai | Bước
     |
  
  
    
| 
      (chưa có ticket) → New | Tạo task con viết tài liệu yêu cầu dưới Story (Phase 1 - B1 việc 2) hoặc sub-issue cho từng file spec (Phase 2 - B1); chưa bắt đầu viết | BrSE | Phase 1 - B1 · Phase 2 - B1
     |
    
| 
      New → In Progress | Bắt đầu viết: file tạo từ template, có dòng trong _index.md cùng PR | Người viết | Phase 1 - B2, B3 · Phase 2 - B2
     |
    
| 
      (review nội bộ qua PR) | Không đổi Status — PR đã mở, reviewer nội bộ đã gắn, task vẫn ở In Progress | — | Phase 1 - B4 · Phase 2 - B3
     |
    
| 
      In Progress → In Review | Review nội bộ xong; đã gửi khách hàng; bằng chứng đã gửi lưu trên Issue | BrSE | Phase 1 - B4 · Phase 2 - B4
     |
    
| 
      In Review → In Progress | Khách hàng trả feedback phải sửa | Người viết | Phase 1 - B4 · Phase 2 - B4
     |
    
| 
      In Review → Closed | PR điền ô Approve đã merge — đổi cùng lượt điền ô Approve (§3) | BrSE (tài liệu yêu cầu) · Tech Lead (spec) | Phase 1 - B4 · Phase 2 - B5
     |
    
| 
      In Progress → Closed | Chỉ tài liệu yêu cầu Nhánh A: PR đưa tài liệu khách hàng vào repo đã review nội bộ và merge. Ô Approve để trống | BrSE | Phase 1 - B2 việc 7
     |
    
| 
      Closed → In Progress | Không được phép. Muốn sửa thì mở CR — Flow CR: ticket CR mới đi lại từ New, tăng version | — | —
     |
    
| 
      In Progress / In Review → Pending | Khách hàng yêu cầu tạm dừng. Bắt buộc comment trên Issue ghi dừng từ nấc nào, ai yêu cầu, lý do, hạn dừng | BrSE | Phase 3 - B4
     |
    
| 
      Pending → (nấc cũ) | Khách hàng cho chạy tiếp, hoặc PL quyết gỡ sau khi quá hạn. Đặt lại đúng nấc đọc từ comment lúc dừng | PL quyết · BrSE đổi | Phase 3 - B4
     |
    
| 
      bất kỳ → (huỷ) | Khách hàng bỏ hẳn, hoặc tài liệu bị thay thế — §6 | BrSE | Phase 3 - B5 · Flow CR
     |
  

Việc PL duyệt đi tắt vào sprint không nằm trong bảng này — nó không phải trạng thái của tài liệu mà là quyền của một công việc, nên nó sống trên Issue (Phase 3 - B1).

### Chỗ hay nhầm

    

1. Review nội bộ không có nấc riêng — vẫn là In Progress. PR đang chờ Tech Lead / QA review thì task chưa được lên In Review; In Review nghĩa là đã gửi khách hàng. Hai nấc khác nhau ở chỗ giục ai: In Progress quá hạn thì PL xếp lại người viết và lịch review nội bộ; In Review quá hạn thì BrSE giục khách hàng và áp luật thời hạn review ở Phase 1 - B4. Đổi In Review từ lúc mới mở PR thì nhìn Project không biết bóng đang ở chân ai.

2. Closed nghĩa là khách hàng duyệt, không phải nội bộ duyệt. Nội bộ duyệt PR xong task vẫn ở In Progress (hoặc In Review nếu đã gửi khách hàng). Ngoại lệ duy nhất là tài liệu yêu cầu Nhánh A: bản do khách hàng phát hành, merge xong là Closed dù ô Approve trống — nên câu “khách hàng đã duyệt chưa” luôn đọc ở ô Approve, không đọc ở Status.

3. Khách hàng quá hạn review không làm task Closed. Quá hạn hoặc đủ tỉ lệ đã review thì team được phát triển theo đường đi tắt có kiểm soát — nhưng task giữ In Review, ô Approve để trống.

4. Pending không phải In Review. In Review = mình đang chờ câu trả lời, việc vẫn chạy được nếu PL đã duyệt đi tắt. Pending = khách hàng bảo tạm dừng.

5. Không có giá trị “huỷ”. Tài liệu bị huỷ thì xoá file — §6.

### Pending — khách hàng yêu cầu tạm dừng

    

Tình huống điển hình: spec màn hình thanh toán, Dev code được 60%, QA viết xong nửa testcase. Khách hàng nhắn “khoan đã, bên tôi đang rà lại luồng này, dừng giúp” — chưa nói bỏ, chỉ nói dừng.

Không có nấc này thì không nấc nào đúng: In Progress và In Review vẫn báo với cả team là “cứ làm tiếp”; huỷ thì xoá file và kéo theo cả thủ tục dọn Phase 3 - B5 — hai tuần sau khách hàng bảo làm tiếp thì đã mất sạch.

  
    
| 
        | Pending (dừng tạm) | Huỷ (bỏ hẳn)
     |
  
  
    
| 
      File tài liệu | Giữ nguyên — ô Approve và tag release đã có không đổi | Xoá khỏi branch + xoá dòng _index.md, cùng PR
     |
    
| 
      Code đã viết | Giữ nguyên | Gỡ, hoặc giữ sau feature flag + chạy regression (Phase 3 - B5)
     |
    
| 
      Testcase | Giữ nguyên | QA gỡ
     |
    
| 
      Issue | Treo ở Blocked, còn estimate | Đóng với lý do dropped-by-client
     |
  

Năm luật của Pending:

  - Issue phát triển và issue testcase chuyển Blocked — không đóng, không xoá estimate, để cuối sprint đếm được effort đang treo.

  - Code đã viết giữ trên branch, không merge. Đã lỡ merge thì để sau một feature flag tắt.

  - Hạn dừng ghi trên Issue. Quá hạn thì PL quyết một trong ba: gia hạn có lý do · huỷ · gỡ Pending.

  - Gỡ Pending là đặt lại đúng nấc cũ, đọc từ comment lúc dừng — không đoán, không tự nâng lên nấc cao hơn.

  - Khách hàng nói không rõ thì mặc định là Pending, không phải huỷ. BrSE hỏi lại dừng trong bao lâu. Từ Pending sang huỷ lúc nào cũng được và không mất gì; ngược lại thì đã mất code đã gỡ và regression đã chạy.

Comment bắt buộc trên Issue khi vào Pending — đây là chỗ nấc cũ sống, vì file không ghi trạng thái:

  Pending từ In Review (dòng cuối History 1.3.0 chưa có Approve, PL đã duyệt đi tắt; baseline 1.2.0 — dòng có Approve gần nhất — vẫn hiệu lực) · yêu cầu: Tanaka-san, mail 19/09 · lý do: khách hàng rà lại luồng thanh toán · hạn dừng: 2026-10-03

Không có comment này thì lúc khách hàng bảo chạy tiếp, không ai dám đặt lại In Review.

## 3. Phê duyệt của khách hàng — ô Approve

    

Luật gốc nằm ở đúng bước dùng nó: Phase 1 - B2, B3 việc 1 (tạo dòng, ô trống) · Phase 1 - B4 việc 4 (tài liệu yêu cầu) · Phase 2 - B5 việc 2 (spec).

Ô Approve là cột cuối của bảng History of change, ghi cho từng version:

| 4 | 1.2.0 | Updated | Thêm E5 khoá tài khoản | 2026-09-30 | an.nguyen | ✅ 2026-10-01 · [#123](link) |
| 5 | 1.3.0 | Updated | CR #245 đổi luồng OTP   | 2026-10-05 | an.nguyen |                              |

  
    
| 
      Quy định | Nội dung
     |
  
  
    
| 
      Ai phê duyệt | Chỉ khách hàng — người có quyền chốt cuối phía khách hàng. Nội bộ duyệt PR không điền ô này
     |
    
| 
      Ai ghi nhận | BrSE cho tài liệu yêu cầu · Tech Lead cho spec
     |
    
| 
      Cách ghi | ✅ YYYY-MM-DD · [bằng chứng](link) — ngày khách hàng xác nhận, link tới bằng chứng đã lưu trên Issue
     |
    
| 
      Điều kiện điền | Có bằng chứng xác nhận trên Issue · không còn dòng hở nào trong tài liệu (§7)
     |
    
| 
      Cách điền | Qua PR như mọi sửa đổi khác · đã điền thì không xoá — nó ghi lại một sự kiện đã xảy ra
     |
    
| 
      Đi cùng | Status Closed đổi sau khi PR điền ô Approve merge, không đi trước. Hai nơi lệch nhau thì ô Approve là chuẩn
     |
    
| 
      Không đi cùng | Không gắn tag lúc khách hàng duyệt — tag chỉ gắn khi release source code (§5)
     |
  

Đọc cột Approve:

  - Bản hiện tại đã được duyệt khi và chỉ khi dòng cuối History có ô Approve.

  - Baseline = version ở dòng cuối cùng có ô Approve. Từ baseline trở đi mọi thay đổi đi qua Flow CR.

  - Dòng CR mới để trống ô Approve cho tới khi khách hàng duyệt — trong lúc đó baseline vẫn là dòng có Approve trước nó.

Ngoại lệ — Nhánh A (khách hàng tự viết tài liệu requirement, dự án đưa vào repo): tài liệu yêu cầu không qua Phase 1 - B4, ô Approve để trống. Mốc chuẩn là bản khách hàng gửi, ghi ở source và trên Issue. Task con viết tài liệu yêu cầu chuyển Closed khi PR merge (Phase 1 - B2 việc 7). Spec viết từ tài liệu đó vẫn qua Phase 2 - B5 bình thường.

## 4. Cách đánh version cho tài liệu

    

Luật gốc: RMP §V.3 · Phase 2 - B5 việc 1 · Phase 3 - B2 việc 2.

### Dãy version

    

  - Semantic Versioning MAJOR.MINOR.PATCH (chốt 2026-08-25).

  - File mới tạo từ template: 0.1.0, History bắt đầu từ dòng 1 · 0.1.0 · Add New · Khởi tạo.

  - Version đầu tiên khách hàng duyệt là 1.0.0 — tăng lên 1.0.0 ngay trong PR điền ô Approve, ô Approve nằm ở chính dòng 1.0.0 đó. Các lần sau theo SemVer.

### Khi nào bắt buộc tăng version

    

  
    
| 
      Tình trạng tài liệu | Sửa thì phải làm gì
     |
  
  
    
| 
      Chưa dòng nào có Approve · chưa có issue phát triển / testcase liên kết đang mở | Sửa tự do, cập nhật updated
     |
    
| 
      Chưa dòng nào có Approve · đã có issue phát triển / testcase liên kết đang mở | Ba việc bắt buộc (dưới)
     |
    
| 
      Đã có dòng có Approve | Mở CR, đi Flow CR — duyệt scope/cost trước, sửa sau · ba việc bắt buộc · dòng History có link Issue CR
     |
  

Ba việc bắt buộc khi sửa (Phase 3 - B2 việc 2): (1) thêm dòng History of change · (2) tăng version · (3) comment vào issue phát triển và issue testcase đang mở. Áp kể cả khi tài liệu chưa được duyệt — có người đang làm theo nó là đủ.

Trước khi sửa một tài liệu, xem task tài liệu trên Project có issue phát triển / testcase liên kết đang mở không — file không tự báo điều này (§1).

### Chọn mức tăng

    

  
    
| 
      Mức | Khi nào | Ví dụ
     |
  
  
    
| 
      MAJOR | Đổi hoặc huỷ nghiệp vụ, đổi luồng, đổi hợp đồng dữ liệu, tái đánh số mã item / FR — Dev/QA phải sửa lại code hoặc testcase | 1.4.2 → 2.0.0
     |
    
| 
      MINOR | Bổ sung item / yêu cầu / giả định / mã lỗi mới, không phá vỡ cái đang có | 1.4.2 → 1.5.0
     |
    
| 
      PATCH | Sửa chữ, làm rõ diễn đạt, sửa link hoặc typo, đồng bộ kiểu dữ liệu — không đổi hành vi | 1.4.2 → 1.4.3
     |
  

Câu hỏi để chọn: Dev/QA có phải sửa code hoặc testcase đã làm không? Có → MAJOR. Chỉ phải làm thêm → MINOR. Không phải làm gì → PATCH.

### Một dòng History of change

    

  - Cột theo template: No · Version · Action · Nội dung thay đổi · Ngày · Người sửa · Approve (Database Design có thêm cột Sheet / Bảng).

  - Action lấy theo giá trị ghi ở comment dưới bảng của chính template đó — bộ giá trị hiện còn lệch giữa các template (ISS-34).

  - Dòng do CR sinh ra ghi rõ link Issue CR · lý do · người yêu cầu ở cột Nội dung thay đổi.

  - Một version = một dòng. Không gộp hai version vào một dòng, không sửa dòng cũ.

### Ba nơi phải khớp

    

version / updated ở frontmatter = dòng cuối History of change = dòng trong _index.md — sửa trong cùng một PR. Lệch thì lấy frontmatter làm chuẩn, sửa hai nơi kia ngay trong lượt đó.

### Không tách file theo version

    

Một tài liệu = một file; version sống trong frontmatter, History và git history (QC-01 ràng buộc 4). Không tạo -v2, -final. Tách file thì _index.md có hai dòng cho cùng một tài liệu và câu hỏi “bản nào đang hiệu lực” quay lại y như cũ. Chi phí thật của việc đổi version không nằm ở chỗ lưu, mà ở chỗ báo cho đúng người — xử lý bằng ba việc bắt buộc ở trên và Phase 2 - B6.

Version tài liệu không phải version sản phẩm. Một file trên nhánh ver/2.0 vẫn mang version riêng của nó (vd 0.3.0); 2.0 chỉ cho biết file đó được làm trong đợt nào (QC-01 §2).

  Chưa chốt: sửa PATCH trên tài liệu đã có Approve có được đi tắt, không qua CR không — hiện vẫn phải mở CR (ISS-58).

## 5. Cách đánh tag release cho tài liệu

    

Luật gốc: RMP §V.3 · QC-01 §2.

### Đã chốt

    

  - Tag release tài liệu chỉ gắn khi release source code của version / milestone / phase tương ứng — tài liệu được tag cùng lượt với bản code release. Không gắn tag khi khách hàng duyệt: phê duyệt chỉ ghi ở ô Approve (§3). Thủ tục gắn tag thuộc quy trình release (ISS-49).

  - Tên tag = tên tag release của source code, thêm tiền tố req- (tài liệu yêu cầu) hoặc spec- (spec). Ví dụ source code tag v1.0.0 → req-v1.0.0 và spec-v1.0.0; tag phase-1 → req-phase-1 và spec-phase-1. Gắn trên main, tại commit merge nhánh version lúc release (QC-01 §2: main chỉ nhận merge lúc release).

  - Baseline = version có ô Approve. Từ baseline trở đi mọi thay đổi đi qua Flow CR.

  - Dòng cuối History of change phải khớp version / updated ở frontmatter, và khớp _index.md — ba nơi không được lệch (§4).

### Baseline, bản release và bản thi hành

    

Câu “bản nào là bản mới nhất” có ba câu trả lời khác nhau, và hỏi nhầm câu là nguồn gốc của phần lớn tranh cãi về version.

  
    
| 
      Khái niệm | Đọc ở | Trả lời câu | Dùng để
     |
  
  
    
| 
      Baseline | Dòng cuối cùng có ô Approve trong History | Khách hàng đã duyệt bản nào? | Cửa vào sprint (Phase 3 - B1); mốc để tính CR
     |
    
| 
      Bản release | Nội dung file tại commit được gắn tag release | Phần mềm đã release chạy theo bản nào? | Nghiệm thu, điều tra lỗi production
     |
    
| 
      Bản thi hành | Nội dung file tại commit mới nhất của nhánh version ver/{tên} của đợt đang làm | Nội dung mới nhất là gì? | Mọi thay đổi tiếp theo xuất phát từ đây
     |
  

            tag spec-v1.0.0             tag spec-v1.1.0     ← bản release
                  ▼                           ▼
main:     ───────R1──────────────────────────R2           R1, R2 = commit merge lúc release
                  │                           ▲
ver/1.1:          └───A────B────C────D        │  (merge lên main khi release 1.1)
                                     ▲────────┘
                                     commit mới nhất của ver/1.1 = bản thi hành

  - Bản release có thể chưa có Approve — release trước khi khách hàng duyệt là ca có thật (ISS-69). Tag không phải giấy phép làm việc; giấy phép đọc từ ô Approve (§8).

  - Ba bản trùng nhau khi tài liệu vừa được duyệt, vừa release, chưa sửa thêm.

  - Lệch nhau là bình thường trong ba ca: (a) tài liệu chưa release lần nào — chưa có bản release; (b) sau release đã có version mới chờ release tiếp; (c) đi tắt — đang code trên bản chưa duyệt.

  - Pending không làm mất baseline — baseline đọc từ ô Approve, không đọc từ Status.

### Chưa chốt

    

  
    
| 
      Câu hỏi | Dấu vết
     |
  
  
    
| 
      Ai gắn tag, gắn ở bước nào của quy trình release | ISS-49
     |
    
| 
      Release mà dòng cuối History chưa có Approve thì release note có phải ghi rõ “chưa duyệt” không | ISS-69
     |
  

## 6. Tài liệu bị huỷ hoặc bị thay thế

    

Luật gốc: Phase 3 - B5.

  - Tài liệu bị huỷ thì xoá file khỏi branch và xoá dòng trong _index.md, cùng một PR.

  - Lý do và ai yêu cầu bỏ ghi trên Issue / CR và trong commit message. Nội dung cũ vẫn lấy lại được từ git history và tag release.

  - Không đổi trạng thái, không để file lại với dấu “hết hiệu lực”, không dùng deprecated / superseded_by, không tạo bản sao (-v2, -final).

  - ID không tái sử dụng — kể cả khi file đã bị xoá.

  - Tài liệu bị thay thế cũng xoá như vậy: tài liệu mới có id mới, Issue/CR của nó ghi rõ thay cho id nào.

  - Khách hàng bỏ chức năng đã code thì chạy đủ thủ tục dọn ở Phase 3 - B5 (gỡ code hoặc feature flag, regression, gỡ testcase, release note, đóng issue dropped-by-client).

  - Chưa chắc bỏ hẳn hay chỉ dừng thì mặc định Pending (§2).

## 7. Trạng thái của từng dòng bên trong tài liệu

    

Cùng một chữ “đã chốt” có hai cấp độ, và lẫn hai cấp là nguồn gốc của ISS-34: cấp tài liệu (ô Approve ở dòng cuối History of change) và cấp dòng bên trong tài liệu — mỗi bảng dữ liệu, mỗi item màn hình, mỗi mã FR.

  
    
| 
      Cấp dòng | Nghĩa | Ràng buộc
     |
  
  
    
| 
      chốt | Khách hàng đã đồng ý dòng này | —
     |
    
| 
      tạm | Đang làm theo phương án này nhưng chưa chốt | Bắt buộc có chủ + hạn chốt, và phải nằm trong mục “Câu hỏi mở / TBD”
     |
    
| 
      hở | Chưa có phương án | Bắt buộc nằm trong mục “Câu hỏi mở / TBD”
     |
  

Dòng bị huỷ thì gạch dòng + ghi lý do, không xoá — tài liệu còn hiệu lực thì người đọc cần thấy dòng nào đã bỏ và vì sao. (Xoá chỉ áp cho cả file bị huỷ.)

Ba luật nối hai cấp:

  - Chỉ điền ô Approve khi không còn dòng hở nào.

  - Dòng tạm được phép tồn tại trong bản đã có Approve — nhưng mỗi dòng phải có chủ, có hạn, và phải được liệt kê ở mục “Câu hỏi mở / TBD”.

  - Có dòng tạm nằm trong phần đang được code → phần đó phải đi đường đi tắt có kiểm soát (PL duyệt, đủ bốn ô trên Issue — Phase 3 - B1), kể cả khi bản hiện tại đã có Approve.

Vì sao luật 2 là bắt buộc: tài liệu đã có Approve mà bên trong còn dòng tạm đang được code thì nhìn từ ngoài y hệt ca đúng luồng. Liệt kê ở “Câu hỏi mở / TBD” là cách duy nhất để người đọc thấy.

  Chưa chốt: bộ ba giá trị dùng tiếng Việt hay tiếng Anh, và áp cho những template nào — ISS-34.

## 8. Dev/QA được làm theo bản nào

    

### Tra nhanh

    

Đọc từ trên xuống, dừng ở dòng đầu tiên khớp.

Task tài liệu trên Project   → DỪNG. Không code, không viết testcase, không đóng issue.
đang Pending?                   Hỏi BrSE bao giờ gỡ. Code đã viết giữ nguyên trên branch.

Không còn file / không còn   → Tài liệu đã bị huỷ. Không dùng. Lý do ghi trên Issue/CR.
dòng trong _index.md?

Dòng CUỐI của History        → Dùng được — làm theo bản hiện tại của file.
có ô Approve?                   Trước khi làm, đọc mục "Câu hỏi mở / TBD" trong file —
                                dòng `tạm` ở đó là phần khách hàng CHƯA chốt, đừng code vội.

Có ô Approve ở dòng cũ hơn,  → Bản hiện tại CHƯA duyệt (thường là CR đang chạy).
dòng cuối thì trống?            Làm theo version của dòng có Approve gần nhất (lấy trong
                                git history), trừ khi PL đã duyệt đi tắt trên Issue (Phase 3 - B1)  .

Chưa dòng nào có Approve     → Chưa được làm, TRỪ KHI PL đã duyệt đi tắt trên Issue
                                với đủ bốn ô (Phase 3 - B1). Khi đó chỉ làm phần ỔN ĐỊNH;
                                phần ghi ở ô "đang tranh luận" trên Issue thì KHÔNG làm.

_index.md không có cột trạng thái. Muốn biết đã duyệt chưa: mở file, nhìn ô Approve ở dòng cuối History. Muốn biết việc đang ở nấc nào: mở task trên Project.

### Ba tình huống — ô Approve × issue phát triển

    

  
    
| 
      Bản hiện tại (dòng cuối History) | Issue phát triển liên kết | Tình huống | Sửa tài liệu thì
     |
  
  
    
| 
      chưa có Approve | chưa có issue nào In progress | Đúng luồng — chưa duyệt thì chưa làm | Sửa tự do, cập nhật updated
     |
    
| 
      có Approve | đã / đang làm | Đúng luồng — duyệt rồi mới làm | Qua Flow CR, tăng version, báo người đang làm
     |
    
| 
      chưa có Approve | đã có issue In progress | Rủi ro — đang code trên bản khách hàng chưa duyệt. Chỉ được phép khi PL đã duyệt đi tắt với đủ bốn ô trên Issue (Phase 3 - B1) | Ba việc bắt buộc (§4); khách hàng đổi thì đếm thiệt hại theo Phase 3 - B3
     |
  

Ca thứ tư — có Approve, chưa ai làm — là bình thường: đã duyệt, chờ vào sprint.

Follow-up ca rủi ro: PL theo dõi bằng bốn ô trên Issue — nhất là ô 4, hạn khách hàng phải chốt. Muốn biết issue nào đang code trên bản chưa duyệt thì issue phát triển phải liên kết với task tài liệu (§1).

Bản release không phải giấy phép làm việc. Nó dùng để đối chiếu với phần mềm đã release (§5); quyền được làm đọc từ ô Approve, Status trên Project và phê duyệt đi tắt trên Issue.

Quyết định gốc: decision-log ngày 2026-10-01 — thay quyết định 2026-09-21 và 2026-09-23 về hai trường status và impl_started. Lập luận của hệ cũ: giải pháp 2026-09-20 — hệ thống status.

  Lịch sử thay đổi của tài liệu — mới nhất lên đầu

  
    - 1.1.0 hồ sơ CR là Issue CR (2026-10-05): dòng Issue CR ở §1 bỏ change-requests/; dòng History ghi link Issue CR, không có mã CR riêng.
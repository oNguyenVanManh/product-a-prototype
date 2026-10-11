# QUY TRÌNH QUẢN LÝ YÊU CẦU DỰ ÁN PHÁT TRIỂN PHẦN MỀM

    
(REQUIREMENT MANAGEMENT PROCESS — RMP)

RMP · version 1.1.1 · cập nhật 2026-10-06

## MỤC LỤC

    

  - I. MỤC ĐÍCH

  - II. PHẠM VI VÀ ĐỐI TƯỢNG ÁP DỤNG

  - III. THUẬT NGỮ VÀ TỪ VIẾT TẮT

  - IV. CÔNG CỤ VÀ NƠI LƯU TRỮ

  - V. VÒNG ĐỜI VÀ TRẠNG THÁI TÀI LIỆU
    
      1. Cấu trúc task trên GitHub Project

      - 2. Trạng thái công việc — trên GitHub Project

      - 3. Version và tag

    
  
  - VI. QUY TRÌNH CHI TIẾT
    
      6.1 Lưu đồ quy trình

      - 6.2 Mô tả quy trình
        
          6.2.1 Phase 1 — Phân tích yêu cầu

          - 6.2.2 Phase 2 — Đặc tả & phê duyệt

          - 6.2.3 Phase 3 — Thực thi

        
      
      - 6.3 Flow CR

    
  
  - VII. BIỂU MẪU VÀ PHỤ LỤC

## I. MỤC ĐÍCH

    

Tài liệu này quy định quy trình chuẩn về việc tiếp nhận, phân tích, đặc tả, phê duyệt, lưu trữ và quản lý thay đổi của yêu cầu trong các dự án phát triển phần mềm của Công ty.

Vấn đề quy trình này giải quyết: tài liệu nằm rải nhiều nơi, không biết bản nào đúng · yêu cầu chốt miệng, không có bằng chứng · Dev/QA làm trên bản cũ mà không ai báo · khách hàng đổi ý giữa chừng mà không đếm được chi phí.

Bốn kết quả mong đợi khi áp dụng:

  - Chuẩn hoá công cụ và định dạng. Toàn bộ tài liệu yêu cầu và spec ở dạng Markdown trong Management Repository trên GitHub (Docs-as-Code), review bằng Pull Request. Bỏ hẳn việc mỗi người giữ một file Excel/Google Sheet lẻ.

  - Kiểm soát phiên bản. Mọi bên (BrSE, Dev, QA, PL, Client) luôn biết bản nào là bản mới nhất, bản nào khách hàng đã duyệt, bản nào đã release.

  - Quản lý thay đổi. Thay đổi sau khi đã chốt baseline phải đi qua cửa CR: có đánh giá tác động, có người duyệt phạm vi và chi phí, có dấu vết lý do.

  - Phân định trách nhiệm rõ. Mỗi bước có đúng một PIC chính, ghi ở đầu mỗi bước trong §VI.

## II. PHẠM VI VÀ ĐỐI TƯỢNG ÁP DỤNG

    

### 1. Phạm vi áp dụng

    

  - Bắt buộc với toàn bộ dự án phát triển phần mềm tại Công ty: dự án Outsource, dự án Product nội bộ, dự án Bảo trì/R&D.

  - Áp dụng xuyên suốt từ lúc tiếp nhận yêu cầu, đặc tả, phát triển, kiểm thử cho tới khi yêu cầu thay đổi.

  - Dự án đang chạy chuyển sang quy trình này theo lộ trình riêng: không hồi tố với tài liệu đã viết trước thời điểm áp dụng, nhưng mọi yêu cầu mới kể từ thời điểm đó đi theo quy trình này.

### 2. Đối tượng áp dụng

    

  
    
| 
      Vai trò | Viết tắt | Xuất hiện từ bước
     |
  
  
    
| 
      Bridge Software Engineer | BrSE | Phase 1 - B1
     |
    
| 
      Project Leader | PL | Phase 2 - B5 (duyệt merge PR), Phase 3, Flow CR (duyệt scope/cost)
     |
    
| 
      Product Owner / Khách hàng | PO / Client | Phase 1 - B4, Phase 2 - B4
     |
    
| 
      Tech Lead | Tech Lead | Phase 2 - B2 (Technical Leader viết spec), Phase 2 - B3, Phase 2 - B5
     |
    
| 
      Software Engineer | Dev | Phase 2 - B6 (nhận thông báo), Phase 3
     |
    
| 
      Quality Assurance | QA | Phase 2 - B2 (QA Leader viết Screen Specification), Phase 2 - B3, Phase 3
     |
  

Designer không phải vai trò của quy trình này — design là đầu vào của Phase 2 - B2 và đi theo quy trình thiết kế riêng.

## III. THUẬT NGỮ VÀ TỪ VIẾT TẮT

    

### 1. Định nghĩa

    

  - Requirement (Yêu cầu) — WHAT: khả năng hoặc điều kiện mà hệ thống phải đáp ứng để giải quyết bài toán nghiệp vụ của người dùng, hoặc để tuân thủ một ràng buộc kỹ thuật. Nơi ở: requirements/.

  - Specification / Spec (Đặc tả) — HOW: tài liệu mô tả cách đạt được yêu cầu — màn hình, hợp đồng API, schema, luồng xử lý, tiêu chí nghiệm thu. Nơi ở: specs/{loại}/{feature}/. Có 5 loại theo QC-01 §2.

  - Baseline (Mốc chuẩn): version tài liệu đã được khách hàng duyệt (có ô Approve ở dòng History of change của version đó). Sau khi chốt baseline, mọi chỉnh sửa phải đi qua quản lý thay đổi.

  - Story (task cha) / task con viết tài liệu yêu cầu: yêu cầu mới mở một Issue tracker [Story] làm task cha của tính năng — số của Story là mã REQ. Dưới Story là các task con: một task con viết tài liệu yêu cầu (BrSE tạo ở Phase 1 - B1) và mỗi file spec một sub-issue (Phase 2 - B1). Status của tài liệu chạy trên task con, không chạy trên Story.

  - Epic: Issue tracker [Epic] gom nhiều Story — dự án tự quyết có dùng hay không. Mỗi Story vẫn có tài liệu yêu cầu riêng; Epic không có file, không có mã REQ. Xem Cấu trúc task.

  - Change Request — CR: yêu cầu sửa đổi, bổ sung hoặc loại bỏ một phần/toàn bộ nội dung đã chốt trong baseline. Áp dụng cho cả tài liệu yêu cầu và spec, dùng chung một form.

  - Investigation: yêu cầu điều tra một hành vi hiện có, kết thúc bằng câu trả lời ghi trong Issue. Nếu điều tra ra là phải sửa code hoặc testcase thì chuyển sang loại CR, không tự sửa tiếp.

  - Docs-as-Code: quản lý tài liệu như quản lý mã nguồn — file Markdown, lưu trên GitHub, kiểm soát phiên bản bằng Git tag/branch/Pull Request.

  - Trạng thái công việc của tài liệu: Status của task tương ứng trên GitHub Project — New → In Progress (đang viết, gồm cả review nội bộ) → In Review (đã gửi khách hàng) → Closed (đã chốt mốc chuẩn — khách hàng đã duyệt, hoặc ở Nhánh A là bản khách hàng phát hành đã merge); Pending (khách hàng yêu cầu tạm dừng). Không ghi trong file. Chi tiết: §V.2.

  - Cột Approve: cột cuối của History of change, ghi ngày khách hàng duyệt từng version kèm bằng chứng; để trống là chưa duyệt. Cách ghi: Phase 1 - B4 việc 4 (tài liệu yêu cầu) · Phase 2 - B5 việc 2 (spec).

  - Bản release / bản thi hành: hai câu trả lời khác nhau cho câu hỏi “bản nào mới nhất” — bản đã gắn tag release cùng source code để đối chiếu với phần mềm đã release, và bản mới nhất trên nhánh version ver/{tên} của đợt đang làm — bản Dev/QA phải làm theo ngay lúc này. Chi tiết: Bộ quy định vận hành §5.

  - PIC (Person In Charge): người chịu trách nhiệm chính của một bước. Mỗi bước đúng một PIC.

### 2. Từ viết tắt

    

  
    
| 
      Viết tắt | Đầy đủ
     |
  
  
    
| 
      RMP | Requirement Management Process
     |
    
| 
      QC-01 | Quy chuẩn Cấu trúc Thư mục Spec trên GitHub
     |
    
| 
      BrSE | Bridge Software Engineer
     |
    
| 
      PL | Project Leader
     |
    
| 
      PO | Product Owner
     |
    
| 
      QA | Quality Assurance
     |
    
| 
      AC | Acceptance Criteria
     |
    
| 
      CR | Change Request
     |
    
| 
      PR | Pull Request
     |
    
| 
      FR / NFR | Functional Requirement / Non-Functional Requirement
     |
    
| 
      SemVer | Semantic Versioning
     |
  

## IV. CÔNG CỤ VÀ NƠI LƯU TRỮ

    

### 1. Hai hệ thống, hai loại nội dung

    

  
    
| 
      Hệ thống | Giữ cái gì | Ví dụ
     |
  
  
    
| 
      GitHub Project | Việc — trạng thái công việc, người làm, sprint, thảo luận | Epic (gom Story, tuỳ dự án), Story (task cha của tính năng), task con viết tài liệu yêu cầu, sub-issue của từng file spec, nhãn phân loại, form CR
     |
    
| 
      Management Repository | Tài liệu — nội dung đã viết ra và version của nó | requirements/, specs/{loại}/{feature}/, các _index.md — CR không có file trong repo, hồ sơ CR là Issue CR
     |
  

Cấu trúc thư mục, quy tắc đặt tên và 5 ràng buộc bắt buộc nằm ở QC-01.

## V. VÒNG ĐỜI VÀ TRẠNG THÁI TÀI LIỆU

    

  Mục này chỉ giữ luật. Quy định gom theo chủ đề — liên kết task ↔ tài liệu, Status, ô Approve, version, tag release — và phần tra theo tình huống nằm ở Bộ quy định khi vận hành RMP.

### 1. Cấu trúc task trên GitHub Project

    

Epic #200 "Hệ thống đặt lịch đa chi nhánh"
├── Story #201 "Đặt lịch"                       ← REQ-201
│   ├── #202 Viết tài liệu yêu cầu              → REQ-201-dat-lich.md
│   ├── #210 Screen Specification
│   └── #211 API Design
└── Story #220 "Quản lý khung giờ chi nhánh"    ← REQ-220
    ├── #221 Viết tài liệu yêu cầu              → REQ-220-khung-gio.md
    └── ...

### 2. Trạng thái công việc — trên GitHub Project

    

### 3. Version và tag

    

  - Semantic Versioning MAJOR.MINOR.PATCH. Bản nháp đầu tiên 0.1.0; version đầu tiên khách hàng duyệt là 1.0.0.

  - Từ khi đã có version được duyệt, mỗi lần sửa bắt buộc tăng version và thêm một dòng History of change:

  
    
| 
      Mức | Khi nào | Ví dụ
     |
  
  
    
| 
      MAJOR | Đổi hoặc huỷ nghiệp vụ, đổi luồng, đổi hợp đồng dữ liệu, tái đánh số mã item — Dev/QA phải sửa lại code hoặc testcase | 1.4.2 → 2.0.0
     |
    
| 
      MINOR | Bổ sung item / yêu cầu / giả định mới, không phá vỡ cái đang có | 1.4.2 → 1.5.0
     |
    
| 
      PATCH | Sửa chữ, làm rõ diễn đạt, sửa link hoặc typo, đồng bộ kiểu dữ liệu — không đổi hành vi | 1.4.2 → 1.4.3
     |
  

  - Tag release tài liệu chỉ gắn khi release source code của version / milestone / phase tương ứng — tài liệu được tag cùng lượt với bản code release. Không gắn tag khi khách hàng duyệt: phê duyệt chỉ ghi ở ô Approve. Thủ tục gắn tag thuộc quy trình release.

  - Tên tag = tên tag release của source code, thêm tiền tố req- (tài liệu yêu cầu) hoặc spec- (spec). Ví dụ source code tag v1.0.0 → req-v1.0.0 và spec-v1.0.0; tag phase-1 → req-phase-1 và spec-phase-1. Gắn trên main, tại commit merge nhánh version lúc release (QC-01 §2: main chỉ nhận merge lúc release).

  - Baseline = version có ô Approve. Từ baseline trở đi mọi thay đổi đi qua Flow CR.

  - Dòng cuối History of change phải khớp version/updated ở frontmatter, và khớp _index.md — ba nơi không được lệch.

## VI. QUY TRÌNH CHI TIẾT

    

### 6.1 Lưu đồ quy trình

    

  
    
| 
      Phase | Câu hỏi phase này trả lời
     |
  
  
    
| 
      Phase 1 Phân tích yêu cầuRequirements Elicitation & Analysis | Khách hàng muốn gì, đã đủ rõ để bắt tay vào thiết kế chưa
     |
    
| 
      Phase 2 Đặc tả & phê duyệtRequirements Specification & Approval | Làm thế nào để đạt được, và khách hàng đã đồng ý chưa
     |
    
| 
      Phase 3 Thực thiExecution | Code/test có bám đúng spec không
     |
  

Thay đổi sau baseline, ở bất kỳ phase nào, đi theo Flow CR.

### 6.2 Mô tả quy trình

    

  

#### 6.2.1 Phase 1 — Phân tích yêu cầu

    

  
    - Input: yêu cầu từ Client/PO qua bất kỳ kênh nào

    - Output: tài liệu yêu cầu trong requirements/, mọi yêu cầu có mã

  

  

  

        B1 — Tiếp nhận & phân loại yêu cầu

        PIC: BrSE

        
          
            
| 
              STT | Công việc | Mô tả chi tiết | Output
             |
          
          
            
| 
              1 | Phân loại yêu cầu và mở Issue | • Phân loại yêu cầu của KH và mở Issue tương ứng trên GitHub Project:(a) Yêu cầu mới — chưa có tài liệu nào phủ nội dung này.→ tạo Issue với tracker [Story], label type:story — đây là task cha của tính năng. Có thể gom nhiều Story dưới một Epic (tracker [Epic], label type:epic) — dự án tự quyết (Cấu trúc task).(b) Change Request — đã có tài liệu yêu cầu hoặc spec được khách hàng duyệt (có ô Approve) phủ nội dung này, và khách hàng muốn đổi hành vi hoặc phạm vi.→ tạo Issue với tracker [Change Request], label type:changerequest, đi Flow CR. Không mở tài liệu mới.(c) Investigation — cần điều tra hành vi hiện có, chưa biết có phải sửa gì không.→ tạo Issue với tracker [Investigation], label type:investigation, trả lời ngay trong Issue. Chỉ sửa chữ cho rõ thì tăng PATCH; phát hiện phải sửa code hoặc testcase thì chuyển sang loại (b).• Tiêu đề Issue chỉ ghi tên yêu cầu — không nhét mã vào tiêu đề. Với yêu cầu mới, số của Story chính là mã REQ, dùng khi đặt tên file (REQ-123-{slug}.md).• Attach toàn bộ bằng chứng gốc vào Issue. Không chép nội dung sang file hay chỗ khác.• Chưa chắc thuộc loại nào thì log vào CR trước cho khỏi sót, đánh giá xong đổi nhãn ngay trên Issue đó — không mở Issue mới. | Issue đã mở đúng form, có nhãn phân loại và bằng chứng gốc; yêu cầu mới: Story REQ-{số}
             |
            
| 
              2 | Tạo task con viết tài liệu yêu cầu (yêu cầu mới) | • Tạo sub-issue dưới Story bằng tracker [Documentation], chọn Document Type = Requirement Document (label type:documentation + doctype:requirement), tiêu đề [DOCUMENTATION] {tên tính năng}, assign BrSE.• Nhánh A/B và tài liệu khách hàng gửi ghi trên Story — không chép sang task con.• Task con là task tài liệu của tài liệu yêu cầu: Status New → In Progress → In Review → Closed ; Pending chạy trên task con, không chạy trên Story.• Mã REQ và tên file vẫn lấy số của Story — một Story một tài liệu yêu cầu.• Sub-issue của từng file spec ở Phase 2 - B1 cũng nằm dưới Story, cùng cấp với task con này. | Story có một task con viết tài liệu yêu cầu, ở New
             |
            
| 
              3 | Đính tài liệu khách hàng đã gửi (Nhánh A) | Đính hoặc link bản tài liệu requirement khách hàng gửi vào Story, ghi rõ tên file · phiên bản · ngày nhận. Đây là bản gốc mà bản trong repo phải đối chiếu được ở Phase 1 - B2. | Issue có bản tài liệu requirement gốc của khách hàng
             |
          
        

      

        B2 — Đưa tài liệu khách hàng vào repo · Nhánh A

        PIC: BrSE

        Input: Story REQ-{số} và task con viết tài liệu yêu cầu đã mở ở Phase 1 - B1 · bản tài liệu requirement khách hàng gửi

        
          
            
| 
              STT | Công việc | Mô tả chi tiết | Output
             |
          
          
            
| 
              1 | Tạo file tài liệu yêu cầu | • Copy requirements/_templates/BM-2-901-63-requirement-document-template.md thành requirements/REQ-{số Story}-{slug}.md. Thư mục requirements/ là thư mục phẳng, không có cấp {feature}/.• Điền frontmatter: id = mã REQ · source bắt buộc (tên file hoặc link bản khách hàng gửi) · received_date · version: "0.1.0" · updated_by · updated.• Mục History of change đánh lại từ dòng 1 · 0.1.0 · Add New · Khởi tạo. Cột cuối Approve để trống.• Làm trên branch riêng feature/req-{slug}, checkout từ nhánh version ver/{tên} của đợt (QC-01 §2). | File requirements/REQ-{số}-{slug}.md, task con ở In Progress, source trỏ đúng bản khách hàng gửi
             |
            
| 
              2 | Đưa nội dung vào, giữ nguyên | • Chuyển tài liệu khách hàng sang template, giữ nguyên nội dung.• Không tự sửa nội dung khách hàng. Thấy sai, thiếu hoặc mâu thuẫn thì ghi vào mục Q&A và hỏi. | Bản trong repo đối chiếu được với bản khách hàng gửi
             |
            
| 
              3 | Đánh mã từng yêu cầu | • Yêu cầu chức năng: FR-{MODULE}-{nnn} (ví dụ FR-AUTH-001). Yêu cầu phi chức năng: NFR-{nnn}.• Tài liệu khách hàng viết vẫn phải đánh mã. Mã đã cấp thì không đổi và không tái sử dụng; tái đánh số là thay đổi MAJOR. | Mọi yêu cầu trong tài liệu đều có mã
             |
            
| 
              4 | Làm rõ điểm mơ hồ | • Mọi điểm chưa rõ, sai hoặc mâu thuẫn trong tài liệu khách hàng ghi vào mục Q&A: mỗi câu hỏi một dòng, có người phải trả lời và ngày hỏi.• Có câu trả lời thì cập nhật nội dung tài liệu và giữ lại dòng Q&A kèm câu trả lời.• Không tự suy diễn thay khách hàng. | Không còn câu hỏi mở
             |
            
| 
              5 | Mở bảng đối chiếu yêu cầu → spec | Điền mục Đối chiếu yêu cầu → spec: mỗi mã FR/NFR một dòng, cột spec để trống. Bảng này được điền dần ở Phase 2 - B2. | Bảng đối chiếu đã liệt kê đủ mã
             |
            
| 
              6 | Thêm dòng vào requirements/_index.md | Thêm trong cùng PR với file. Bộ cột theo QC-01 §3 (thư mục này không có cột Feature): ID · Tên tài liệu · Version · Updated by · Updated · Link. Điền Version = 0.1.0. | Một dòng trong requirements/_index.md, khớp frontmatter
             |
            
| 
              7 | Mở PR, review nội bộ và merge | • Mở Pull Request từ feature/req-{slug} sang nhánh version ver/{tên} của đợt.• Người review nội bộ đối chiếu bản trong repo với bản khách hàng gửi (ghi ở source và trên Issue): nội dung giữ nguyên, mọi yêu cầu có mã, không còn câu hỏi mở.• Review xong thì merge PR vào nhánh version và chuyển task con viết tài liệu yêu cầu sang Closed. Không điền ô Approve, không gắn tag. | Tài liệu yêu cầu trên nhánh version, đối chiếu được với bản khách hàng gửi; task con ở Closed
             |
          
        

        
          Nhánh A không đi qua Phase 1 - B4 — ô Approve để trống; mốc chuẩn là bản khách hàng gửi, ghi ở source và trên Issue. Merge PR xong thì sang Phase 2.
        

      

        B3 — Phân tích & viết tài liệu yêu cầu · Nhánh B

        PIC: BrSE

        Input: Story REQ-{số} và task con viết tài liệu yêu cầu đã mở ở Phase 1 - B1 · tài liệu và ghi chú do khách hàng cung cấp

        
          
            
| 
              STT | Công việc | Mô tả chi tiết | Output
             |
          
          
            
| 
              1 | Tạo file tài liệu yêu cầu | • Copy requirements/_templates/BM-2-901-63-requirement-document-template.md thành requirements/REQ-{số Story}-{slug}.md (thư mục phẳng).• Điền frontmatter: id = mã REQ · source để trống · received_date · version: "0.1.0" · updated_by · updated.• Mục History of change đánh lại từ dòng 1 · 0.1.0 · Add New · Khởi tạo. Cột cuối Approve để trống — chỉ điền khi khách hàng duyệt ở Phase 1 - B4.• Làm trên branch riêng feature/req-{slug}, checkout từ nhánh version ver/{tên} của đợt. | File requirements/REQ-{số}-{slug}.md, task con ở In Progress
             |
            
| 
              2 | Phân tích và viết nội dung | Phỏng vấn / workshop với khách hàng, phân tích rồi viết mới toàn bộ nội dung theo template. | Nội dung yêu cầu đã viết xong bản đầu
             |
            
| 
              3 | Đánh mã từng yêu cầu | • Yêu cầu chức năng: FR-{MODULE}-{nnn}. Yêu cầu phi chức năng: NFR-{nnn}.• Mã đã cấp thì không đổi và không tái sử dụng. Tái đánh số là thay đổi MAJOR.• Mỗi yêu cầu viết ở dạng kiểm chứng được: có actor, có hành vi, có điều kiện thành công. “Hệ thống phải thân thiện” không phải một yêu cầu. | Mọi yêu cầu trong tài liệu đều có mã
             |
            
| 
              4 | Ghi giả định, ràng buộc và phần ngoài phạm vi | • Điền mục Ràng buộc & Giả định của template. Mỗi giả định nêu rõ ai xác nhận và hạn xác nhận.• Phần ngoài phạm vi phải viết thành câu, không để trống. | Mục Ràng buộc & Giả định và phần ngoài phạm vi đã điền
             |
            
| 
              5 | Làm rõ điểm mơ hồ | • Mọi điểm chưa rõ ghi vào mục Q&A: mỗi câu hỏi một dòng, có người phải trả lời và ngày hỏi.• Có câu trả lời thì cập nhật nội dung tài liệu và giữ lại dòng Q&A kèm câu trả lời.• Không tự suy diễn thay khách hàng. | Danh sách câu hỏi còn chờ khách hàng trả lời, xử lý tiếp ở Phase 1 - B4
             |
            
| 
              6 | Mở bảng đối chiếu yêu cầu → spec | Điền mục Đối chiếu yêu cầu → spec: mỗi mã FR/NFR một dòng, cột spec để trống. Bảng này được điền dần ở Phase 2 - B2. | Bảng đối chiếu đã liệt kê đủ mã
             |
            
| 
              7 | Thêm dòng vào requirements/_index.md | Thêm trong cùng PR với file, bộ cột theo QC-01 §3. Điền Version = 0.1.0. | Một dòng trong requirements/_index.md, khớp frontmatter
             |
          
        

      

        B4 — Phê duyệt tài liệu yêu cầu · Nhánh B

        PIC: BrSE · Người phê duyệt: Client/PO

        Input: tài liệu yêu cầu, task con ở In Progress · danh sách câu hỏi còn chờ khách hàng trả lời

        
          
            
| 
              STT | Công việc | Mô tả chi tiết | Output
             |
          
          
            
| 
              1 | Gửi review | • Mở Pull Request từ feature/req-{slug} sang nhánh version ver/{tên} của đợt (QC-01 §2); task con vẫn ở In Progress trong vòng review nội bộ.• Review nội bộ xong thì gửi khách hàng: có quyền GitHub thì review thẳng trên PR; không có quyền thì họp walkthrough hoặc gửi bản xuất, ghi rõ đang review version nào.• Gửi xong là đổi Status sang In Review và lưu bằng chứng đã gửi lên Issue.• Khách hàng bắt sửa nhiều thì quay lại In Progress cho vòng nội bộ rồi mới gửi lại. | Task con ở In Review, bóng ở chân khách hàng
             |
            
| 
              2 | Xử lý feedback | • Feedback ghi trên PR hoặc mục Q&A, không rải rác trong chat.• Sửa, cập nhật updated, lặp tới khi hết câu hỏi mở.• Điều kiện thoát: không còn dòng Q&A nào chưa có câu trả lời. | Không còn câu hỏi mở
             |
            
| 
              3 | Nhận xác nhận và lưu bằng chứng | • Khách hàng duyệt nội dung do dự án viết — đúng cái họ cần, đúng phạm vi.• Bằng chứng bắt buộc lưu vào Issue, một trong ba dạng: mail xác nhận · biên bản họp ghi rõ nội dung chốt · approval trên PR.• Người xác nhận phải là người có quyền chốt cuối phía khách hàng. | Bằng chứng xác nhận lưu trong Issue
             |
            
| 
              4 | Ghi nhận phê duyệt và merge | 1. Tăng version lên 1.0.0 (lần sau theo SemVer), thêm dòng History of change; BrSE điền ô Approve — cột cuối của History — ở dòng đó: ✅ YYYY-MM-DD · [bằng chứng](link), link trỏ tới bằng chứng đã lưu ở việc 3. Chỉ điền khi có xác nhận của khách hàng và không còn dòng hở nào.  – Chỉ khách hàng phê duyệt — BrSE chỉ ghi nhận; nội bộ duyệt PR thì không điền ô này.  – Điền qua PR như mọi sửa đổi khác; đã điền thì không xoá — nó ghi lại một sự kiện đã xảy ra.2. Cập nhật requirements/_index.md trong cùng PR.3. Merge PR vào nhánh version; chuyển task con viết tài liệu yêu cầu sang Closed. Không gắn tag ở bước này — tag release tài liệu gắn khi release source code (§V.3). | Tài liệu yêu cầu trên nhánh version có ô Approve ở dòng cuối History
             |
          
        

        Phase 1 - B4 là cửa phê duyệt của Phase 1. Chưa có xác nhận của khách hàng thì chưa được sang Phase 2. Đường đi tắt có kiểm soát: khi tiến độ buộc phải bắt đầu Phase 2 lúc tài liệu chưa có ô Approve, phải ghi rõ trên Issue phần nào chưa chốt · mức rủi ro · ai chịu chi phí làm lại. Thiếu một trong ba thì không được bắt đầu Phase 2. Ba ô này lặp lại ở cửa vào sprint (Phase 3 - B1).

        Thời hạn khách hàng review

        
          - Thống nhất trước trong tài liệu kickoff của dự án: số ngày làm việc chờ phản hồi và tỉ lệ đã review tối thiểu — ví dụ 7 ngày, 70%. Kickoff chưa có hai con số này thì BrSE thống nhất với khách hàng và bổ sung vào kickoff trước lần gửi review đầu tiên.

          - Tính hạn từ ngày gửi + 1, đếm theo ngày làm việc. Ngày gửi lấy theo bằng chứng đã lưu trên Issue khi chuyển In Review.

          - Tỉ lệ đã review đếm theo số mã FR/NFR trong tài liệu yêu cầu: một mã tính là đã review khi khách hàng đã phản hồi về nó — đồng ý hay góp ý đều tính.

          - Quá hạn mà khách hàng chưa phản hồi, hoặc khách hàng đã review đủ tỉ lệ → team được bắt đầu Phase 2 theo đường đi tắt có kiểm soát ở trên: các mã FR/NFR chưa review ghi vào ô phần nào chưa chốt; spec viết từ đó khi vào sprint cũng đi đường tắt có kiểm soát (Phase 3 - B1).

          - Task vẫn giữ In Review, ô Approve để trống — không tự chuyển Closed. Ô Approve chỉ điền khi có xác nhận của khách hàng.

        

        CR trên tài liệu yêu cầu: đánh giá tác động và PL duyệt theo Flow CR, rồi sửa theo Phase 1 - B3 và đi lại bước này.

      

  

#### 6.2.2 Phase 2 — Đặc tả & phê duyệt

    

  
    - Input: tài liệu yêu cầu đã được khách hàng duyệt (Nhánh B), hoặc đã đưa vào repo và hết câu hỏi mở (Nhánh A)

    - Output: spec baseline

  

  

  

        B1 — Xác định loại spec & mở sub-issue

        PIC: BrSE

        Input:

        
          - Tài liệu yêu cầu đã được khách hàng duyệt — có ô Approve (Nhánh B), hoặc đã đưa vào repo và hết câu hỏi mở (Nhánh A)

          - Design đã có (nếu là màn hình)

        

        
          
            
| 
              STT | Công việc | Mô tả chi tiết | Output
             |
          
          
            
| 
              1 | Xác định cần những loại tài liệu nào | • Chọn trong 5 loại spec của QC-01 §2 và phân người tạo file:QA Leader — tạo Screen Specification (BM-2-901-51-screen-specification-template.md)Technical Leader — tạo Database Design (BM-2-901-50-database-design-template.md), API Design (BM-2-901-52-api-design-template.md), Technical Design (BM-2-901-53-technical-design-template.md), Function Specifications (BM-2-901-54-function-specifications-template.md)• Một yêu cầu thường cần nhiều loại — ví dụ màn hình đăng nhập cần Screen Specification + API Design, thêm Database Design nếu đụng schema. | Danh sách file spec phải viết, ghi trên Story
             |
            
| 
              2 | Mở sub-issue cho từng file | Tạo sub-issue dưới Story cho mỗi file bằng tracker [Documentation], chọn loại spec ở trường Document Type (label type:documentation + doctype:spec) — cùng cấp với task con viết tài liệu yêu cầu — assign người tạo đã phân ở việc 1. Quy tắc bất biến: 1 sub-issue = 1 file spec = 1 dòng _index.md. | Mỗi file một sub-issue ở New
             |
          
        

      

        B2 — Viết spec

        PIC: người tạo file đã phân ở Phase 2 - B1 — QA Leader (Screen Specification) hoặc Technical Leader (4 loại còn lại)

        Input:

        
          - Sub-issue ở New

          - Template của từng loại tài liệu · design (nếu là màn hình)

        

        
          
            
| 
              STT | Công việc | Mô tả chi tiết | Output
             |
          
          
            
| 
              1 | Tạo file | • Copy template của loại tương ứng, đặt tên và đặt đúng thư mục theo QC-01 §4.• Làm trên branch feature/spec-{slug}, checkout từ nhánh version ver/{tên} của đợt.• Chuyển sub-issue sang In Progress. | File spec mới, sub-issue ở In Progress
             |
            
| 
              2 | Viết nội dung | Viết theo template của loại đó. Điểm chưa rõ ghi vào mục “Câu hỏi mở / TBD” của chính file. | Spec đã viết xong bản đầu
             |
            
| 
              3 | Cập nhật hai bảng tra trong cùng lượt | 1. _index.md của từng loại tài liệu — thêm dòng cho mỗi file mới (version: 0.1.0) và cập nhật dòng thống kê ở đầu file.2. Bảng đối chiếu yêu cầu → spec trong tài liệu yêu cầu — điền cột spec cho từng mã FR/NFR. Yêu cầu nào còn trống sau bước này là yêu cầu chưa có ai thiết kế. | Hai bảng tra khớp với bộ file vừa tạo
             |
          
        

        CR trên spec: đánh giá tác động và PL duyệt theo Flow CR, rồi đi lại từ bước này (CR cần loại spec mới thì từ Phase 2 - B1) tới Phase 2 - B6.

      

        B3 — Review nội bộ

        PIC: BrSE

        Input: bộ file spec, sub-issue ở In Progress

        
          
            
| 
              STT | Công việc | Mô tả chi tiết | Output
             |
          
          
            
| 
              1 | Mở PR và gắn người review | • PR từ feature/spec-{slug} về nhánh version ver/{tên}. Sub-issue vẫn ở In Progress.• Gắn Tech Lead và QA làm reviewer. Spec đã có issue phát triển / testcase liên kết đang mở thì request review cả Dev/QA đang làm — approval của Dev/QA chính là biên nhận đã đọc.• Phần mô tả PR ghi Refs #{sub-issue} và các issue liên quan (#{issue phát triển}, #{issue testcase}) để GitHub tự sinh cross-reference. | PR đang mở, đúng nhãn, đủ người review
             |
            
| 
              2 | Review kỹ thuật và kiểm thử | Tech Lead — khả thi kỹ thuật, kiến trúc, ảnh hưởng hệ thống đang chạy. Câu phải trả lời được: làm được không, đụng gì, ai sở hữu phần nào.QA — tính kiểm thử được. Câu phải trả lời được: mỗi hành vi có kiểm chứng được không, AC có đo được không. | Đủ approval của Tech Lead và QA
             |
            
| 
              3 | Xử lý ý kiến và chốt điều kiện thoát | • Ý kiến review ghi trên PR, không ghi ở chat. Mỗi comment xử lý bằng một trong hai cách: sửa, hoặc trả lời vì sao không sửa. Không để comment trôi.• Điều kiện thoát: (a) mục câu hỏi mở của mọi file trong PR không còn dòng hở nào; (b) đủ approval của Tech Lead và QA.• Dòng tạm được phép còn lại — nhưng phải có chủ, có hạn chốt, và nằm trong mục “Câu hỏi mở / TBD”. Phần chứa dòng tạm mà đang được code thì phải đi đường đi tắt có kiểm soát ở Phase 3 - B1. | Spec sẵn sàng gửi khách hàng
             |
          
        

      

        B4 — Gửi khách hàng review

        PIC: BrSE · Người phê duyệt: Client/PO

        Input: PR đã đạt điều kiện thoát của Phase 2 - B3

        
          
            
| 
              STT | Công việc | Mô tả chi tiết | Output
             |
          
          
            
| 
              1 | Gửi khách hàng | Gửi khách hàng review, ghi rõ đang review version nào. Gửi xong đổi sub-issue sang In Review và lưu bằng chứng đã gửi lên Issue. | Sub-issue ở In Review
             |
            
| 
              2 | Khách hàng review nghiệp vụ | • Client/PO — đúng nghiệp vụ. Câu phải trả lời được: đây có đúng là cái khách hàng cần không.• Feedback ghi trên PR hoặc trên Issue. Phải sửa thì sub-issue về In Progress, quay lại Phase 2 - B2 → Phase 2 - B3 rồi mới gửi lại. | Không còn feedback chưa xử lý
             |
            
| 
              3 | Nhận xác nhận và lưu bằng chứng | • Người xác nhận phải là người có quyền chốt cuối phía khách hàng.• Bằng chứng là comment trên Issue hoặc email của khách hàng, lưu trên Issue. | Bằng chứng xác nhận lưu trên Issue
             |
          
        

        Thời hạn khách hàng review: áp như Phase 1 - B4, khác ở hai chỗ — tỉ lệ đã review đếm theo mã FR/NFR mà bộ spec trong PR phủ (tra bảng Đối chiếu yêu cầu → spec); quá hạn hoặc đủ tỉ lệ thì vào sprint theo đường đi tắt có kiểm soát ở Phase 3 - B1, mã chưa review ghi vào ô phần nào đang tranh luận. Task giữ In Review, ô Approve để trống, không sang Phase 2 - B5.

      

        B5 — Ghi nhận phê duyệt & merge

        PIC: Tech Lead · Người phê duyệt: PL / Tech Lead (duyệt merge PR)

        Input: bằng chứng xác nhận của khách hàng trên Issue

        
          
            
| 
              STT | Công việc | Mô tả chi tiết | Output
             |
          
          
            
| 
              1 | Tăng version và ghi History of change | • Version đầu tiên khách hàng duyệt là 1.0.0; các lần sau theo Semantic Versioning (§V.3).• Thêm một dòng History of change: version, action, nội dung thay đổi, ngày, người sửa, Approve.• Dòng cuối bảng phải khớp version/updated ở frontmatter và khớp _index.md — ba nơi không được lệch. | Version và History of change khớp ba nơi
             |
            
| 
              2 | Điền ô Approve | • Tech Lead điền ô Approve ở dòng của version được duyệt: ✅ YYYY-MM-DD · [bằng chứng](link), link tới bằng chứng đã lưu ở Phase 2 - B4.• Chỉ khách hàng phê duyệt — Tech Lead chỉ ghi nhận; nội bộ duyệt PR thì không điền ô này.• Điền qua PR như mọi sửa đổi khác; đã điền thì không xoá — nó ghi lại một sự kiện đã xảy ra. | Dòng cuối History có ô Approve
             |
            
| 
              3 | Merge và chuyển Closed | • PL hoặc Tech Lead duyệt và merge PR vào nhánh version. PL/Tech Lead merge PR là điều kiện cần, xác nhận của khách hàng mới là điều kiện đủ.• Chuyển sub-issue sang Closed. Không gắn tag ở bước này — tag release tài liệu gắn khi release source code (§V.3). | Spec trên nhánh version có ô Approve ở dòng cuối History, sub-issue Closed
             |
          
        

      

        B6 — Thông báo Dev/QA

        PIC: BrSE

        Input: spec vừa merge với version mới

        
          
            
| 
              STT | Công việc | Mô tả chi tiết | Output
             |
          
          
            
| 
              1 | Báo cho người đang làm | • Comment vào issue phát triển và issue testcase đang mở liên kết với tài liệu: version mới, link PR.• Chỉ báo cho issue đang mở — chưa ai làm thì chưa cần báo. | Dev/QA đang làm biết version mới, có dấu vết trên issue
             |
          
        

      

  

#### 6.2.3 Phase 3 — Thực thi

    

  
    - Input: spec baseline, hoặc spec đã được PL duyệt đi tắt

    - Output: code/testcase bám đúng spec; thay đổi đi qua Flow CR

  

  
    Phase này đang chạy thử ở dự án pilot — chưa phải quy định đã ban hành.
  

  

  

        B1 — Áp cửa vào sprint

        PIC: PL · Người phê duyệt: PL (duyệt đi tắt)

        Input: spec baseline (dòng cuối History có ô Approve) · kế hoạch sprint

        
          
            
| 
              STT | Công việc | Mô tả chi tiết | Output
             |
          
          
            
| 
              1 | Chọn đường vào sprint | Mỗi spec kéo vào sprint đi một trong hai đường:Đúng luồng: dòng cuối History có ô Approve (task tài liệu Closed).Đi tắt có kiểm soát: dòng cuối History chưa có ô Approve — BrSE đề nghị, PL duyệt. Không cho đi tắt khi task tài liệu còn New / In Progress — chỉ khi đã ở In Review (đã gửi khách hàng) trở lên. | Mỗi spec trong sprint có đường vào rõ ràng
             |
            
| 
              2 | Điền bốn ô khi đi tắt | Ghi trên Issue, không ghi vào file, không gắn nhãn:1. Phần nào đang tranh luận — khoanh theo mã item hoặc mã FR, không ghi chung chung “chờ khách hàng”;2. Mức rủi ro — Cao / Trung bình / Thấp;3. Ai chịu chi phí làm lại — quyết trước, không phải lúc đã hỏng;4. Hạn khách hàng phải chốt, và ai chốt cuối phía khách hàng.Đi tắt do PL duyệt, không phải BrSE tự quyết. | Spec đi tắt có đủ bốn ô trên Issue
             |
            
| 
              3 | Xếp thứ tự làm | Phần AC ổn định làm trước, phần đang tranh luận làm sau; QA viết testcase cho phần ổn định trước. | Kế hoạch sprint theo thứ tự ổn định → tranh luận
             |
            
| 
              4 | Xử lý khi quá hạn mà khách hàng chưa chốt | PL quyết một trong ba, không có lựa chọn “để nguyên”: (a) gia hạn, ghi lý do và hạn mới · (b) dừng phần đó — Phase 3 - B4 · (c) bỏ hẳn — Phase 3 - B5. | Quyết định ghi trên Issue
             |
          
        

      

        B2 — Phát triển & kiểm thử

        PIC: PL

        Input: spec đã qua cửa vào sprint ở Phase 3 - B1

        
          
            
| 
              STT | Công việc | Mô tả chi tiết | Output
             |
          
          
            
| 
              1 | Gắn liên kết ba chiều | Bắt buộc gắn issue spec ↔ issue phát triển ↔ PR code ngay đầu bước này, để truy được hai chiều: “spec này ai đang làm” và “code này bám spec nào”. | Không có việc nào trong sprint mà không trỏ về được một spec
             |
            
| 
              2 | Liên kết issue phát triển với tài liệu | • Mỗi issue phát triển và issue testcase liên kết với sub-issue của spec (sub-issue hoặc trường liên kết).• Issue chuyển In progress mà dòng cuối History của spec chưa có ô Approve thì phải đã được PL duyệt đi tắt ở Phase 3 - B1 — chưa duyệt thì chưa được bắt đầu.• Luật: spec đã có issue phát triển hoặc testcase liên kết đang mở thì không sửa lặng lẽ nữa, kể cả khi chưa được duyệt. Mọi thay đổi phải làm đủ ba việc: (1) ghi một dòng History of change · (2) tăng version · (3) comment vào issue phát triển và issue testcase đang mở. | Mọi issue phát triển truy được về spec; ca chưa duyệt mà đã làm đều đã được PL duyệt đi tắt
             |
            
| 
              3 | Xử lý khi spec đổi version giữa sprint | Báo theo Phase 2 - B6, và comment vào issue phát triển, issue testcase đang mở theo luật ở việc 2. | Người đang code và đang viết testcase biết mình đang làm trên bản nào
             |
          
        

      

        B3 — Khách hàng đổi spec đang làm dở

        PIC: PL

        Input: Issue CR đã mở theo Flow CR, chức năng đang làm dở

        
          
            
| 
              STT | Công việc | Mô tả chi tiết | Output
             |
          
          
            
| 
              1 | Dừng phần bị ảnh hưởng | Dừng phần bị ảnh hưởng, báo ngay trên issue phát triển. Không dừng cả sprint — BrSE. | Phần bị ảnh hưởng đã dừng
             |
            
| 
              2 | Đếm thiệt hại | Dev: đã code bao nhiêu, phần nào dùng lại được · QA: testcase nào phải bỏ hoặc sửa. Dùng form CR trên GitHub Project ở mức rút gọn — Dev, QA. | Thiệt hại đã đếm trên Issue CR
             |
            
| 
              3 | Quyết hướng xử lý | Một trong ba: (a) làm tiếp theo bản mới · (b) hoãn sang sprint sau · (c) bỏ khỏi sprint. Ghi quyết định và chi phí phát sinh vào Issue — PL. | Quyết định và chi phí phát sinh ghi trên Issue
             |
            
| 
              4 | Cập nhật | Spec sửa theo bản mới, tăng version, ghi History of change; testcase sửa; issue phát triển đặt lại estimate — BrSE, Dev, QA. | Spec, testcase, estimate đã cập nhật
             |
          
        

      

        B4 — Khách hàng tạm dừng chức năng

        PIC: BrSE · Người quyết gỡ: PL

        Input: khách hàng yêu cầu “dừng lại đã, chờ chúng tôi quyết”

        
          
            
| 
              STT | Công việc | Mô tả chi tiết | Output
             |
          
          
            
| 
              1 | Phân biệt dừng hay bỏ | Khách hàng nói không rõ → mặc định Pending, BrSE hỏi lại dừng bao lâu. Bỏ hẳn thì đi Phase 3 - B5. | Đã rõ là dừng tạm
             |
            
| 
              2 | Chuyển Pending | Status task tài liệu chuyển Pending. Comment trên Issue ghi dừng từ nấc nào, ai yêu cầu, lý do, hạn dừng. | Task ở Pending, có comment
             |
            
| 
              3 | Đóng băng | Không gỡ code, không gỡ testcase; issue phát triển và issue testcase chuyển Blocked, giữ nguyên estimate. | Code, testcase, estimate giữ nguyên
             |
            
| 
              4 | Gỡ Pending | Khách hàng cho chạy tiếp, hoặc PL quyết gỡ khi quá hạn → đặt lại đúng nấc cũ đọc từ comment lúc dừng. | Task về đúng nấc cũ
             |
          
        

      

        B5 — Khách hàng bỏ chức năng

        PIC: PL

        Input: khách hàng yêu cầu “bỏ hẳn chức năng này”

        
          
            
| 
              STT | Công việc | Mô tả chi tiết | Output
             |
          
          
            
| 
              1 | Quyết bỏ code hay giữ | Theo một ngưỡng định trước: gỡ tốn dưới ngưỡng → gỡ luôn cho sạch; từ ngưỡng trở lên → giữ sau feature flag, ghi nợ kỹ thuật kèm issue theo dõi. | Quyết định gỡ / giữ ghi trên Issue
             |
            
| 
              2 | Kiểm tra degrade | Nếu gỡ, bắt buộc: liệt kê chức năng khác dùng chung code hoặc dữ liệu; QA chạy regression vùng đó. Không được bỏ việc này. | Kết quả regression
             |
            
| 
              3 | Xoá file spec | Xoá file spec và dòng _index.md trong cùng một PR; lý do + ai yêu cầu bỏ ghi trên Issue và commit message. | File và dòng _index.md đã xoá
             |
            
| 
              4 | Gỡ testcase | QA gỡ testcase tương ứng. | Testcase đã gỡ
             |
            
| 
              5 | Ghi release note | Code đã lên môi trường nào thì ghi vào release note của môi trường đó. | Release note đã ghi
             |
            
| 
              6 | Đóng issue | Đóng issue spec với lý do dropped-by-client. | Issue đã đóng
             |
          
        

      

  

### 6.3 Flow CR

    

  PIC: BrSE · Người phê duyệt: PL (scope/cost)

  Input:

  
    - Issue tracker [Change Request] (label type:changerequest) mở ở Phase 1 - B1 việc 1 (b)

    - Tài liệu yêu cầu hoặc spec đã có baseline (có ô Approve) bị ảnh hưởng

  

  
    
      
| 
        STT | Công việc | Mô tả chi tiết | Output
       |
    
    
      
| 
        1 | Tiếp nhận CR | • CR vào quy trình chỉ qua cửa phân loại ở Phase 1 - B1, tracker [Change Request], label type:changerequest. Sửa thẳng vào tài liệu đã có baseline mà không mở CR là vi phạm quy trình.• Form CR dùng issue template trên GitHub Project — không có biểu mẫu Markdown trong repo.• CR trên tài liệu yêu cầu và CR trên spec dùng chung một form, không có luồng riêng. | Issue CR đã mở đúng form, label type:changerequest
       |
      
| 
        2 | Đánh giá tác động | Trả lời đủ bốn câu, trước khi sửa bất kỳ dòng nào:1. Tài liệu nào bị ảnh hưởng — tra bảng đối chiếu yêu cầu → spec và các link chéo giữa 5 loại spec.2. Code nào bị ảnh hưởng — Tech Lead/Dev ước lượng, dựa vào liên kết ba chiều ở Phase 3 - B2.3. Testcase nào phải bỏ hoặc sửa — QA ước lượng.4. Timeline và chi phí — bao nhiêu công, ảnh hưởng mốc nào.CR trên tài liệu yêu cầu: phải rà toàn bộ spec đang trỏ về mã FR/NFR bị đổi. | Bảng tác động: tài liệu · code · testcase · timeline và chi phí
       |
      
| 
        3 | Phê duyệt trước khi sửa | PL duyệt phạm vi và chi phí; khách hàng xác nhận phần chi phí theo hợp đồng. Chưa có duyệt thì chưa sửa tài liệu. | Phê duyệt scope/cost ghi trên Issue CR
       |
      
| 
        4 | Cập nhật và chốt baseline mới | 1. Branch riêng cr/{slug} checkout từ nhánh version đang chạy — kể cả CR cho tài liệu của version đã release (QC-01 §2 quy tắc 4); không sửa trực tiếp trên main hay trên nhánh version.2. Sửa nội dung, thêm dòng History of change ghi rõ link Issue CR, lý do, người yêu cầu.3. Tăng version theo Semantic Versioning — đổi hành vi là MAJOR.4. Đi lại đúng step của tài liệu bị ảnh hưởng (review → khách hàng duyệt → điền ô Approve → merge → thông báo). CR không có đường tắt riêng.5. Hồ sơ CR là Issue CR — lý do, đánh giá tác động, quyết định, chi phí và bằng chứng khách hàng xác nhận đều ghi trên Issue. Không lập file hồ sơ CR trong repo. | Baseline mới có version mới và ô ApproveIssue CR truy được lý do, tác động, người duyệt, chi phí
       |
    
  

## VII. BIỂU MẪU VÀ PHỤ LỤC

    

### 1. Biểu mẫu trong repo

    

  
    
| 
      Biểu mẫu | Loại tài liệu sinh ra
     |
  
  
    
| 
      BM-2-901-63 | Tài liệu yêu cầu
     |
    
| 
      BM-2-901-50 | Database Design
     |
    
| 
      BM-2-901-51 | Screen Specification
     |
    
| 
      BM-2-901-52 | API Design
     |
    
| 
      BM-2-901-53 | Technical Design
     |
    
| 
      BM-2-901-54 | Function Specifications
     |
  

  Lịch sử thay đổi của tài liệu — mới nhất lên đầu

  
    - 1.1.1 gọn Output của Phase 1 và Phase 2 (2026-10-06): Phase 1 bỏ không còn câu hỏi mở · Nhánh B: khách hàng đã xác nhận; Phase 2 chỉ còn spec baseline. Lưu đồ ba phase sửa theo.

    - 1.1.0 hồ sơ CR là Issue CR (2026-10-05): bỏ thư mục change-requests/ ở §IV.1; Flow CR việc 4: dòng History ghi link Issue CR, không lập file hồ sơ CR trong repo.
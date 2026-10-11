# Quy chuẩn Cấu trúc Thư mục Spec trên GitHub

    

QC-01 · version 1.1.0 · cập nhật 2026-10-05

Mã tài liệu: QC-01 · Thuộc: TSK-04 · Áp dụng: mọi dự án dùng GitHub Project

## 1. Vị trí lưu trữ

    

Mỗi dự án có một Management Repository riêng, đặt tên {repo-management}. Toàn bộ tài liệu nằm trực tiếp ở gốc repo, mỗi nhóm tài liệu một thư mục — không bọc thêm thư mục trung gian và không đánh số thứ tự vào tên thư mục.

Bắt buộc, không ngoại lệ — kể cả dự án nhỏ hay monorepo. Spec không để trong repo code.

Version / milestone / phase tách bằng nhánh Git (main lưu trữ bản latest, mỗi đợt một nhánh ver/{tên}), không tách bằng thư mục — xem §2 “Các nhánh Git”.

Management Repository chứa toàn bộ tài liệu quản lý dự án, không chỉ requirement và spec. Quy chuẩn này chốt cứng hai nhóm bắt buộc: requirements/, specs/. Change Request không có thư mục trong repo: hồ sơ CR là Issue CR trên GitHub Project; repo chỉ giữ thay đổi mà CR tạo ra trên tài liệu — version mới và dòng History of change có link tới Issue CR. Các nhóm khác của dự án — biên bản họp, kế hoạch, báo cáo, tài liệu vận hành — đặt thêm thư mục cùng cấp ở gốc repo, đặt tên theo §4, và phải có một dòng trong README.md.

README.md là bảng điều hướng duy nhất của repo: người mở repo lần đầu chỉ cần đọc nó là biết repo đang giữ những nhóm tài liệu nào, mỗi nhóm tra ở đâu, ai sở hữu, và link sang repo code. Thêm một nhóm tài liệu mà không thêm dòng vào README.md thì coi như chưa xong việc.

Hai repo trỏ sang nhau bằng link trong README.md; issue và PR tham chiếu chéo theo cú pháp {org}/{tên-repo}#{số}.

## 2. Cây thư mục chuẩn

    

### Các nhánh Git

    

Management Repository chia theo nhánh Git: main lưu trữ bản latest — mọi tài liệu của mọi version đã release, còn mỗi version / milestone / phase có một nhánh riêng để làm tài liệu của đợt đó. Mọi nhánh giữ đúng một cây thư mục (mục ngay dưới) — nhánh khác nhau ở nội dung file, không khác nhau ở cấu trúc.

{repo-management}
│
├── main                  ← BẢN ĐÃ RELEASE — chỉ nhận merge khi một version release
│   ├── README.md
│   ├── requirements/
│   └── specs/
│
├── ver/1.0               ← TÀI LIỆU CỦA VERSION 1.0 — viết, review, sửa theo CR trong đợt này
│   └── (cùng cây thư mục như main)
│
└── ver/2.0               ← TÀI LIỆU CỦA VERSION 2.0 — mở từ main
    └── (cùng cây thư mục như main)

main, ver/1.0, ver/2.0 là nhánh, không phải thư mục. Trên GitHub, chọn nhánh ở ô chọn branch thì thấy cây thư mục ở mục dưới. Không tạo thư mục v2.0/, ver-3.0/ trong repo — làm vậy là mỗi màn hình có một bản sao theo đợt, vi phạm ràng buộc 4, và _index.md có hai dòng cho cùng một tài liệu.

  
    
| 
      Nhánh | Chứa gì | Nhận thay đổi từ | Sau khi release
     |
  
  
    
| 
      main | Tài liệu của các version đã release, ở bản cuối cùng của từng version — kể cả bản đã sửa theo CR trong đợt đó. Không viết tài liệu trực tiếp trên main | Chỉ nhánh version, chỉ vào lúc version đó release | Không kết thúc — luôn là bản latest
     |
    
| 
      ver/{tên} | Tài liệu làm trong version / milestone / phase đó: viết mới, review, sửa theo CR. Một nhánh một đợt | Chỉ branch viết tài liệu và branch CR của đợt đó, qua PR. Không nhận thay đổi từ main sau khi đã checkout | Giữ lại, không xoá, không sửa tiếp — là bản lưu tài liệu của đợt đó
     |
  

Bốn quy tắc bắt buộc:

  - Mở nhánh version mới thì checkout từ main — một lần duy nhất, lúc khởi tạo nhánh. Không checkout từ nhánh version đang chạy: nhánh mới bắt đầu từ bản đã release, không kéo theo tài liệu chưa release của đợt khác. Sau khi checkout, nhánh version không cập nhật theo main — main có thay đổi (version khác release) cũng không merge xuống.

  - Chỉ merge lên main khi version release. Tài liệu khách hàng đã duyệt (ô Approve) — kể cả bản sửa theo CR — vẫn nằm trên nhánh version cho tới lúc release. Nhờ vậy main chỉ chứa những gì đã thực sự ra sản phẩm, không lẫn tài liệu của đợt đang làm.

  - Hai nhánh version chạy song song cùng sửa một tài liệu thì nhánh nào release trước merge lên main trước. Nhánh release sau không nhận bản đó trong lúc làm, nên xung đột chỉ lộ ra ở PR release của nó lên main; khi xử lý thì giữ thay đổi đã release, rồi áp phần sửa của đợt mình lên trên. Vì không đồng bộ giữa chừng, đợt sau có thể làm tiếp trên bản cũ của đúng những chỗ đợt trước vừa sửa — người làm tài liệu đợt sau phải đọc main trước khi sửa một tài liệu đã có.

  - CR cho tài liệu của version đã release thì sửa trên nhánh version đang chạy, không mở lại nhánh cũ. Bản sửa lên main cùng lượt release của version đang chạy. Nhánh version đã release chỉ đọc — là bản lưu đúng như lúc release, sửa vào đó thì bản lưu không còn đúng với sản phẩm đã ra.

%%{init: {'theme': 'base', 'gitGraph': {'showCommitLabel': true, 'rotateCommitLabel': false}, 'themeVariables': {
  'commitLabelColor': '#37474f', 'commitLabelBackground': '#ffffff',
  'git0': '#8bc34a', 'gitBranchLabel0': '#1b3a0a', 'gitInv0': '#8bc34a',
  'git1': '#ff9800', 'gitBranchLabel1': '#3e2300', 'gitInv1': '#ff9800',
  'git2': '#4fc3f7', 'gitBranchLabel2': '#01354d', 'gitInv2': '#4fc3f7',
  'git3': '#ba68c8', 'gitBranchLabel3': '#3a0a45', 'gitInv3': '#ba68c8',
  'git4': '#ffd54f', 'gitBranchLabel4': '#4a3a00', 'gitInv4': '#ffd54f',
  'git5': '#4fc3f7', 'gitBranchLabel5': '#01354d', 'gitInv5': '#4fc3f7',
  'git6': '#ba68c8', 'gitBranchLabel6': '#3a0a45', 'gitInv6': '#ba68c8'
}}}%%
gitGraph
    commit id: "init"
    branch ver/1.0 order: 1
    commit id: "mở đợt 1.0"
    branch feature/spec-login order: 2
    commit id: "LOGIN 0.1.0"
    checkout main
    branch ver/2.0 order: 4
    commit id: "mở đợt 2.0"
    branch feature/spec-order order: 5
    commit id: "ORDER 0.1.0"
    checkout feature/spec-login
    commit id: "LOGIN 1.0.0"
    checkout ver/1.0
    merge feature/spec-login id: "PR LOGIN"
    branch cr/login-otp order: 3
    commit id: "CR otp LOGIN"
    checkout ver/1.0
    merge cr/login-otp id: "PR CR otp"
    checkout main
    merge ver/1.0 id: "release 1.0" type: HIGHLIGHT
    checkout feature/spec-order
    commit id: "ORDER 1.0.0"
    checkout ver/2.0
    merge feature/spec-order id: "PR ORDER"
    branch cr/login-remember order: 6
    commit id: "CR remember LOGIN"
    checkout ver/2.0
    merge cr/login-remember id: "PR CR remember"
    checkout main
    merge ver/2.0 id: "release 2.0" type: HIGHLIGHT

Đọc sơ đồ: xanh lá là main; cam và vàng là hai nhánh version chạy song song; xanh dương là branch viết tài liệu (feature/spec-{slug}); tím là branch CR (cr/{slug}). Nhãn LOGIN 0.1.0 → LOGIN 1.0.0 là version ở frontmatter của file, không phải tên nhánh. Ô vuông trên main là lượt release.

Merge lên main chỉ xảy ra một lần mỗi version, lúc release. Từ main xuống nhánh version chỉ có đúng một lần checkout, khi mở nhánh: ver/2.0 không nhận release 1.0, xung đột (nếu có) xử lý ở PR release 2.0. Branch viết tài liệu và branch CR chỉ merge vào nhánh version của đợt mình, qua PR. cr/login-remember là CR cho LOGIN — tài liệu đã release ở 1.0 — nên mở từ ver/2.0 đang chạy, không mở lại ver/1.0 (quy tắc 4). ver/1.0 sau khi release được giữ lại làm bản lưu.

Hệ quả phải biết trước: trong lúc một version đang làm, tài liệu đã duyệt của nó chỉ có trên nhánh version. Dev, QA và người review của đợt đó đọc nhánh version, không đọc main; main chỉ trả lời “sản phẩm đã release đang chạy theo tài liệu nào”.

Tên nhánh ver/{tên} theo version sản phẩm hoặc theo milestone / phase — ver/1.0, ver/phase-2, ver/mvp. Mỗi dự án chọn một kiểu đặt tên cho mọi nhánh version — theo version sản phẩm hoặc theo milestone / phase, không trộn hai kiểu — và ghi vào README.md của Management Repository. {tên} không phải version tài liệu: một file trên ver/2.0 vẫn mang version riêng ở frontmatter theo Semantic Versioning (vd 0.3.0); 2.0 chỉ cho biết file đó được làm trong đợt nào.

Quy chuẩn này chỉ chốt có những nhánh nào, đặt tên ra sao, và luồng merge đi chiều nào. Luật vận hành chi tiết — ai merge, ai quyết định release, đánh tag release tài liệu trên nhánh nào — thuộc RMP.

### Cây thư mục trong mỗi nhánh

    

{repo-management}/
│
├── README.md                         ← điều hướng toàn repo: có những nhóm tài liệu nào, tra ở đâu, link repo code
│
├── requirements/                     ← WHAT — hệ thống phải làm gì
│   ├── _index.md                     ← thống kê + thông tin cơ bản của các file cùng thư mục
│   ├── _templates/                   ← khuôn tài liệu yêu cầu, kèm một bản đã điền sẵn
│   │   ├── BM-2-901-63-requirement-document-template.md
│   │   └── sample-REQ-123-admin-login.md
│   └── REQ-{số Story}-{slug}.md
│
└── specs/                            ← HOW — làm thế nào để đạt được yêu cầu
    │
    ├── _index.md                     ← bảng tra tổng: mọi file trong {screen-or-feature}/ + link tới _index.md trong system-design/
    │
    ├── _common/                      ← dùng từ hai feature trở lên, không thuộc Database Design hay API Design
    │   ├── error-codes.md
    │   ├── api-list.md
    │   └── log-convention.md
    │
    ├── _templates/                   ← khuôn của cả 5 loại spec, mỗi loại kèm một bản đã điền sẵn
    │   ├── BM-2-901-50-database-design-template.md
    │   ├── BM-2-901-51-screen-specification-template.md
    │   ├── BM-2-901-52-api-design-template.md
    │   ├── BM-2-901-53-technical-design-template.md
    │   ├── BM-2-901-54-function-specifications-template.md
    │   ├── sample-AD_LOGIN_SPEC.md
    │   ├── sample-AUTH_DB.md
    │   ├── sample-AUTH_FUNC.md
    │   ├── sample-AUTH_LOGIN_API.md
    │   └── sample-AUTH_VERIFY_TECH.md
    │
    ├── system-design/                ← tài liệu mức hệ thống, chia theo loại tài liệu
    │   ├── database-design/          ← BM-2-901-50
    │   │   ├── _index.md             ← thống kê + thông tin cơ bản của các file cùng thư mục
    │   │   └── {screen-or-feature}/
    │   │       └── {DB_ID}_DB.md
    │   │
    │   └── api-design/               ← BM-2-901-52
    │       ├── _index.md
    │       └── {screen-or-feature}/
    │           └── {API_ID}_API.md
    │
    └── {screen-or-feature}/          ← một feature (cụm nghiệp vụ) hoặc một màn hình
        ├── README.md                 ← bảng tài liệu của feature, kèm link sang system-design/
        ├── screen-specification/     ← BM-2-901-51
        │   ├── {SCREEN_ID}_SPEC.md
        │   └── assets/
        │       └── {SCREEN_ID}_annotated.png
        ├── function-specifications/  ← BM-2-901-54
        │   └── {MODULE_ID}_FUNC.md
        └── technical-design/         ← BM-2-901-53
            └── {FUNC_ID}_TECH.md

Ngoài các thư mục bắt đầu bằng _, specs/ có hai kiểu thư mục con, nhận ra được qua tên:

  
    
| 
      Kiểu | Thư mục | Chứa | Đường dẫn
     |
  
  
    
| 
      Thư mục feature | {screen-or-feature}/ | Screen Specification · Function Specifications · Technical Design | specs/{screen-or-feature}/{loại}/{file}
     |
    
| 
      system-design/ | đúng một, bên trong gồm đúng hai thư mục loại tài liệu: database-design/, api-design/ | Database Design · API Design | specs/system-design/{loại}/{screen-or-feature}/{file}
     |
  

Ba loại trong {screen-or-feature}/ bám sát một feature: viết cùng nhau, review cùng nhau, và cùng bị sửa khi có CR của feature đó. Để chung một thư mục thì mở feature là thấy trọn, và một CR chỉ đụng một thư mục. Trong {screen-or-feature}/, mỗi loại có một thư mục con riêng (screen-specification/, function-specifications/, technical-design/) để file không lẫn vào nhau; ở cấp {screen-or-feature}/ chỉ có README.md và các thư mục con này. Thư mục con chỉ tạo khi feature có tài liệu thuộc loại đó — feature không có màn hình thì không có screen-specification/. Tên file vẫn giữ hậu tố _SPEC, _FUNC, _TECH: tên file đứng một mình (trong kết quả tìm kiếm, link, Issue) vẫn phải cho biết loại tài liệu.

  Ghi chú: dự án cũng có thể chia {screen-or-feature}/ theo màn hình — mỗi thư mục là một màn hình, tên là Screen ID chuyển sang kebab-case (AD_LOGIN → ad-login/). Mỗi dự án chọn một cách cho mọi thư mục và ghi vào README.md của Management Repository.

Database Design và API Design giữ trục loại tài liệu: hai loại này do Tech Lead sở hữu, thường có nhiều feature dùng chung, và cần rà trọn cả loại ở một chỗ — xem hết bảng dữ liệu, xem hết hợp đồng API — hơn là rà theo từng feature. Hai thư mục loại được bọc chung trong system-design/ để cấp specs/ chỉ còn ba kiểu tên — _*, system-design, và feature — không lẫn thư mục loại với thư mục feature. system-design/ chỉ là thư mục bọc: không có file nào đặt trực tiếp trong nó, kể cả _index.md. Thêm loại tài liệu mức hệ thống mới (batch, tích hợp ngoài, NFR) thì đặt cạnh database-design/ sau khi QC-01 bổ sung, không đặt ở specs/.

Hệ quả phải biết trước: một feature nằm ở tối đa ba nơi — {screen-or-feature}/, system-design/database-design/{screen-or-feature}/, system-design/api-design/{screen-or-feature}/. Nơi ghép lại là {screen-or-feature}/README.md. Một tên feature dùng thống nhất ở cả ba nơi. Feature không có màn hình (batch, job, tích hợp ngoài) vẫn có thư mục {screen-or-feature}/ và README.md của riêng nó.

Tên dành riêng: system-design và mọi tên bắt đầu bằng _ không được dùng làm tên feature.

Khuôn của cả 5 loại spec nằm chung một chỗ: specs/_templates/. Mỗi loại có đúng một khuôn và một bản mẫu, nằm cạnh nhau. Không có thư mục _samples/ riêng — sửa khuôn mà quên sửa bản mẫu là thấy ngay trong cùng một diff. Thư mục loại tài liệu trong system-design/ không có _templates/ riêng, chỉ có hai thành phần: _index.md và các thư mục {screen-or-feature}/.

_templates/ xuất hiện 2 lần trong repo: requirements/ và specs/. Khi khởi tạo Management Repository, copy cả 2 nơi từ cùng một lượt ban hành của repo chuẩn hoá — trong một dự án không được có hai phiên bản khuôn khác nhau. Dự án đang chạy có phải nhận bản mới hay không: xem ràng buộc 5.

## 3. Ý nghĩa từng thư mục

    

  
    
| 
      Thư mục | Chứa gì | Ai viết
     |
  
  
    
| 
      requirements/ | WHAT — mô tả hệ thống hoặc sản phẩm cần làm gì, đạt được gì để đáp ứng nhu cầu người dùng và doanh nghiệp. Thường do khách hàng cung cấp; dự án tiếp nhận, chuyển sang Markdown và giữ nguyên nội dung | Khách hàng cung cấp, BrSE tiếp nhận
     |
    
| 
      specs/ | HOW — làm thế nào để đạt được yêu cầu nêu ở requirements/. Bản thân specs/ không chứa file thiết kế; mọi file nằm trong một thư mục feature, trong system-design/, hoặc trong _common/ | BrSE, Tech Lead, Dev
     |
    
| 
      specs/{screen-or-feature}/ | Cụm nghiệp vụ, chứa ba loại tài liệu của feature: Screen Specification, Function Specifications, Technical Design. Gộp các màn hình chia sẻ dữ liệu và có luồng chuyển tiếp trực tiếp cho nhau; không gộp chỉ vì cùng nằm trong một menu hay cùng một người làm. Feature chỉ có một màn hình là bình thường — vẫn đặt tên thư mục theo nghiệp vụ, không đặt theo Screen ID. Dự án chia theo màn hình: xem ghi chú §2 | BrSE, Dev
     |
    
| 
      {screen-or-feature}/screen-specification/{SCREEN_ID}_SPEC.md | Screen Specification: bố cục, định nghĩa item, validation, luồng, hiển thị lỗi — sinh từ BM-2-901-51. Một file một màn hình | BrSE, Dev
     |
    
| 
      {screen-or-feature}/function-specifications/{MODULE_ID}_FUNC.md | Function Specifications: danh mục function của một module — return type, tên hàm, tham số, mô tả, biến — sinh từ BM-2-901-54. Một file một module | Dev
     |
    
| 
      {screen-or-feature}/technical-design/{FUNC_ID}_TECH.md | Technical Design (trước 0.19.0 gọi là Detail Design): xử lý bên trong một function, sequence, điều kiện rẽ nhánh — sinh từ BM-2-901-53. Một file một function | Dev
     |
    
| 
      {screen-or-feature}/README.md | Bảng tài liệu của feature, kèm link sang các file cùng feature ở system-design/database-design/ và system-design/api-design/ — nơi duy nhất ghép lại mọi tài liệu của một feature | BrSE
     |
    
| 
      {screen-or-feature}/screen-specification/assets/ | Ảnh layout và ảnh annotated của các màn hình trong feature | BrSE
     |
    
| 
      specs/system-design/ | Thư mục bọc tài liệu mức hệ thống. Chỉ chứa đúng hai thư mục loại tài liệu bên dưới, không chứa file | Tech Lead
     |
    
| 
      system-design/database-design/ | Thiết kế cơ sở dữ liệu: danh sách bảng, định nghĩa cột, ràng buộc, migration — sinh từ BM-2-901-50. Bên trong chia {screen-or-feature}/ | Tech Lead, Dev
     |
    
| 
      system-design/api-design/ | Hợp đồng API: endpoint, request, response, mã lỗi — sinh từ BM-2-901-52. Một file một API. Bên trong chia {screen-or-feature}/ | Tech Lead, Dev
     |
    
| 
      _index.md | Bảng tra của thư mục chứa nó: thống kê và thông tin cơ bản của từng file bên dưới. Có ở requirements/, specs/, system-design/database-design/, system-design/api-design/. Cột bắt buộc xem ngay dưới bảng này | Người tạo hoặc sửa tài liệu
     |
    
| 
      _templates/ | Hai thứ đi cùng nhau: khuôn rỗng để dự án điền, và một bản mẫu đã điền sẵn bằng dữ liệu thật (sample-*) để dự án hình dung mức chi tiết cần đạt tới. specs/_templates/ giữ khuôn của cả 5 loại spec (BM-2-901-50 … BM-2-901-54); requirements/_templates/ giữ khuôn tài liệu yêu cầu. Thư mục loại tài liệu không có _templates/ riêng. Mỗi loại tài liệu chỉ có đúng một khuôn và một bản mẫu. Bản gốc nằm ở repo chuẩn hoá của công ty; dự án copy về khi khởi tạo Management Repository, giữ nguyên source và template_version ở frontmatter để truy được bản gốc và rà được lệch phiên bản | Công ty ban hành, dự án copy về
     |
    
| 
      _common/ | Tài liệu dùng từ hai feature trở lên mà không phải Database Design hay API Design: bảng mã lỗi, danh mục API, quy ước log, và Screen Specification / Function Specifications / Technical Design dùng chung. Database Design và API Design dùng chung thì đặt ở gốc thư mục loại đó, không đưa vào _common/ | BrSE, Tech Lead
     |
  

### _index.md

    

Mọi _index.md gồm hai phần, theo đúng thứ tự:

  - Dòng thống kê — tổng số tài liệu trong thư mục (vd: 12 tài liệu). Không thống kê theo trạng thái: trạng thái công việc chỉ nằm trên GitHub Project (RMP §V).

  - Bảng thông tin cơ bản từng file, tối thiểu các cột: ID · Tên tài liệu · Feature · Version · Updated by · Updated · Link.

specs/_index.md thêm cột Loại (SPEC · FUNC · TECH) ngay sau Tên tài liệu, vì ba loại nằm chung trong {screen-or-feature}/. Bảng này chỉ liệt kê file trong các thư mục {screen-or-feature}/ và _common/; Database Design và API Design không nhân bản danh sách xuống đây — chỉ ghi một dòng link tới system-design/database-design/_index.md và system-design/api-design/_index.md kèm số lượng tài liệu. Hai bản danh sách thì bản nào cũng có thể sai.

Ngoại lệ — requirements/_index.md không có cột Feature. requirements/ là thư mục phẳng, không có cấp {screen-or-feature}/; và một tài liệu yêu cầu thường trải nhiều feature nên một ô không điền được. Bộ cột của nó là: ID · Tên tài liệu · Version · Updated by · Updated · Link.

Updated by là người sửa gần nhất, không phải người chịu trách nhiệm tài liệu. Người chịu trách nhiệm là Assignee của Issue đi theo tài liệu đó trên GitHub Project — repo giữ tài liệu, Project giữ việc, nên không lặp thông tin này vào frontmatter.

Chỉ liệt kê file thật — không liệt kê file trong _templates/. Thêm, sửa hoặc xoá dòng ngay trong cùng lượt tạo file, tăng version hay xoá file; frontmatter và _index.md lệch nhau thì bảng tra mất giá trị và script kiểm tra báo lỗi.

## 4. Quy tắc đặt tên

    

  
    
| 
      Đối tượng | Quy tắc | Ví dụ đúng | Ví dụ sai
     |
  
  
    
| 
      Thư mục nhóm tài liệu ở gốc repo | kebab-case, tiếng Anh, không dấu, không đánh số | requirements/, specs/ | 01-requirements/, Specs/
     |
    
| 
      Thư mục mức hệ thống trong specs/ | đúng 1 tên cố định | system-design/ | system/, technical/, sd/
     |
    
| 
      Thư mục loại tài liệu trong system-design/ | đúng 2 tên cố định, không tự thêm hay đổi | database-design/, api-design/ | db/, apis/, screen-specification/
     |
    
| 
      Thư mục loại tài liệu trong {screen-or-feature}/ | đúng 3 tên cố định, không tự thêm hay đổi | screen-specification/, function-specifications/, technical-design/ | screens/, spec/, detail-design/
     |
    
| 
      Thư mục feature | kebab-case, tiếng Anh, không dấu. Chia theo màn hình thì dùng Screen ID chuyển sang kebab-case. Không trùng tên dành riêng (system-design, tên bắt đầu bằng _) | authentication/, payment-gateway/, ad-login/ | Authentication/, thanh-toán/, AD_LOGIN/, system-design/
     |
    
| 
      File khuôn rỗng | giữ nguyên tên bản gốc ở repo chuẩn hoá, không đổi, không thêm hậu tố dự án | BM-2-901-50-database-design-template.md | template.md, BM-2-901-50-fpaas.md
     |
    
| 
      File bản mẫu đã điền | sample-{tên file thật theo đúng quy tắc của loại đó} | sample-AUTH_DB.md, sample-AD_LOGIN_SPEC.md | AUTH_DB-sample.md, example.md, AUTH_DB_mau.md
     |
    
| 
      Tài liệu yêu cầu | REQ-{số Story}-{slug}.md — số Issue GitHub của Story (task cha của tính năng), dự án không tự cấp số thứ tự | REQ-123-admin-login.md | REQ-2608-01-admin-login.md, yeu cau KH.md
     |
    
| 
      Thiết kế cơ sở dữ liệu | {DB_ID}_DB.md — một file một nhóm bảng | AUTH_DB.md | database-design.md, db.md
     |
    
| 
      Spec màn hình | {SCREEN_ID}_SPEC.md | AD_LOGIN_SPEC.md | login.md, 01_Login.md
     |
    
| 
      Screen ID | {tiền tố hệ thống}_{tên màn hình}, viết HOA | AD_LOGIN, AD_PW_MUST_RESET | SCREEN1, login-screen
     |
    
| 
      Thiết kế API | {API_ID}_API.md — một file một API | AUTH_LOGIN_API.md | api-design.md
     |
    
| 
      Technical Design | {FUNC_ID}_TECH.md — một file một function | AUTH_VERIFY_TECH.md | design.md, AUTH_VERIFY_DETAIL.md
     |
    
| 
      Function Specifications | {MODULE_ID}_FUNC.md — một file một module | AUTH_FUNC.md | functions.md
     |
    
| 
      File ảnh | {SCREEN_ID}_{loại}.png — bắt buộc có tiền tố | AD_LOGIN_annotated.png | image1.png
     |
    
| 
      Nhánh bản đã release | main — đúng một tên | main | master, develop, current
     |
    
| 
      Nhánh version / milestone / phase | ver/{tên} — {tên} là {MAJOR}.{MINOR} của sản phẩm, hoặc slug kebab-case của milestone / phase; một kiểu cho cả dự án. Không phải version tài liệu. Không khoảng trắng, không chữ v đứng riêng, luôn có tiền tố ver/ | ver/1.0, ver/2.0, ver/phase-2, ver/mvp | ver 2.0, v2, next, ver/2.0.0-draft, phase-2
     |
    
| 
      Branch viết spec | feature/spec-{slug} — checkout từ nhánh version mà tài liệu phục vụ, PR về đúng nhánh đó; không checkout từ main | feature/spec-authentication | dung-spec
     |
    
| 
      Git tag release tài liệu | Chỉ gắn khi release source code của version / milestone / phase — không gắn khi khách hàng duyệt. Tên = tên tag release của source code + tiền tố req- hoặc spec-; gắn trên main tại commit merge release | req-v1.0.0, spec-v1.0.0, spec-phase-1 | final, spec-final, tag gắn lúc điền ô Approve, tag không khớp tên tag source code
     |
  

Tiền tố sample- đặt ở đầu, không phải hậu tố — để bản mẫu luôn nằm tách khỏi khuôn khi sắp xếp theo tên, và để script quét thư mục loại trừ được bằng đúng một pattern sample-*. Phần còn lại của tên giữ đúng quy tắc của loại tài liệu đó, nên người đọc thấy luôn tên file thật trông thế nào — bản mẫu dạy cả nội dung lẫn cách đặt tên.

Thư mục viết thường, file viết HOA — có chủ ý. Thư mục kebab-case để đường dẫn URL trên GitHub sạch và không dính lỗi phân biệt hoa/thường giữa Windows và Linux. Tên file giữ nguyên ID viết HOA để trùng khớp với ID dùng trong design, issue và testcase. Riêng file khuôn rỗng giữ tên gốc viết thường vì đó là tên do công ty ban hành, đổi là mất dấu vết về bản gốc.

Không đánh số thứ tự vào tên thư mục. Số chỉ đúng ở thời điểm đặt: thêm một nhóm tài liệu vào giữa thì phải đổi tên hàng loạt, kéo theo mọi link tương đối và mọi đường dẫn đã dẫn trong issue đều chết. Thứ tự đọc thể hiện ở README.md, không thể hiện ở tên thư mục.

Không dùng dấu tiếng Việt và khoảng trắng trong tên file và thư mục — khoảng trắng bị mã hoá thành %20, làm hỏng link tương đối trên GitHub và gây lỗi khi script quét thư mục.

## 5. Năm ràng buộc bắt buộc

    

  - Một đối tượng = một file, độ mịn theo bảng §4. Một màn hình, một API, một function (Technical Design), một nhóm bảng, một module — mỗi thứ một file. Gộp nhiều màn hình vào một file thì không tra được theo màn hình, và version của màn này kéo theo màn kia.

  - Mọi tài liệu nằm đúng chỗ của nó: Screen Specification, Function Specifications, Technical Design ở specs/{screen-or-feature}/{loại}/; Database Design và API Design ở specs/system-design/{loại}/{screen-or-feature}/. Đặt file thẳng trong specs/, đặt ba loại đầu thẳng trong {screen-or-feature}/ hay vào system-design/, hay đặt hai loại sau vào specs/{screen-or-feature}/ hoặc thẳng trong system-design/, thì script kiểm tra và Chat BOT không tìm thấy. Ngoại lệ duy nhất là ràng buộc 3.

  - Tài liệu dùng từ hai feature trở lên không đặt trong {screen-or-feature}/. Database Design và API Design thì đặt ở gốc thư mục loại đó (system-design/database-design/, system-design/api-design/); mọi tài liệu khác đặt ở _common/. Nơi khác chỉ link tới, không chép nội dung — chép thì sửa một chỗ, các bản sao còn lại thành sai.

  - Không tạo file bản sao theo version (login-v2.md, login-final.md). Sửa đè lên file gốc, tăng version, ghi History of change. Tài liệu bị huỷ thì xoá file khỏi branch và xoá dòng trong _index.md, cùng một PR — lý do ghi trên Issue / CR và commit message, nội dung cũ vẫn tra được trong git history.

  - Không sửa _templates/ tại chỗ, và mỗi khuôn chỉ có đúng một nơi ở. Hai thư mục _templates/ là bản copy từ repo chuẩn hoá của công ty, kể cả file sample-* bên trong. Cần thay đổi khuôn thì đề xuất ngược về repo chuẩn hoá — sửa riêng trong repo dự án thì mỗi dự án một khuôn khác nhau, quy chuẩn mất tác dụng. Khuôn spec chỉ nằm ở specs/_templates/ — không dựng thêm _templates/ trong system-design/ hay trong {screen-or-feature}/. Hai nơi giữ cùng một khuôn thì không biết nơi nào là bản đang dùng.

    Repo chuẩn hoá ban hành bản mới: chỉ dự án khởi tạo sau đó nhận bản mới (giai đoạn đầu, chốt 2026-09-28). Dự án đang chạy giữ nguyên bộ khuôn đã copy lúc khởi tạo, không bắt buộc đồng bộ — template_version ở frontmatter cho biết dự án đang dùng lượt ban hành nào. Chính sách đồng bộ cho dự án đang chạy sẽ xem lại sau giai đoạn đầu.

  Lịch sử thay đổi của tài liệu — mới nhất lên đầu

  
    - 1.1.0 bỏ thư mục change-requests/ (2026-10-05): hồ sơ CR là Issue CR trên GitHub Project, không lập file trong repo. Management Repository còn hai nhóm bắt buộc requirements/, specs/. CR không có mã riêng — tham chiếu thẳng Issue CR.
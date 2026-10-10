# Architecture design — Product A

Hệ thống hỗ trợ vận hành chợ bán buôn thủy sản 桜水産市場 (産地市場).

Tài liệu này mô tả **hai kiến trúc**, vì dự án thật sự có hai: bản PoC đang chạy ở LAB-3 và bản
production đã đề xuất ở LAB-1. Quyết định dùng hai đường được ghi ở [ADR-004](./03-adr.md#adr-004).

---

## 1. Bối cảnh nghiệp vụ quyết định kiến trúc

Bốn đặc thù dưới đây không phải chi tiết phụ — chúng là lý do hệ thống không thể dựng theo khuôn
CRUD thông thường. Mọi quyết định kiến trúc sau này đều quay về bốn điểm này.

| # | Đặc thù | Hệ quả lên kiến trúc |
|---|---|---|
| 1 | **相対取引 ~90% / せり ~10%** — thỏa thuận trực tiếp mới là luồng chính, không phải đấu giá | Một bảng giao dịch chung cho cả hai luồng, phân biệt bằng cột loại. Không dựng "auction engine" làm trung tâm |
| 2 | **Hai cấp pháp lý 許可 / 承認** — khác nhau về bản chất, cấm gộp | Bảng tư cách riêng, có ràng buộc buộc đúng cặp vai trò, kiểm tại thời điểm chốt giao dịch |
| 3 | **Sổ không được sửa** — dữ liệu đã chốt phải giải trình được khi kiểm toán | Mô hình ghi-thêm, sửa bằng bút toán đảo, khoá ngày nghiệp vụ |
| 4 | **Quy định đổi theo thời gian** — đổi biểu suất không được làm đổi kết quả kỳ trước | Tra quy định theo ngày nghiệp vụ, lưu lại phiên bản đã dùng |

Ngoài ra có **ràng buộc vận hành** hiếm gặp: khung giờ dịch vụ là **02:00–10:00 JST**, tức toàn
bộ tải nằm trong 8 giờ rạng sáng. Chợ nghỉ Chủ nhật. Điều này quyết định cách bố trí batch, cửa
sổ bảo trì và chế độ trực.

---

## 2. Kiến trúc PoC — đang chạy ở LAB-3

```mermaid
flowchart TB
    subgraph client["Trình duyệt · PC và tablet ≥10 inch"]
        UI["Next.js App Router<br/>9 trang · React 19 · Tailwind"]
    end

    subgraph vercel["Vercel"]
        PX["proxy.ts<br/>chặn request chưa có phiên"]
        API["12 API Route<br/>chạy trên Node runtime"]
    end

    subgraph supa["Supabase · PostgreSQL"]
        TB[("12 bảng<br/>5 enum")]
        TG["5 trigger<br/>thi hành quy tắc nghiệp vụ"]
        FN["4 hàm<br/>party_is_qualified · day_is_locked<br/>rate_as_of · guard"]
    end

    UI -->|fetch| PX
    PX -->|có cookie| API
    PX -.->|không có cookie| LOGIN["/login"]
    API -->|service_role key| TB
    TB --> TG
    TG --> FN

    classDef rule fill:#fef3c7,stroke:#d97706
    class TG,FN rule
```

**Điểm cần chú ý:** khối màu vàng — quy tắc nghiệp vụ nằm ở tầng database, không ở tầng ứng dụng.
Gọi thẳng API bằng curl hay thao tác trực tiếp trên database đều không lách được. Lý do ở
[ADR-002](./03-adr.md#adr-002).

### Bảo vệ cổng vào — hai lớp

```mermaid
sequenceDiagram
    participant U as Người dùng
    participant P as proxy.ts (Edge)
    participant S as Server Component / API
    participant D as Supabase

    U->>P: GET /trades
    alt không có cookie pa_session
        P-->>U: 307 → /login?next=/trades
    else có cookie
        P->>S: cho qua
        S->>S: getSession() xác minh HMAC-SHA256
        alt chữ ký sai
            S-->>U: không render nội dung
        else chữ ký đúng
            S->>D: truy vấn bằng service_role
            D-->>S: dữ liệu
            S-->>U: trang có nội dung
        end
    end
```

Lớp Edge chỉ kiểm tra **có** cookie hay không, vì Edge runtime không dùng được module crypto của
Node. Việc xác minh chữ ký thật nằm ở tầng server và được gọi lại ở từng trang, từng API route.
Cookie giả qua được lớp một nhưng chết ở lớp hai.

---

## 3. Kiến trúc production đề xuất

```mermaid
flowchart TB
    subgraph edge["Biên"]
        CF["CloudFront"]
        WAF["AWS WAF"]
    end

    subgraph app["VPC ap-northeast-1 · Tokyo"]
        ALB["Application Load Balancer"]
        subgraph ecs["ECS Fargate"]
            W1["Web / API task<br/>Next.js standalone"]
            W2["Worker task<br/>batch và job nền"]
        end
        RDS[("RDS PostgreSQL 16<br/>Multi-AZ")]
        S3[("S3<br/>ảnh chứng cứ")]
        SM["Secrets Manager"]
    end

    subgraph ext["Bên ngoài"]
        SFTP["SFTP kế toán<br/>IF-ACC-01"]
        MAIL["Dịch vụ gửi email"]
        STORE["App Store · Google Play"]
    end

    NAT["Native app<br/>iOS 16+ · Android 12+"]

    CF --> WAF --> ALB --> W1
    NAT -->|HTTPS| ALB
    W1 --> RDS
    W1 --> S3
    W1 --> SM
    EB["EventBridge Scheduler"] --> W2
    W2 --> RDS
    W2 -->|đẩy file đối soát| SFTP
    W2 -->|thông báo| MAIL
    S3 -->|lifecycle sau 3 năm| GL[("Glacier")]
    STORE -.->|phát hành| NAT

    classDef gap fill:#fee2e2,stroke:#dc2626
    class W2,EB,SFTP,MAIL,NAT,STORE,S3,GL gap
```

Khối màu đỏ là phần **chưa có trong PoC**. Danh sách đầy đủ kèm phân loại ở
[06-design-vs-code.md](./06-design-vs-code.md).

---

## 4. Luồng dữ liệu chính

Một ngày ở chợ đi theo mạch này. Mỗi mũi tên là một lần ghi vào sổ, không phải một lần sửa.

```mermaid
flowchart LR
    A["Tàu cá cập bến"] --> B["Tiếp nhận lô<br/>lot"]
    B --> C["Thẩm định bằng mắt<br/>inspection"]
    C --> D{"Luồng giao dịch"}
    D -->|~90%| E1["相対取引<br/>trade kind=negotiated"]
    D -->|~10%| E2["せり<br/>trade kind=auction"]
    E1 --> F["Giao hàng<br/>delivery"]
    E2 --> F
    F --> G["Đối soát ngày<br/>settlement_day"]
    G --> H["Khoá sổ"]
    H --> I["Tính tiền khuyến khích<br/>incentive"]

    E1 -.->|sửa sai| R["Dòng đảo<br/>reverses_id"]
    E2 -.-> R
    R -.-> G
```

Tổng tiền ở bước đối soát **cộng cả dòng đảo mang số âm**, nên số ròng tự đúng mà không phải xoá
bản ghi nào. Đó là điểm lợi trực tiếp của mô hình ghi-thêm.

---

## 5. Bốn điểm phân nhánh đặc thù — không được làm phẳng

Đây là phần mục tiêu học tập LAB-4 nhấn mạnh: *"không đơn giản hóa thành luồng tuyến tính chung"*.

### 5.1 Nhánh loại giao dịch

```mermaid
flowchart TD
    S["Chốt giao dịch"] --> K{"Loại?"}
    K -->|相対取引| N["Ghi người bán, người mua,<br/>khối lượng, đơn giá<br/>hand_sign = null"]
    K -->|せり| A["Ghi thêm ký hiệu tay<br/>do nhân viên NHẬP TAY<br/>SCOPE-OUT-02 cấm OCR"]
    N --> T[("trade")]
    A --> T
```

Hai nhánh **vào cùng một bảng**. Nếu tách hai bảng thì mọi báo cáo, mọi phép đối soát và mọi quy
tắc khoá sổ đều phải viết hai lần, và tỷ trọng 90/10 không tính được bằng một truy vấn.

### 5.2 Nhánh hai cấp pháp lý

```mermaid
flowchart TD
    P["Bên tham gia"] --> K{"Vai trò tham gia chợ"}
    K -->|卸売業者| W["Bán hàng<br/>không cần tư cách mua"]
    K -->|仲卸| I["許可 permit<br/>thủ tục xét duyệt nặng"]
    K -->|売買参加者| PA["承認 approval<br/>thủ tục nhẹ hơn"]
    K -->|買出人| B["KHÔNG có tư cách<br/>mua trực tiếp"]

    I --> Q{"Còn hiệu lực<br/>vào ngày nghiệp vụ?"}
    PA --> Q
    Q -->|có| OK["Cho chốt giao dịch"]
    Q -->|hết hạn / tạm ngưng| NG["Chặn, nêu lý do"]
    B --> VIA["Phải mua qua 仲卸"]

    classDef rule fill:#fef3c7,stroke:#d97706
    class I,PA,B rule
```

許可 và 承認 **không phải hai mức của cùng một thứ**. Gộp chúng thành một cờ `được_phép_giao_dịch`
là sai luật, và tài liệu khách cấm đích danh. Ràng buộc này được thi hành bằng trigger
`qualification_kind_check` — thêm ở LAB-4 sau khi phát hiện PoC thiếu (xem
[06-design-vs-code.md](./06-design-vs-code.md), mục L-01).

### 5.3 Nhánh khoá ngày nghiệp vụ

```mermaid
flowchart TD
    W["Mọi lệnh ghi<br/>giao dịch / giao hàng"] --> C{"day_is_locked<br/>(business_day)?"}
    C -->|chưa khoá| OK["Cho ghi"]
    C -->|đã khoá| NG["Trigger ném lỗi<br/>ở tầng database"]
    NG --> ALT["Muốn sửa thì phải<br/>mở lại ngày, có ghi nhật ký"]
```

Kiểm ở trigger chứ không ở tầng ứng dụng. Nếu kiểm bằng câu `if` trong API thì gọi thẳng database
vẫn ghi được, và lời hứa "dữ liệu đã chốt không đổi" trở thành lời nói suông.

### 5.4 Nhánh tra quy định theo thời gian

```mermaid
flowchart TD
    I["Tính thưởng cho<br/>ngày nghiệp vụ D"] --> R["rate_as_of(D)"]
    R --> Q["SELECT ... WHERE effective_from <= D<br/>ORDER BY effective_from DESC LIMIT 1"]
    Q --> V["Lưu rate_version_no<br/>vào từng dòng kết quả"]

    X["SAI: lấy bản mới nhất<br/>ORDER BY effective_from DESC"] -.->|đổi biểu suất hôm nay<br/>→ kết quả tháng trước đổi theo| BAD["Không giải trình được<br/>khi kiểm toán"]

    classDef bad fill:#fee2e2,stroke:#dc2626
    class X,BAD bad
```

Điều kiện `effective_from <= D` là toàn bộ sự khác nhau giữa đúng và sai ở đây. Bỏ nó đi thì mã
vẫn chạy, vẫn ra số, không báo lỗi gì — chỉ sai nghiệp vụ.

---

## 6. Điểm tích hợp

| Mã | Đối tác | Chiều | Phương thức | Trạng thái PoC |
|---|---|---|---|---|
| IF-ACC-01 | Hệ thống kế toán của khách | Ra | File CSV đẩy lên SFTP sau khi khoá sổ | **Chưa có** |
| — | Dịch vụ gửi email | Ra | SMTP, có thử lại | **Chưa có** |
| — | App Store / Google Play | Ra | Phát hành ứng dụng native | **Chưa có** (đã bỏ native) |
| — | Lưu trữ ảnh chứng cứ | Hai chiều | S3 + lifecycle sang Glacier sau 3 năm | **Chưa có** |

Phương thức của IF-ACC-01 vẫn là **giả định ASM-14 của LAB-1**, khách chưa xác nhận. Nếu khách
yêu cầu gọi API thay vì đẩy file thì phát sinh thêm tài liệu API, xử lý lỗi và thử lại.

---

## 7. Ràng buộc phi chức năng ảnh hưởng kiến trúc

| Mã | Yêu cầu | Kiến trúc đáp ứng thế nào | PoC |
|---|---|---|---|
| NFR-AVL-01 | 99,5% trong 02:00–10:00 JST | Multi-AZ, ALB, ECS nhiều task | Vercel SLA mặc định |
| NFR-AVL-02 | Tiếp nhận lô và ghi giao hàng chạy offline | Hàng đợi trên thiết bị native, đồng bộ khi có mạng | **Chưa có** |
| NFR-AVL-03 | RTO 4h, RPO 15 phút | RDS tự sao lưu + PITR | Supabase sao lưu mặc định |
| NFR-SEC-01 | MFA bắt buộc cho quản trị | Auth.js + TOTP | **Chưa có** — nợ kỹ thuật |
| NFR-PRIV-01 | Dữ liệu đặt tại vùng Nhật | VPC ap-northeast-1 | Cần chọn vùng Tokyo khi tạo Supabase |
| NFR-RET-01 | Dữ liệu 7 năm, ảnh 3 năm rồi lưu lạnh | S3 lifecycle → Glacier | **Chưa có** |
| NFR-BATCH-01 | Báo cáo ngày xong trước 11:00 JST | EventBridge kích hoạt worker sau khi khoá sổ | **Chưa có** |
| NFR-COMP-01 | 2 trình duyệt evergreen + tablet ≥10 inch | Responsive | ✅ đã có |
| NFR-COMP-02 | iOS 16+ / Android 12+ | React Native | **Đã bỏ** — xem ADR-008 |

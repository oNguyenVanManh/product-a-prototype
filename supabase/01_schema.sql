-- ============================================================================
-- Product A — Hệ thống hỗ trợ vận hành chợ bán buôn thủy sản
-- Schema cho bản prototype LAB-3
--
-- Bám theo product_a_functions_list.xlsx và product_a_screen_list.xlsx của LAB-1.
-- Hai đặc thù nghiệp vụ được làm THẬT ở tầng database, không mock:
--   1. Sổ ghi-thêm (append-only): bảng trade không cho UPDATE/DELETE.
--      Sửa giao dịch = ghi bản ghi đảo, lịch sử không bao giờ mất.
--   2. Khoá ngày nghiệp vụ: ngày đã chốt sổ thì chặn mọi ghi mới vào ngày đó.
-- Hai thứ này là lý do RFP tồn tại (BR-CLOSE-01, FR-CORR-02, GOV-RULE-01),
-- nên prototype phải chứng minh được chứ không được giả lập ở tầng UI.
-- ============================================================================

-- Dọn sạch để chạy lại được nhiều lần
drop table if exists incentive            cascade;
drop table if exists payment_status       cascade;
drop table if exists rate_version         cascade;
drop table if exists settlement_day       cascade;
drop table if exists delivery             cascade;
drop table if exists trade                cascade;
drop table if exists inspection           cascade;
drop table if exists lot                  cascade;
drop table if exists party_qualification  cascade;
drop table if exists party                cascade;
drop table if exists app_user             cascade;
drop table if exists audit_log            cascade;

drop type if exists party_kind       cascade;
drop type if exists qualification_ty cascade;
drop type if exists trade_kind       cascade;
drop type if exists lot_status       cascade;
drop type if exists delivery_status  cascade;

-- ---------------------------------------------------------------------------
-- Kiểu liệt kê
-- ---------------------------------------------------------------------------

-- 4 vai trò tham gia chợ theo RFP mục 02-02 (TBL-ACTOR-01)
create type party_kind as enum (
  'wholesaler',   -- 卸売業者  đơn vị bán buôn
  'intermediate', -- 仲卸      đơn vị trung gian
  'participant',  -- 売買参加者 người có quyền tham gia mua bán trực tiếp
  'buyer'         -- 買出人    người mua lẻ tại chợ
);

-- HAI CẤP PHÁP LÝ KHÁC NHAU — RFP mục 02-08 cấm gộp hai cấp này làm một.
-- 許可 (permit)   cấp cho 仲卸      — thủ tục nặng hơn
-- 承認 (approval) cấp cho 売買参加者 — thủ tục nhẹ hơn
-- Tách thành 2 giá trị riêng chứ không dùng chung một cột "được phép giao dịch".
create type qualification_ty as enum ('permit', 'approval');

-- Luồng chính và luồng phụ. RFP FIG-009: 相対取引 ~90% giá trị, せり ~10%.
-- Tên gọi "chợ đấu giá" dễ làm người ngoài tưởng auction là luồng chính.
create type trade_kind as enum (
  'negotiated',   -- 相対取引 giao dịch thỏa thuận trực tiếp — LUỒNG CHÍNH
  'auction'       -- せり     phiên đấu giá công khai      — luồng phụ
);

create type lot_status      as enum ('received','inspected','published','traded','delivered');
create type delivery_status as enum ('pending','partial','completed','exception');

-- ---------------------------------------------------------------------------
-- Người dùng nội bộ (SCR-01 đăng nhập, SCR-02 quản lý tài khoản và quyền)
-- ---------------------------------------------------------------------------
create table app_user (
  id          uuid primary key default gen_random_uuid(),
  email       text unique not null,
  full_name   text not null,
  -- Vai trò hệ thống, khác với vai trò tham gia chợ ở bảng party
  role        text not null check (role in (
                'ROLE_SYS_ADMIN',   -- quản trị hệ thống
                'ROLE_INTAKE',      -- tiếp nhận lô
                'ROLE_JUDGE',       -- thẩm định bằng mắt
                'ROLE_TRADE',       -- chốt giao dịch
                'ROLE_DELIVERY',    -- giao hàng
                'ROLE_SETTLEMENT'   -- đối soát
              )),
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Bên tham gia chợ (SCR-03)
-- ---------------------------------------------------------------------------
create table party (
  id          uuid primary key default gen_random_uuid(),
  code        text unique not null,
  name        text not null,
  kind        party_kind not null,
  phone       text,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- Tư cách giao dịch — tách riêng khỏi party vì một bên có thể có nhiều
-- giấy tờ qua thời gian, và vì permit/approval là hai cấp pháp lý khác nhau.
create table party_qualification (
  id          uuid primary key default gen_random_uuid(),
  party_id    uuid not null references party(id) on delete cascade,
  kind        qualification_ty not null,
  cert_no     text not null,
  valid_from  date not null,
  valid_to    date not null,
  suspended   boolean not null default false,
  created_at  timestamptz not null default now()
);
create index on party_qualification (party_id, valid_to);

-- Một bên có tư cách hợp lệ vào ngày nghiệp vụ nào đó hay không.
-- Dùng ở lúc chốt giao dịch: hết hạn hoặc bị tạm ngưng thì chặn.
create or replace function party_is_qualified(p_party uuid, p_day date)
returns boolean language sql stable as $$
  select exists (
    select 1 from party_qualification q
    where q.party_id = p_party
      and q.suspended = false
      and p_day between q.valid_from and q.valid_to
  );
$$;

-- ---------------------------------------------------------------------------
-- Lô hàng (SCR-05 tiếp nhận) và thẩm định (SCR-06)
-- ---------------------------------------------------------------------------
create table lot (
  id             uuid primary key default gen_random_uuid(),
  lot_code       text unique not null,
  business_day   date not null,
  species        text not null,              -- tên loài thủy sản
  quantity_kg    numeric(10,2) not null check (quantity_kg > 0),
  remaining_kg   numeric(10,2) not null,     -- trừ dần khi tách bán nhiều người
  wholesaler_id  uuid not null references party(id),
  status         lot_status not null default 'received',
  received_at    timestamptz not null default now(),
  created_by     uuid references app_user(id)
);
create index on lot (business_day);

-- CAP-HUMAN-01: thẩm định độ tươi do NGƯỜI làm, hệ thống chỉ ghi lại kết quả.
-- RFP SCOPE-OUT-01 cấm tự động chấm điểm chất lượng, nên ở đây cố tình
-- KHÔNG có cột điểm do máy tính ra — chỉ có hạng do người chọn và tên người đó.
create table inspection (
  id           uuid primary key default gen_random_uuid(),
  lot_id       uuid not null references lot(id) on delete cascade,
  grade        text not null check (grade in ('A','B','C')),
  note         text,
  inspected_by uuid not null references app_user(id),
  inspected_at timestamptz not null default now()
);
create index on inspection (lot_id);

-- ---------------------------------------------------------------------------
-- Ngày nghiệp vụ và việc chốt sổ (SCR-14, SCR-15)
-- Khoá ngày trước khi định nghĩa trade vì trade tham chiếu tới nó.
-- ---------------------------------------------------------------------------
create table settlement_day (
  business_day date primary key,
  is_locked    boolean not null default false,
  locked_at    timestamptz,
  locked_by    uuid references app_user(id)
);

create or replace function day_is_locked(p_day date)
returns boolean language sql stable as $$
  select coalesce((select is_locked from settlement_day where business_day = p_day), false);
$$;

-- ---------------------------------------------------------------------------
-- Giao dịch — SỔ GHI-THÊM (SCR-07 thỏa thuận, SCR-09 đấu giá, SCR-08 danh sách)
--
-- Không có cột trạng thái "đã huỷ". Huỷ một giao dịch = thêm một dòng mới
-- có reverses_id trỏ về dòng cũ và amount âm. Dòng gốc nằm nguyên tại chỗ.
-- Trigger bên dưới chặn UPDATE và DELETE ở tầng database, nên dù API có lỗi
-- thì lịch sử vẫn không hỏng được.
-- ---------------------------------------------------------------------------
create table trade (
  id            uuid primary key default gen_random_uuid(),
  trade_code    text unique not null,
  business_day  date not null,
  kind          trade_kind not null,
  lot_id        uuid not null references lot(id),
  seller_id     uuid not null references party(id),
  buyer_id      uuid not null references party(id),
  quantity_kg   numeric(10,2) not null,
  unit_price    numeric(10,2) not null,
  amount        numeric(12,2) not null,       -- âm với dòng đảo
  -- Chỉ có ở giao dịch đấu giá: ký hiệu tay riêng của chợ, người nhập tay.
  -- SCOPE-OUT-02 cấm dùng OCR/AI đọc ký hiệu tay, nên đây là ô text thuần.
  hand_sign     text,
  reverses_id   uuid references trade(id),    -- khác null = đây là dòng đảo
  created_by    uuid references app_user(id),
  created_at    timestamptz not null default now()
);
create index on trade (business_day);
create index on trade (kind);
create index on trade (lot_id);

-- Chặn sửa và xoá ở tầng database
create or replace function trade_append_only()
returns trigger language plpgsql as $$
begin
  raise exception
    'Bảng trade là sổ ghi-thêm: không được % . Muốn sửa thì ghi dòng đảo (reverses_id).',
    tg_op;
end $$;

create trigger trade_no_update before update on trade
  for each row execute function trade_append_only();
create trigger trade_no_delete before delete on trade
  for each row execute function trade_append_only();

-- Chặn ghi vào ngày đã khoá sổ, và chặn giao dịch của bên không còn tư cách
create or replace function trade_guard()
returns trigger language plpgsql as $$
begin
  if day_is_locked(new.business_day) then
    raise exception 'Ngày nghiệp vụ % đã khoá sổ, không ghi thêm giao dịch được.',
      new.business_day;
  end if;

  -- Dòng đảo được miễn kiểm tra tư cách: nó chỉ sửa sai cho dòng cũ.
  if new.reverses_id is null then
    if not party_is_qualified(new.buyer_id, new.business_day) then
      raise exception 'Bên mua không có tư cách giao dịch hợp lệ vào ngày %.',
        new.business_day;
    end if;
  end if;

  return new;
end $$;

create trigger trade_check before insert on trade
  for each row execute function trade_guard();

-- ---------------------------------------------------------------------------
-- Giao hàng (SCR-11 bảng theo dõi, SCR-12 ghi nhận)
-- Một giao dịch giao được nhiều lần — RFP FR-DEL-04/05.
-- ---------------------------------------------------------------------------
create table delivery (
  id           uuid primary key default gen_random_uuid(),
  trade_id     uuid not null references trade(id),
  delivered_kg numeric(10,2) not null,
  status       delivery_status not null default 'pending',
  exception_reason text,
  delivered_at timestamptz not null default now(),
  created_by   uuid references app_user(id)
);
create index on delivery (trade_id);

-- ---------------------------------------------------------------------------
-- Biểu suất thưởng theo phiên bản (SCR-21)
--
-- GOV-RULE-01: tra cứu biểu suất phải theo NGÀY NGHIỆP VỤ, không theo now().
-- Đổi biểu suất hôm nay không được làm đổi kết quả đã tính của tháng trước.
-- Hàm rate_as_of() bên dưới là chỗ quy tắc đó được thi hành.
-- ---------------------------------------------------------------------------
create table rate_version (
  id             uuid primary key default gen_random_uuid(),
  version_no     int unique not null,
  effective_from date not null,
  rate_pct       numeric(5,2) not null,  -- phần trăm thưởng
  tax_factor     numeric(6,4) not null default 1.1000, -- BR-INC-01: hệ số 110/100
  approved_by    uuid references app_user(id),
  created_at     timestamptz not null default now()
);

-- Lấy biểu suất CÓ HIỆU LỰC VÀO NGÀY NGHIỆP VỤ, không phải biểu suất mới nhất.
create or replace function rate_as_of(p_day date)
returns rate_version language sql stable as $$
  select * from rate_version
  where effective_from <= p_day
  order by effective_from desc, version_no desc
  limit 1;
$$;

-- ---------------------------------------------------------------------------
-- Trạng thái thanh toán (SCR-19) và kết quả tính thưởng (SCR-20)
--
-- ASM-09 của LAB-1: RFP không nói rõ nguồn dữ liệu trạng thái thanh toán,
-- nên giả định là bộ phận đối soát NHẬP TAY. Prototype làm đúng giả định đó.
-- ---------------------------------------------------------------------------
create table payment_status (
  id           uuid primary key default gen_random_uuid(),
  party_id     uuid not null references party(id),
  business_day date not null,
  due_date     date not null,
  paid_date    date,                  -- null = chưa thanh toán
  entered_by   uuid references app_user(id),
  entered_at   timestamptz not null default now(),
  unique (party_id, business_day)
);

create table incentive (
  id            uuid primary key default gen_random_uuid(),
  party_id      uuid not null references party(id),
  business_day  date not null,
  base_amount   numeric(12,2) not null,  -- tổng giao dịch đã chốt trong kỳ
  rate_version_no int not null,          -- phiên bản ĐÃ DÙNG, lưu lại để giải trình
  rate_pct      numeric(5,2) not null,
  incentive_amt numeric(12,2) not null,
  on_time       boolean not null,
  calculated_at timestamptz not null default now(),
  unique (party_id, business_day)
);

-- ---------------------------------------------------------------------------
-- Nhật ký kiểm toán — ghi lại thao tác nhạy cảm (FR-AUDIT-01)
-- ---------------------------------------------------------------------------
create table audit_log (
  id         bigserial primary key,
  actor_id   uuid references app_user(id),
  action     text not null,
  entity     text not null,
  entity_id  text,
  detail     jsonb,
  created_at timestamptz not null default now()
);
create index on audit_log (created_at desc);

-- ---------------------------------------------------------------------------
-- Bật RLS. Prototype truy cập qua service_role ở API route phía server,
-- nên các policy này chỉ chặn truy cập trực tiếp bằng anon key từ trình duyệt.
-- ---------------------------------------------------------------------------
alter table app_user            enable row level security;
alter table party               enable row level security;
alter table party_qualification enable row level security;
alter table lot                 enable row level security;
alter table inspection          enable row level security;
alter table trade               enable row level security;
alter table delivery            enable row level security;
alter table settlement_day      enable row level security;
alter table rate_version        enable row level security;
alter table payment_status      enable row level security;
alter table incentive           enable row level security;
alter table audit_log           enable row level security;

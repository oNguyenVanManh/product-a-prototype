-- ============================================================================
-- Dữ liệu mẫu cho prototype LAB-3. Toàn bộ là số liệu giả.
--
-- Tỷ lệ giao dịch bám đúng RFP FIG-009: 相対取引 ~90% / せり ~10%.
-- Tỷ lệ này không phải cho đẹp — nó là bằng chứng đọc đúng đặc thù của đề,
-- vì tên gọi "chợ đấu giá" làm người ngoài tưởng đấu giá mới là luồng chính.
--
-- Chạy SAU 01_schema.sql.
-- ============================================================================

truncate audit_log, incentive, payment_status, rate_version,
         delivery, trade, settlement_day, inspection, lot,
         party_qualification, party, app_user restart identity cascade;

-- ---------------------------------------------------------------------------
-- 1. Người dùng nội bộ. Mật khẩu demo nằm ở biến môi trường, không ở đây.
-- ---------------------------------------------------------------------------
insert into app_user (email, full_name, role) values
  ('admin@sakura-market.example',      'Quản trị hệ thống',   'ROLE_SYS_ADMIN'),
  ('intake@sakura-market.example',     'Nguyễn Văn Tiếp',     'ROLE_INTAKE'),
  ('judge@sakura-market.example',      'Trần Thị Thẩm',       'ROLE_JUDGE'),
  ('trade@sakura-market.example',      'Lê Văn Giao',         'ROLE_TRADE'),
  ('delivery@sakura-market.example',   'Phạm Thị Vận',        'ROLE_DELIVERY'),
  ('settlement@sakura-market.example', 'Hoàng Văn Soát',      'ROLE_SETTLEMENT');

-- ---------------------------------------------------------------------------
-- 2. Hai mươi bên tham gia chợ, đủ 4 vai trò
-- ---------------------------------------------------------------------------
insert into party (code, name, kind, phone) values
  ('WS-01','Công ty Thủy sản Vịnh Sakura',   'wholesaler','078-111-0001'),
  ('WS-02','Hợp tác xã Tàu cá Minato',       'wholesaler','078-111-0002'),
  ('WS-03','Thủy sản Bắc Cảng',              'wholesaler','078-111-0003'),
  ('IM-01','Trung gian Hamasaki',            'intermediate','078-222-0001'),
  ('IM-02','Trung gian Tsukiji Đông',        'intermediate','078-222-0002'),
  ('IM-03','Trung gian Marufuku',            'intermediate','078-222-0003'),
  ('IM-04','Trung gian Kaiyo',               'intermediate','078-222-0004'),
  ('IM-05','Trung gian Shiosai',             'intermediate','078-222-0005'),
  ('IM-06','Trung gian Nagisa',              'intermediate','078-222-0006'),
  ('PA-01','Siêu thị Aozora',                'participant','078-333-0001'),
  ('PA-02','Chuỗi nhà hàng Umi',             'participant','078-333-0002'),
  ('PA-03','Chế biến thủy sản Kosei',        'participant','078-333-0003'),
  ('PA-04','Siêu thị Hinode',                'participant','078-333-0004'),
  ('PA-05','Khách sạn Shirahama',            'participant','078-333-0005'),
  ('BY-01','Quán ăn Isoya',                  'buyer','078-444-0001'),
  ('BY-02','Cửa hàng cá Tanaka',             'buyer','078-444-0002'),
  ('BY-03','Quán sushi Kawa',                'buyer','078-444-0003'),
  ('BY-04','Cửa hàng cá Yamamoto',           'buyer','078-444-0004'),
  ('BY-05','Quán ăn Benten',                 'buyer','078-444-0005'),
  ('BY-06','Cửa hàng cá Ebisu',              'buyer','078-444-0006');

-- ---------------------------------------------------------------------------
-- 3. Tư cách giao dịch — HAI CẤP PHÁP LÝ KHÁC NHAU
--    仲卸 (intermediate) nhận 許可 permit
--    売買参加者 (participant) nhận 承認 approval
--    買出人 (buyer) KHÔNG có tư cách giao dịch trực tiếp, phải mua qua trung gian
--    → đây là lý do bảng này tách riêng khỏi party
-- ---------------------------------------------------------------------------
insert into party_qualification (party_id, kind, cert_no, valid_from, valid_to, suspended)
select id, 'permit',
       'KYOKA-' || substr(code, 4, 2),
       date '2026-01-01', date '2027-03-31', false
from party where kind = 'intermediate';

insert into party_qualification (party_id, kind, cert_no, valid_from, valid_to, suspended)
select id, 'approval',
       'SHONIN-' || substr(code, 4, 2),
       date '2026-01-01', date '2027-03-31', false
from party where kind = 'participant';

-- Một trường hợp sắp hết hạn để màn hình SCR-03 có cái mà cảnh báo
update party_qualification
set valid_to = date '2026-10-31'
where party_id = (select id from party where code = 'IM-06');

-- Một trường hợp bị tạm ngưng — thử chốt giao dịch cho bên này sẽ bị chặn
update party_qualification
set suspended = true
where party_id = (select id from party where code = 'PA-05');

-- ---------------------------------------------------------------------------
-- 4. Lô hàng, thẩm định, giao dịch, giao hàng — sinh cho 14 ngày nghiệp vụ
-- ---------------------------------------------------------------------------
do $$
declare
  v_day        date;
  v_start      date := date '2026-09-28';
  v_species    text[] := array['Cá ngừ vây vàng','Cá thu','Cá tráp đỏ','Mực ống',
                               'Tôm he','Cá bơn','Cá cam','Bạch tuộc','Cá sòng','Sò điệp'];
  v_lot        lot%rowtype;
  v_lot_seq    int := 0;
  v_trade_seq  int := 0;
  v_ws         uuid[];
  v_buyers     uuid[];   -- các bên CÓ tư cách giao dịch (trung gian + tham gia)
  v_users      record;
  v_qty        numeric;
  v_price      numeric;
  v_kind       trade_kind;
  v_buyer      uuid;
  v_trade_id   uuid;
  i            int;
  j            int;
begin
  select array_agg(id) into v_ws     from party where kind = 'wholesaler';
  select array_agg(id) into v_buyers from party
    where kind in ('intermediate','participant')
      and party_is_qualified(id, date '2026-10-05');  -- loại bên bị tạm ngưng

  select
    (select id from app_user where role='ROLE_INTAKE')     as intake,
    (select id from app_user where role='ROLE_JUDGE')      as judge,
    (select id from app_user where role='ROLE_TRADE')      as trade,
    (select id from app_user where role='ROLE_DELIVERY')   as delivery
  into v_users;

  for d in 0..13 loop
    v_day := v_start + d;
    -- Chủ nhật chợ nghỉ
    if extract(dow from v_day) = 0 then continue; end if;

    insert into settlement_day (business_day, is_locked) values (v_day, false);

    -- Khoảng 4 lô mỗi ngày
    for i in 1..4 loop
      v_lot_seq := v_lot_seq + 1;
      v_qty := 50 + (random() * 250)::numeric(10,2);

      insert into lot (lot_code, business_day, species, quantity_kg, remaining_kg,
                       wholesaler_id, status, created_by)
      values (
        'LOT-' || to_char(v_day,'YYYYMMDD') || '-' || lpad(i::text,2,'0'),
        v_day,
        v_species[1 + (random() * 9)::int],
        v_qty, v_qty,
        v_ws[1 + (random() * (array_length(v_ws,1)-1))::int],
        'inspected',
        v_users.intake
      )
      returning * into v_lot;

      -- Thẩm định bằng mắt — người làm, hệ thống chỉ ghi lại
      insert into inspection (lot_id, grade, note, inspected_by)
      values (
        v_lot.id,
        (array['A','B','C'])[1 + (random() * 2)::int],
        'Thẩm định bằng mắt tại bến. Độ tươi đánh giá thủ công.',
        v_users.judge
      );

      -- Mỗi lô bán 1-2 giao dịch
      for j in 1..(1 + (random() * 1)::int) loop
        exit when v_lot.remaining_kg <= 10;
        v_trade_seq := v_trade_seq + 1;

        -- TỶ LỆ 90/10 — cứ 10 giao dịch thì 1 là đấu giá
        v_kind := case when v_trade_seq % 10 = 0 then 'auction'::trade_kind
                                                 else 'negotiated'::trade_kind end;

        v_qty   := least(v_lot.remaining_kg, (20 + random() * 80)::numeric(10,2));
        v_price := (800 + random() * 4200)::numeric(10,2);
        v_buyer := v_buyers[1 + (random() * (array_length(v_buyers,1)-1))::int];

        insert into trade (trade_code, business_day, kind, lot_id, seller_id, buyer_id,
                           quantity_kg, unit_price, amount, hand_sign, created_by)
        values (
          'TRD-' || to_char(v_day,'YYYYMMDD') || '-' || lpad(v_trade_seq::text,3,'0'),
          v_day, v_kind, v_lot.id, v_lot.wholesaler_id, v_buyer,
          v_qty, v_price, (v_qty * v_price)::numeric(12,2),
          -- Ký hiệu tay chỉ có ở đấu giá, nhân viên nhập tay (SCOPE-OUT-02)
          case when v_kind = 'auction'
               then (array['ヤリ','ニギリ','ソデ','カギ'])[1 + (random()*3)::int]
               else null end,
          v_users.trade
        )
        returning id into v_trade_id;

        update lot set remaining_kg = remaining_kg - v_qty where id = v_lot.id;
        select * into v_lot from lot where id = v_lot.id;

        -- Giao hàng: phần lớn giao đủ, một ít giao thiếu
        insert into delivery (trade_id, delivered_kg, status, exception_reason, created_by)
        values (
          v_trade_id,
          case when random() < 0.85 then v_qty else (v_qty * 0.7)::numeric(10,2) end,
          case when random() < 0.85 then 'completed'::delivery_status
                                    else 'partial'::delivery_status end,
          case when random() < 0.85 then null else 'Thiếu hàng do hao hụt khi vận chuyển' end,
          v_users.delivery
        );
      end loop;
    end loop;
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- 5. Một giao dịch bị huỷ bằng DÒNG ĐẢO, không phải bằng UPDATE
--    Đây là chỗ chứng minh sổ ghi-thêm hoạt động thật.
-- ---------------------------------------------------------------------------
do $$
declare v_t trade%rowtype;
begin
  select * into v_t from trade
   where kind = 'negotiated' and reverses_id is null
   order by created_at limit 1;

  insert into trade (trade_code, business_day, kind, lot_id, seller_id, buyer_id,
                     quantity_kg, unit_price, amount, reverses_id, created_by)
  values (v_t.trade_code || '-REV', v_t.business_day, v_t.kind, v_t.lot_id,
          v_t.seller_id, v_t.buyer_id,
          -v_t.quantity_kg, v_t.unit_price, -v_t.amount,
          v_t.id, v_t.created_by);
end $$;

-- ---------------------------------------------------------------------------
-- 6. Biểu suất thưởng theo phiên bản
--    Hai phiên bản có ngày hiệu lực khác nhau để màn hình SCR-20 chứng minh
--    được việc tra cứu theo NGÀY NGHIỆP VỤ chứ không lấy bản mới nhất.
-- ---------------------------------------------------------------------------
insert into rate_version (version_no, effective_from, rate_pct, tax_factor, approved_by)
values
  (1, date '2026-01-01', 1.50, 1.1000, (select id from app_user where role='ROLE_SYS_ADMIN')),
  (2, date '2026-10-05', 2.00, 1.1000, (select id from app_user where role='ROLE_SYS_ADMIN'));

-- ---------------------------------------------------------------------------
-- 7. Trạng thái thanh toán — nhập tay theo giả định ASM-09
-- ---------------------------------------------------------------------------
insert into payment_status (party_id, business_day, due_date, paid_date, entered_by)
select
  t.buyer_id,
  t.business_day,
  t.business_day + 10,
  -- khoảng 70% trả đúng hạn
  case when random() < 0.7 then t.business_day + (random()*9)::int
                           else t.business_day + 12 + (random()*5)::int end,
  (select id from app_user where role='ROLE_SETTLEMENT')
from (select distinct buyer_id, business_day from trade where reverses_id is null) t
on conflict (party_id, business_day) do nothing;

-- ---------------------------------------------------------------------------
-- 8. Khoá sổ 3 ngày đầu — làm SAU khi đã nạp giao dịch, vì trigger chặn ghi
--    vào ngày đã khoá. Thứ tự này tự nó chứng minh ràng buộc có hiệu lực.
-- ---------------------------------------------------------------------------
update settlement_day
set is_locked = true,
    locked_at = now(),
    locked_by = (select id from app_user where role='ROLE_SETTLEMENT')
where business_day in (date '2026-09-28', date '2026-09-29', date '2026-09-30');

insert into audit_log (actor_id, action, entity, entity_id, detail)
select (select id from app_user where role='ROLE_SETTLEMENT'),
       'LOCK_SETTLEMENT_DAY', 'settlement_day', business_day::text,
       jsonb_build_object('business_day', business_day)
from settlement_day where is_locked;

-- ---------------------------------------------------------------------------
-- Kiểm nhanh sau khi nạp
-- ---------------------------------------------------------------------------
select 'bên tham gia' as muc, count(*)::text as so_luong from party
union all select 'lô hàng',        count(*)::text from lot
union all select 'giao dịch',      count(*)::text from trade
union all select '  thỏa thuận',   count(*)::text from trade where kind='negotiated'
union all select '  đấu giá',      count(*)::text from trade where kind='auction'
union all select '  dòng đảo',     count(*)::text from trade where reverses_id is not null
union all select 'tỷ lệ thỏa thuận',
  round(100.0 * count(*) filter (where kind='negotiated') / nullif(count(*),0), 1)::text || '%'
  from trade where reverses_id is null
union all select 'ngày đã khoá sổ', count(*)::text from settlement_day where is_locked;

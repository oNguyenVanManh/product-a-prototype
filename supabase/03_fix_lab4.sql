-- ============================================================================
-- Sửa 2 lỗi phát hiện khi đối chiếu thiết kế với mã nguồn ở LAB-4.
--
-- Chạy SAU 01_schema.sql và 02_seed.sql trên database đã có.
-- Nội dung này cũng đã được gộp vào 01_schema.sql cho lần cài mới.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- LỖI 1 — Hai cấp pháp lý tách bằng enum nhưng KHÔNG có gì thi hành
--
-- Tài liệu khách (mục 02-08) cấm coi 許可 và 承認 là cùng một loại quyền.
-- Schema cũ có 2 giá trị enum riêng nên NHÌN như đã tách, nhưng database vẫn
-- cho phép gán 許可 cho một 買出人 hoặc 承認 cho một 卸売業者. Ràng buộc chỉ
-- tồn tại trong quy ước của dữ liệu mẫu — tức là không tồn tại.
--
-- CHECK thường không dùng được vì party_kind nằm ở bảng khác, nên phải dùng trigger.
-- ---------------------------------------------------------------------------
create or replace function qualification_matches_party_kind()
returns trigger language plpgsql as $$
declare
  v_kind party_kind;
begin
  select kind into v_kind from party where id = new.party_id;

  if v_kind is null then
    raise exception 'Không tìm thấy bên tham gia %.', new.party_id;
  end if;

  -- 許可 (permit) chỉ cấp cho 仲卸
  if new.kind = 'permit' and v_kind <> 'intermediate' then
    raise exception
      'Giấy phép 許可 chỉ cấp cho 仲卸 (đơn vị trung gian), không cấp cho %.', v_kind;
  end if;

  -- 承認 (approval) chỉ cấp cho 売買参加者
  if new.kind = 'approval' and v_kind <> 'participant' then
    raise exception
      'Chấp thuận 承認 chỉ cấp cho 売買参加者 (bên tham gia mua bán), không cấp cho %.', v_kind;
  end if;

  return new;
end $$;

drop trigger if exists qualification_kind_check on party_qualification;
create trigger qualification_kind_check
  before insert or update on party_qualification
  for each row execute function qualification_matches_party_kind();

-- ---------------------------------------------------------------------------
-- LỖI 2 — Giao hàng vượt khối lượng hợp đồng không bị chặn
--
-- FR-DEL-04/05 yêu cầu một giao dịch giao được nhiều lần và hệ thống phải
-- cộng dồn. Schema cũ ghi từng lần giao độc lập, không ai cộng lại, nên giao
-- 500 kg cho một hợp đồng 100 kg vẫn lọt.
--
-- Dòng đảo mang số âm nên khối lượng hợp đồng phải cộng cả dòng gốc và dòng đảo.
-- ---------------------------------------------------------------------------
create or replace function delivery_not_exceed_trade()
returns trigger language plpgsql as $$
declare
  v_contract  numeric(10,2);
  v_delivered numeric(10,2);
  v_day       date;
begin
  -- Khối lượng hợp đồng ròng: dòng gốc cộng mọi dòng đảo trỏ về nó
  select t.business_day,
         t.quantity_kg + coalesce(
           (select sum(r.quantity_kg) from trade r where r.reverses_id = t.id), 0)
    into v_day, v_contract
  from trade t where t.id = new.trade_id;

  if v_contract is null then
    raise exception 'Không tìm thấy giao dịch %.', new.trade_id;
  end if;

  if v_contract <= 0 then
    raise exception 'Giao dịch này đã bị huỷ, không ghi giao hàng được.';
  end if;

  -- Ngày đã khoá sổ thì không ghi thêm giao hàng
  if day_is_locked(v_day) then
    raise exception 'Ngày nghiệp vụ % đã khoá sổ, không ghi thêm giao hàng được.', v_day;
  end if;

  select coalesce(sum(delivered_kg), 0) into v_delivered
  from delivery
  where trade_id = new.trade_id
    and (tg_op = 'INSERT' or id <> new.id);

  if v_delivered + new.delivered_kg > v_contract then
    raise exception
      'Giao vượt hợp đồng: đã giao % kg, lần này % kg, hợp đồng chỉ % kg.',
      v_delivered, new.delivered_kg, v_contract;
  end if;

  return new;
end $$;

drop trigger if exists delivery_quantity_check on delivery;
create trigger delivery_quantity_check
  before insert or update on delivery
  for each row execute function delivery_not_exceed_trade();

-- ---------------------------------------------------------------------------
-- Kiểm nhanh: hai lệnh dưới PHẢI báo lỗi. Bỏ chú thích để thử.
-- ---------------------------------------------------------------------------
-- Gán 許可 cho một 買出人 → phải bị chặn
-- insert into party_qualification (party_id, kind, cert_no, valid_from, valid_to)
-- select id, 'permit', 'SAI-01', current_date, current_date + 365
-- from party where code = 'BY-01';

-- Giao gấp 10 lần hợp đồng → phải bị chặn
-- insert into delivery (trade_id, delivered_kg, status)
-- select id, quantity_kg * 10, 'completed' from trade
-- where reverses_id is null and quantity_kg > 0 limit 1;

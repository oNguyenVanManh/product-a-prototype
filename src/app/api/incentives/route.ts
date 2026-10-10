import { NextResponse } from "next/server";
import { db, audit } from "@/lib/supabase";
import { getSession } from "@/lib/auth";

/** SCR-20 — kết quả tính thưởng thanh toán đúng hạn (完納奨励金). */
export async function GET() {
  if (!(await getSession()))
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });

  const [inc, rates] = await Promise.all([
    db().from("incentive")
      .select("*, party:party_id(code,name,kind)")
      .order("business_day", { ascending: false }),
    db().from("rate_version").select("*").order("effective_from"),
  ]);

  if (inc.error) return NextResponse.json({ error: inc.error.message }, { status: 500 });
  return NextResponse.json({ rows: inc.data, rates: rates.data ?? [] });
}

/**
 * Tính thưởng cho một ngày nghiệp vụ.
 *
 * ĐIỂM MẤU CHỐT CỦA ĐỀ — GOV-RULE-01:
 * Biểu suất phải tra theo NGÀY NGHIỆP VỤ đang tính, không phải biểu suất
 * mới nhất tại thời điểm bấm nút. Nếu lấy bản mới nhất thì mỗi lần ban quản lý
 * đổi biểu suất, toàn bộ kết quả đã chốt của các kỳ trước sẽ đổi theo — sai
 * hoàn toàn về nghiệp vụ và không giải trình được khi kiểm toán.
 *
 * Phiên bản đã dùng được lưu lại vào cột rate_version_no để về sau vẫn
 * tái lập được con số.
 */
export async function POST(req: Request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });

  const { business_day } = await req.json();
  if (!business_day)
    return NextResponse.json({ error: "Thiếu ngày nghiệp vụ" }, { status: 400 });

  // Tra biểu suất CÓ HIỆU LỰC VÀO NGÀY NGHIỆP VỤ, không lấy bản mới nhất
  const { data: rates, error: rErr } = await db()
    .from("rate_version")
    .select("*")
    .lte("effective_from", business_day)
    .order("effective_from", { ascending: false })
    .order("version_no", { ascending: false })
    .limit(1);

  if (rErr) return NextResponse.json({ error: rErr.message }, { status: 500 });
  const rate = rates?.[0];
  if (!rate)
    return NextResponse.json(
      { error: `Chưa có biểu suất nào có hiệu lực vào ngày ${business_day}.` },
      { status: 409 }
    );

  // Số tiền đủ điều kiện = tổng giao dịch đã chốt trong ngày, CÓ TRỪ dòng đảo.
  // Cộng cả số âm nên dòng bị huỷ tự động bị loại khỏi cơ sở tính.
  const { data: trades, error: tErr } = await db()
    .from("trade").select("buyer_id, amount").eq("business_day", business_day);
  if (tErr) return NextResponse.json({ error: tErr.message }, { status: 500 });

  const base = new Map<string, number>();
  for (const t of trades ?? [])
    base.set(t.buyer_id, (base.get(t.buyer_id) ?? 0) + Number(t.amount));

  const { data: pays } = await db()
    .from("payment_status").select("party_id, due_date, paid_date")
    .eq("business_day", business_day);
  const payMap = new Map((pays ?? []).map((p) => [p.party_id, p]));

  const rows = [];
  for (const [partyId, amount] of base) {
    if (amount <= 0) continue; // đã đảo hết thì không tính thưởng

    const p = payMap.get(partyId);
    // Chưa thanh toán hoặc trả sau hạn thì không được thưởng (BR-INC-01)
    const onTime = !!p?.paid_date && p.paid_date <= p.due_date;

    // Làm tròn xuống đơn vị JPY theo BR-INC-01
    const incentive = onTime
      ? Math.floor((amount * Number(rate.rate_pct)) / 100 * Number(rate.tax_factor))
      : 0;

    rows.push({
      party_id: partyId,
      business_day,
      base_amount: Number(amount.toFixed(2)),
      rate_version_no: rate.version_no,   // lưu lại để giải trình về sau
      rate_pct: rate.rate_pct,
      incentive_amt: incentive,
      on_time: onTime,
    });
  }

  if (rows.length === 0)
    return NextResponse.json({ error: `Ngày ${business_day} không có giao dịch để tính.` }, { status: 409 });

  const { error } = await db()
    .from("incentive").upsert(rows, { onConflict: "party_id,business_day" });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await audit(s.id, "CALC_INCENTIVE", "incentive", business_day, {
    business_day, rate_version_no: rate.version_no, rows: rows.length,
  });

  return NextResponse.json({
    ok: true, business_day, rate_used: rate, count: rows.length,
  }, { status: 201 });
}

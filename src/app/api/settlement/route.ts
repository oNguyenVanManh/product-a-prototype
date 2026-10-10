import { NextResponse } from "next/server";
import { db } from "@/lib/supabase";
import { getSession } from "@/lib/auth";

/**
 * SCR-14 — bảng đối soát theo ngày nghiệp vụ.
 *
 * Tổng tiền cộng CẢ dòng đảo (số âm), nên con số hiển thị là số ròng đúng
 * mà không phải xoá dòng nào. Đó chính là điểm lợi của sổ ghi-thêm.
 */
export async function GET() {
  if (!(await getSession()))
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });

  const [days, trades] = await Promise.all([
    db().from("settlement_day").select("*").order("business_day", { ascending: false }),
    db().from("trade").select("business_day, kind, amount, reverses_id"),
  ]);

  if (days.error) return NextResponse.json({ error: days.error.message }, { status: 500 });
  if (trades.error) return NextResponse.json({ error: trades.error.message }, { status: 500 });

  const agg = new Map<string, {
    negotiated_amt: number; auction_amt: number;
    negotiated_cnt: number; auction_cnt: number; reversal_cnt: number;
  }>();

  for (const t of trades.data ?? []) {
    const k = String(t.business_day);
    if (!agg.has(k))
      agg.set(k, { negotiated_amt: 0, auction_amt: 0, negotiated_cnt: 0, auction_cnt: 0, reversal_cnt: 0 });
    const a = agg.get(k)!;
    const amt = Number(t.amount);

    if (t.reverses_id) a.reversal_cnt++;
    if (t.kind === "negotiated") {
      a.negotiated_amt += amt;
      if (!t.reverses_id) a.negotiated_cnt++;
    } else {
      a.auction_amt += amt;
      if (!t.reverses_id) a.auction_cnt++;
    }
  }

  const rows = (days.data ?? []).map((d) => {
    const a = agg.get(String(d.business_day)) ??
      { negotiated_amt: 0, auction_amt: 0, negotiated_cnt: 0, auction_cnt: 0, reversal_cnt: 0 };
    const total = a.negotiated_amt + a.auction_amt;
    return {
      ...d, ...a,
      total_amt: total,
      // Tỷ trọng thỏa thuận — con số cốt lõi của đề, phải nhìn thấy được
      negotiated_share: total > 0 ? (a.negotiated_amt / total) * 100 : 0,
    };
  });

  return NextResponse.json(rows);
}

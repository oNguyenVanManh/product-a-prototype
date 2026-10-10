import { NextResponse } from "next/server";
import { db, audit } from "@/lib/supabase";
import { getSession } from "@/lib/auth";

/**
 * Huỷ giao dịch bằng DÒNG ĐẢO, không sửa dòng cũ.
 *
 * Đây là chỗ sổ ghi-thêm lộ ra rõ nhất. Bảng trade có trigger chặn UPDATE và
 * DELETE ở tầng database, nên cách duy nhất để sửa là thêm một dòng mới mang
 * số âm và trỏ reverses_id về dòng gốc. Dòng gốc ở nguyên tại chỗ mãi mãi,
 * đáp ứng FR-CORR-02 và yêu cầu dấu vết kiểm toán.
 */
export async function POST(req: Request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });

  const { trade_id, reason } = await req.json();
  if (!trade_id) return NextResponse.json({ error: "Thiếu mã giao dịch" }, { status: 400 });

  const { data: t, error: e1 } = await db()
    .from("trade").select("*").eq("id", trade_id).single();
  if (e1 || !t) return NextResponse.json({ error: "Không tìm thấy giao dịch" }, { status: 404 });

  if (t.reverses_id)
    return NextResponse.json({ error: "Đây đã là dòng đảo, không đảo tiếp được." }, { status: 409 });

  const { data: existing } = await db()
    .from("trade").select("id").eq("reverses_id", trade_id).maybeSingle();
  if (existing)
    return NextResponse.json({ error: "Giao dịch này đã được đảo trước đó." }, { status: 409 });

  const { data, error } = await db().from("trade").insert({
    trade_code: `${t.trade_code}-REV`,
    business_day: t.business_day,
    kind: t.kind,
    lot_id: t.lot_id,
    seller_id: t.seller_id,
    buyer_id: t.buyer_id,
    quantity_kg: -Number(t.quantity_kg),
    unit_price: t.unit_price,
    amount: -Number(t.amount),
    reverses_id: t.id,
    created_by: s.id,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 409 });

  // Trả lại khối lượng cho lô
  const { data: lot } = await db()
    .from("lot").select("remaining_kg").eq("id", t.lot_id).single();
  if (lot) {
    await db().from("lot")
      .update({ remaining_kg: Number(lot.remaining_kg) + Number(t.quantity_kg) })
      .eq("id", t.lot_id);
  }

  await audit(s.id, "REVERSE_TRADE", "trade", t.id, { trade_code: t.trade_code, reason });
  return NextResponse.json(data, { status: 201 });
}

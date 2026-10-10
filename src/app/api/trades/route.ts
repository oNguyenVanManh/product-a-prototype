import { NextResponse } from "next/server";
import { db, audit } from "@/lib/supabase";
import { getSession } from "@/lib/auth";

/** SCR-08 — danh sách giao dịch, lọc được theo loại (thỏa thuận / đấu giá). */
export async function GET(req: Request) {
  if (!(await getSession()))
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });

  const kind = new URL(req.url).searchParams.get("kind");
  let q = db()
    .from("trade")
    .select("id, trade_code, business_day, kind, quantity_kg, unit_price, amount, hand_sign, reverses_id, created_at, lot:lot_id(lot_code,species), seller:seller_id(code,name), buyer:buyer_id(code,name)")
    .order("business_day", { ascending: false })
    .order("trade_code")
    .limit(300);

  if (kind === "negotiated" || kind === "auction") q = q.eq("kind", kind);

  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

/**
 * SCR-07 (thỏa thuận) và SCR-09 (đấu giá) — chốt giao dịch.
 *
 * Hai luồng dùng CHUNG một bảng và chỉ khác cột kind, vì cả hai đều là
 * giao dịch có hiệu lực pháp lý như nhau. Giao dịch thỏa thuận là luồng
 * CHÍNH (~90% giá trị theo RFP FIG-009), đấu giá là luồng phụ (~10%).
 *
 * Ba ràng buộc dưới đây do trigger ở Supabase thi hành, không phải do UI:
 *   - ngày đã khoá sổ thì chặn
 *   - bên mua phải còn tư cách giao dịch hợp lệ vào ngày đó
 *   - không UPDATE/DELETE được sau khi ghi
 */
export async function POST(req: Request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });

  const b = await req.json();
  const qty = Number(b.quantity_kg), price = Number(b.unit_price);

  if (!b.lot_id || !b.buyer_id || !qty || !price || qty <= 0 || price <= 0)
    return NextResponse.json({ error: "Thiếu lô, bên mua, khối lượng hoặc đơn giá" }, { status: 400 });

  const kind = b.kind === "auction" ? "auction" : "negotiated";

  const { data: lot, error: lotErr } = await db()
    .from("lot").select("id, lot_code, business_day, remaining_kg, wholesaler_id")
    .eq("id", b.lot_id).single();
  if (lotErr || !lot)
    return NextResponse.json({ error: "Không tìm thấy lô hàng" }, { status: 404 });

  if (qty > Number(lot.remaining_kg))
    return NextResponse.json(
      { error: `Lô ${lot.lot_code} chỉ còn ${lot.remaining_kg} kg, không bán được ${qty} kg.` },
      { status: 409 }
    );

  const { count } = await db()
    .from("trade").select("*", { count: "exact", head: true })
    .eq("business_day", lot.business_day);

  const { data, error } = await db().from("trade").insert({
    trade_code: `TRD-${String(lot.business_day).replaceAll("-", "")}-${String((count ?? 0) + 1).padStart(3, "0")}`,
    business_day: lot.business_day,
    kind,
    lot_id: lot.id,
    seller_id: lot.wholesaler_id,
    buyer_id: b.buyer_id,
    quantity_kg: qty,
    unit_price: price,
    amount: Number((qty * price).toFixed(2)),
    // Ký hiệu tay chỉ có ở đấu giá và do người nhập tay (SCOPE-OUT-02 cấm OCR)
    hand_sign: kind === "auction" ? (b.hand_sign || null) : null,
    created_by: s.id,
  }).select().single();

  // Thông điệp lỗi của trigger được trả nguyên văn để người dùng hiểu vì sao bị chặn
  if (error) return NextResponse.json({ error: error.message }, { status: 409 });

  await db().from("lot")
    .update({ remaining_kg: Number(lot.remaining_kg) - qty, status: "traded" })
    .eq("id", lot.id);

  await audit(s.id, "CREATE_TRADE", "trade", data.id, { trade_code: data.trade_code, kind });
  return NextResponse.json(data, { status: 201 });
}

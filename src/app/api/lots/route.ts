import { NextResponse } from "next/server";
import { db, audit } from "@/lib/supabase";
import { getSession } from "@/lib/auth";

/** SCR-05 — danh sách lô hàng kèm kết quả thẩm định. */
export async function GET() {
  if (!(await getSession()))
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });

  const { data, error } = await db()
    .from("lot")
    .select("id, lot_code, business_day, species, quantity_kg, remaining_kg, status, party:wholesaler_id(code,name), inspection(grade, note, inspected_at)")
    .order("business_day", { ascending: false })
    .order("lot_code")
    .limit(200);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

/** SCR-05 — tiếp nhận lô mới. Ghi THẬT vào Supabase. */
export async function POST(req: Request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });

  const b = await req.json();
  const qty = Number(b.quantity_kg);
  if (!b.species || !qty || qty <= 0)
    return NextResponse.json({ error: "Thiếu loài hoặc khối lượng không hợp lệ" }, { status: 400 });

  const day = b.business_day ?? new Date().toISOString().slice(0, 10);

  // Ngày đã khoá sổ thì không nhận lô mới
  const { data: sd } = await db()
    .from("settlement_day").select("is_locked").eq("business_day", day).maybeSingle();
  if (sd?.is_locked)
    return NextResponse.json({ error: `Ngày ${day} đã khoá sổ, không tiếp nhận lô mới được.` }, { status: 409 });

  const { count } = await db()
    .from("lot").select("*", { count: "exact", head: true }).eq("business_day", day);

  const { data, error } = await db().from("lot").insert({
    lot_code: `LOT-${day.replaceAll("-", "")}-${String((count ?? 0) + 1).padStart(2, "0")}`,
    business_day: day,
    species: b.species,
    quantity_kg: qty,
    remaining_kg: qty,
    wholesaler_id: b.wholesaler_id,
    status: "received",
    created_by: s.id,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  await audit(s.id, "CREATE_LOT", "lot", data.id, { lot_code: data.lot_code });
  return NextResponse.json(data, { status: 201 });
}

import { NextResponse } from "next/server";
import { db, audit } from "@/lib/supabase";
import { getSession } from "@/lib/auth";

/** SCR-11 — bảng theo dõi giao hàng. Một giao dịch giao được nhiều lần. */
export async function GET() {
  if (!(await getSession()))
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });

  const { data, error } = await db()
    .from("delivery")
    .select("id, delivered_kg, status, exception_reason, delivered_at, trade:trade_id(trade_code, quantity_kg, business_day, kind, buyer:buyer_id(code,name))")
    .order("delivered_at", { ascending: false })
    .limit(300);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

/** SCR-12 — ghi nhận một lần giao hàng. */
export async function POST(req: Request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });

  const { trade_id, delivered_kg, status, exception_reason } = await req.json();
  const kg = Number(delivered_kg);
  if (!trade_id || !kg || kg <= 0)
    return NextResponse.json({ error: "Thiếu giao dịch hoặc khối lượng" }, { status: 400 });

  if (status === "exception" && !exception_reason)
    return NextResponse.json({ error: "Ngoại lệ phải có lý do" }, { status: 400 });

  const { data, error } = await db().from("delivery").insert({
    trade_id,
    delivered_kg: kg,
    status: status ?? "completed",
    exception_reason: exception_reason ?? null,
    created_by: s.id,
  }).select().single();

  // Trigger delivery_quantity_check chặn khi giao vượt hợp đồng, khi giao dịch
  // đã bị đảo, hoặc khi ngày đã khoá sổ. Trả nguyên văn để người dùng hiểu lý do.
  if (error) return NextResponse.json({ error: error.message }, { status: 409 });
  await audit(s.id, "CREATE_DELIVERY", "delivery", data.id, { trade_id, kg });
  return NextResponse.json(data, { status: 201 });
}

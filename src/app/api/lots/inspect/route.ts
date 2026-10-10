import { NextResponse } from "next/server";
import { db, audit } from "@/lib/supabase";
import { getSession } from "@/lib/auth";

/**
 * SCR-06 — ghi kết quả thẩm định.
 *
 * CAP-HUMAN-01: hạng do NGƯỜI chọn, hệ thống chỉ lưu lại kèm tên người thẩm định.
 * Không có phép tính nào suy ra hạng — SCOPE-OUT-01 cấm tự động chấm chất lượng.
 */
export async function POST(req: Request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });

  const { lot_id, grade, note } = await req.json();
  if (!lot_id || !["A", "B", "C"].includes(grade))
    return NextResponse.json({ error: "Thiếu lô hoặc hạng không hợp lệ" }, { status: 400 });

  const { data, error } = await db().from("inspection").insert({
    lot_id, grade, note: note ?? null, inspected_by: s.id,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await db().from("lot").update({ status: "inspected" }).eq("id", lot_id);
  await audit(s.id, "INSPECT_LOT", "lot", lot_id, { grade });
  return NextResponse.json(data, { status: 201 });
}

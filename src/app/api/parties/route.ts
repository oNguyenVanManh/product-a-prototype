import { NextResponse } from "next/server";
import { db } from "@/lib/supabase";
import { getSession } from "@/lib/auth";

/** SCR-03 — bên tham gia kèm tư cách giao dịch (hai cấp pháp lý tách riêng). */
export async function GET() {
  if (!(await getSession()))
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });

  const { data, error } = await db()
    .from("party")
    .select("id, code, name, kind, phone, is_active, party_qualification(kind, cert_no, valid_from, valid_to, suspended)")
    .order("code");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

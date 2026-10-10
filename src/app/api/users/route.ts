import { NextResponse } from "next/server";
import { db, audit } from "@/lib/supabase";
import { getSession } from "@/lib/auth";

/** SCR-02 — quản lý tài khoản và quyền. */
export async function GET() {
  if (!(await getSession()))
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });

  const { data, error } = await db()
    .from("app_user").select("id, email, full_name, role, is_active, created_at")
    .order("role");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

/** Bật/tắt tài khoản — thao tác nhạy cảm, chỉ quản trị và có ghi nhật ký. */
export async function PATCH(req: Request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });

  if (s.role !== "ROLE_SYS_ADMIN")
    return NextResponse.json({ error: "Chỉ quản trị hệ thống mới đổi được trạng thái tài khoản." }, { status: 403 });

  const { id, is_active } = await req.json();
  if (!id) return NextResponse.json({ error: "Thiếu mã tài khoản" }, { status: 400 });

  if (id === s.id)
    return NextResponse.json({ error: "Không tự tắt tài khoản của chính mình được." }, { status: 409 });

  const { data, error } = await db()
    .from("app_user").update({ is_active: !!is_active }).eq("id", id).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  await audit(s.id, is_active ? "ENABLE_USER" : "DISABLE_USER", "app_user", id, { email: data.email });
  return NextResponse.json(data);
}

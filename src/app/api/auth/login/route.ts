import { NextResponse } from "next/server";
import { login, setSession } from "@/lib/auth";
import { audit } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const session = await login(email ?? "", password ?? "");

    if (!session) {
      return NextResponse.json(
        { error: "Email hoặc mật khẩu không đúng" },
        { status: 401 }
      );
    }

    await setSession(session);
    await audit(session.id, "LOGIN", "app_user", session.id, { email: session.email });
    return NextResponse.json({ ok: true, user: session });
  } catch (e) {
    // Thường gặp nhất: chưa điền NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY
    // trong .env.local. Trả JSON để trang login hiện được lý do, thay vì để Next
    // ném ra trang lỗi HTML làm fetch nghẹn.
    const msg = e instanceof Error ? e.message : "Lỗi không xác định";
    console.error("[login]", msg);
    return NextResponse.json({ error: `Không kết nối được hệ thống: ${msg}` }, { status: 500 });
  }
}

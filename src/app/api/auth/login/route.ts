import { NextResponse } from "next/server";
import { login, setSession } from "@/lib/auth";
import { audit } from "@/lib/supabase";

export async function POST(req: Request) {
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
}

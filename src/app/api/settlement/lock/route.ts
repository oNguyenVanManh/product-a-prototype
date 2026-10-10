import { NextResponse } from "next/server";
import { db, audit } from "@/lib/supabase";
import { getSession } from "@/lib/auth";

/**
 * SCR-15 — khoá ngày nghiệp vụ.
 *
 * Khoá xong thì trigger ở Supabase chặn mọi INSERT giao dịch vào ngày đó.
 * Chỉ vai trò đối soát được thao tác (BR-CLOSE-01).
 */
export async function POST(req: Request) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });

  if (s.role !== "ROLE_SETTLEMENT" && s.role !== "ROLE_SYS_ADMIN")
    return NextResponse.json(
      { error: "Chỉ bộ phận đối soát hoặc quản trị mới được khoá sổ." },
      { status: 403 }
    );

  const { business_day, lock } = await req.json();
  if (!business_day)
    return NextResponse.json({ error: "Thiếu ngày nghiệp vụ" }, { status: 400 });

  const willLock = lock !== false;

  const { data, error } = await db().from("settlement_day").upsert({
    business_day,
    is_locked: willLock,
    locked_at: willLock ? new Date().toISOString() : null,
    locked_by: willLock ? s.id : null,
  }, { onConflict: "business_day" }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await audit(s.id, willLock ? "LOCK_SETTLEMENT_DAY" : "UNLOCK_SETTLEMENT_DAY",
              "settlement_day", String(business_day), { business_day });
  return NextResponse.json(data);
}

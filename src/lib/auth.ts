import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";
import { db } from "./supabase";

/**
 * Đăng nhập cho prototype.
 *
 * Đề bài LAB-3 yêu cầu có bước đăng nhập trước khi vào app, cơ chế tự chọn,
 * miễn là người lạ mở URL không xem được nội dung bên trong.
 *
 * Ở đây dùng cookie có chữ ký HMAC thay vì Supabase Auth, vì danh sách người
 * dùng nội bộ đã nằm sẵn ở bảng app_user với 6 vai trò nghiệp vụ, và prototype
 * cần đổi vai trò nhanh để minh hoạ phân quyền. Mật khẩu dùng chung một chuỗi
 * demo lấy từ biến môi trường — đây là phần MOCK, bản thật phải dùng
 * Supabase Auth hoặc OIDC của khách (xem feature-list.md).
 */

const COOKIE = "pa_session";
const MAX_AGE = 60 * 60 * 8; // 8 tiếng, xấp xỉ một ca chợ

export type Session = {
  id: string;
  email: string;
  name: string;
  role: string;
};

function secret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error("Thiếu SESSION_SECRET trong .env.local");
  return s;
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

function verify(payload: string, sig: string): boolean {
  const expected = Buffer.from(sign(payload));
  const given = Buffer.from(sig);
  // So sánh theo thời gian hằng định để không rò rỉ thông tin qua thời gian phản hồi
  return expected.length === given.length && timingSafeEqual(expected, given);
}

/** Kiểm tra email + mật khẩu demo, trả về phiên nếu hợp lệ. */
export async function login(
  email: string,
  password: string
): Promise<Session | null> {
  const demoPassword = process.env.DEMO_PASSWORD;
  if (!demoPassword || password !== demoPassword) return null;

  const { data, error } = await db()
    .from("app_user")
    .select("id, email, full_name, role, is_active")
    .eq("email", email.trim().toLowerCase())
    .maybeSingle();

  if (error || !data || !data.is_active) return null;

  return {
    id: data.id,
    email: data.email,
    name: data.full_name,
    role: data.role,
  };
}

export async function setSession(s: Session) {
  const payload = Buffer.from(JSON.stringify(s)).toString("base64url");
  const jar = await cookies();
  jar.set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearSession() {
  (await cookies()).delete(COOKIE);
}

/** Đọc phiên hiện tại. Trả null nếu không có hoặc chữ ký sai. */
export async function getSession(): Promise<Session | null> {
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return null;

  const dot = raw.lastIndexOf(".");
  if (dot < 0) return null;

  const payload = raw.slice(0, dot);
  const sig = raw.slice(dot + 1);

  try {
    if (!verify(payload, sig)) return null;
    return JSON.parse(Buffer.from(payload, "base64url").toString()) as Session;
  } catch {
    return null;
  }
}

/** Dùng ở API route: trả phiên hoặc ném lỗi 401. */
export async function requireSession(): Promise<Session> {
  const s = await getSession();
  if (!s) throw new Response("Chưa đăng nhập", { status: 401 });
  return s;
}

import { NextResponse, type NextRequest } from "next/server";

/**
 * Chặn người lạ ở cổng vào.
 *
 * Hàm proxy chạy trên Edge runtime nên không dùng được module crypto của Node,
 * vì vậy ở đây chỉ kiểm tra CÓ cookie phiên hay không. Việc xác minh chữ ký
 * HMAC thật sự nằm ở getSession() trong src/lib/auth.ts, được gọi lại ở từng
 * trang và từng API route. Hai lớp này cộng lại thì cookie giả không qua được.
 */
export default function proxy(req: NextRequest) {
  const hasSession = req.cookies.has("pa_session");
  const { pathname } = req.nextUrl;

  const isPublic =
    pathname === "/login" ||
    pathname.startsWith("/api/auth/") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico";

  if (isPublic) {
    // Đã đăng nhập rồi thì không cần ở lại trang login
    if (pathname === "/login" && hasSession) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  if (!hasSession) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }
    const url = new URL("/login", req.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

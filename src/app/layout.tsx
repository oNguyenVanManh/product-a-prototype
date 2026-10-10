import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import Nav from "@/components/nav";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Chợ Thủy sản Vịnh Sakura — Hệ thống hỗ trợ vận hành",
  description: "Prototype LAB-3 · Product A · 産地市場 bán buôn thủy sản",
};

/**
 * Thanh điều hướng đọc phiên ở tầng server.
 *
 * Tách riêng và bọc Suspense vì Next.js 16 bật Cache Components: gọi thẳng
 * cookies() trong layout sẽ chặn prerender của cả những trang tĩnh như 404.
 */
async function SessionNav() {
  const session = await getSession();
  if (!session) return null;
  return <Nav name={session.name} role={session.role} />;
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <Suspense fallback={<div className="h-[89px] border-b border-slate-200 bg-white" />}>
          <SessionNav />
        </Suspense>
        <main className="mx-auto max-w-7xl px-5 py-6">{children}</main>
      </body>
    </html>
  );
}

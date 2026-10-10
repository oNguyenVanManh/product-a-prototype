"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

/** Điều hướng giữa 10 màn hình, nhóm theo đúng feature list của LAB-1. */
const LINKS = [
  { href: "/", label: "Tổng quan", group: "" },
  { href: "/parties", label: "Bên tham gia", group: "FEA-01" },
  { href: "/lots", label: "Lô hàng & thẩm định", group: "FEA-03" },
  { href: "/trades", label: "Giao dịch", group: "FEA-04" },
  { href: "/deliveries", label: "Giao hàng", group: "FEA-05" },
  { href: "/settlement", label: "Đối soát & chốt sổ", group: "FEA-06" },
  { href: "/incentives", label: "Tiền khuyến khích", group: "FEA-07" },
  { href: "/users", label: "Tài khoản & quyền", group: "FEA-02" },
];

export default function Nav({ name, role }: { name: string; role: string }) {
  const path = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-slate-900">桜水産市場</span>
          <span className="hidden text-sm text-slate-500 sm:inline">
            Hệ thống hỗ trợ vận hành chợ bán buôn thủy sản
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-slate-600">
            {name} · <span className="text-slate-400">{role}</span>
          </span>
          <button
            onClick={logout}
            className="rounded-md border border-slate-300 px-2.5 py-1 text-slate-700 hover:bg-slate-50"
          >
            Đăng xuất
          </button>
        </div>
      </div>

      <nav className="mx-auto max-w-7xl overflow-x-auto px-5">
        <ul className="flex gap-1 whitespace-nowrap">
          {LINKS.map((l) => {
            const active = path === l.href;
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`block border-b-2 px-3 py-2 text-sm transition ${
                    active
                      ? "border-slate-900 font-medium text-slate-900"
                      : "border-transparent text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {l.label}
                  {l.group && (
                    <span className="ml-1.5 text-[10px] text-slate-400">{l.group}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}

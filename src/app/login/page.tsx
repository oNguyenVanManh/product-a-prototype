"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Field, inputCls, Notice } from "@/components/ui";

const DEMO = [
  { email: "admin@sakura-market.example",      role: "Quản trị hệ thống" },
  { email: "intake@sakura-market.example",     role: "Tiếp nhận lô" },
  { email: "judge@sakura-market.example",      role: "Thẩm định" },
  { email: "trade@sakura-market.example",      role: "Chốt giao dịch" },
  { email: "delivery@sakura-market.example",   role: "Giao hàng" },
  { email: "settlement@sakura-market.example", role: "Đối soát" },
];

function LoginForm() {
  const router = useRouter();
  const next = useSearchParams().get("next") ?? "/";
  const [email, setEmail] = useState(DEMO[0].email);
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const r = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const j = await r.json();
    setBusy(false);
    if (!r.ok) return setErr(j.error ?? "Đăng nhập không thành công");
    router.push(next);
    router.refresh();
  }

  return (
    <div className="mx-auto mt-16 max-w-md">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold">桜水産市場</h1>
        <p className="mt-1 text-sm text-slate-600">
          Hệ thống hỗ trợ vận hành chợ bán buôn thủy sản
        </p>
      </div>

      <form
        onSubmit={submit}
        className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
      >
        <Notice kind="error" text={err} />

        <div className="space-y-4">
          <Field label="Tài khoản">
            <select
              className={inputCls}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            >
              {DEMO.map((d) => (
                <option key={d.email} value={d.email}>
                  {d.role} — {d.email}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Mật khẩu">
            <input
              type="password"
              className={inputCls}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Xem README.md"
              autoFocus
            />
          </Field>
        </div>

        <div className="mt-5">
          <Button type="submit" disabled={busy}>
            {busy ? "Đang kiểm tra…" : "Đăng nhập"}
          </Button>
        </div>
      </form>

      <p className="mt-4 text-center text-xs text-slate-500">
        Prototype LAB-3. Dữ liệu trong hệ thống là số liệu giả lập.
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

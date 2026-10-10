"use client";

import { useEffect, useState, type ReactNode } from "react";

/** Bộ phận giao diện dùng chung, gom một chỗ để các trang khỏi lặp lại. */

export function Card({
  title,
  subtitle,
  right,
  children,
}: {
  title?: string;
  subtitle?: string;
  right?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
      {(title || right) && (
        <header className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-3">
          <div>
            {title && <h2 className="font-semibold text-slate-800">{title}</h2>}
            {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
          </div>
          {right}
        </header>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

export function Stat({
  label,
  value,
  hint,
  tone = "slate",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "slate" | "blue" | "amber" | "green";
}) {
  const tones = {
    slate: "border-slate-200 bg-white",
    blue: "border-blue-200 bg-blue-50",
    amber: "border-amber-200 bg-amber-50",
    green: "border-emerald-200 bg-emerald-50",
  };
  return (
    <div className={`rounded-lg border p-4 ${tones[tone]}`}>
      <div className="text-sm text-slate-600">{label}</div>
      <div className="mt-1 text-2xl font-semibold tabular-nums text-slate-900">{value}</div>
      {hint && <div className="mt-1 text-xs text-slate-500">{hint}</div>}
    </div>
  );
}

export function Badge({
  children,
  tone = "slate",
}: {
  children: ReactNode;
  tone?: "slate" | "blue" | "amber" | "green" | "red";
}) {
  const tones = {
    slate: "bg-slate-100 text-slate-700",
    blue: "bg-blue-100 text-blue-800",
    amber: "bg-amber-100 text-amber-800",
    green: "bg-emerald-100 text-emerald-800",
    red: "bg-red-100 text-red-800",
  };
  return (
    <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "ghost" | "danger";
  disabled?: boolean;
}) {
  const v = {
    primary: "bg-slate-900 text-white hover:bg-slate-700",
    ghost: "border border-slate-300 text-slate-700 hover:bg-slate-50",
    danger: "border border-red-300 text-red-700 hover:bg-red-50",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-md px-3 py-1.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${v[variant]}`}
    >
      {children}
    </button>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}

export const inputCls =
  "w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-slate-900";

export function Table({
  head,
  children,
}: {
  head: string[];
  children: ReactNode;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
            {head.map((h) => (
              <th key={h} className="px-3 py-2 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">{children}</tbody>
      </table>
    </div>
  );
}

export function Notice({ kind, text }: { kind: "error" | "ok"; text: string }) {
  if (!text) return null;
  return (
    <div
      className={`mb-4 rounded-md border px-3 py-2 text-sm ${
        kind === "error"
          ? "border-red-200 bg-red-50 text-red-800"
          : "border-emerald-200 bg-emerald-50 text-emerald-800"
      }`}
    >
      {text}
    </div>
  );
}

/**
 * Tải dữ liệu từ API route. Trả về kèm hàm nạp lại để sau khi ghi thì làm mới.
 *
 * Cờ pending chỉ được bật ở giá trị khởi tạo và trong hàm reload (tức trong
 * trình xử lý sự kiện), không bật đồng bộ trong thân effect — gọi setState
 * đồng bộ ở đó sẽ sinh chuỗi render thừa.
 */
export function useApi<T>(url: string) {
  const [state, setState] = useState<{ data: T | null; error: string }>({
    data: null,
    error: "",
  });
  const [pending, setPending] = useState(true);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let alive = true;

    fetch(url)
      .then(async (r) => {
        const j = await r.json();
        if (!r.ok) throw new Error(j.error ?? "Lỗi tải dữ liệu");
        return j as T;
      })
      .then((j) => alive && setState({ data: j, error: "" }))
      .catch((e: Error) => alive && setState({ data: null, error: e.message }))
      .finally(() => alive && setPending(false));

    return () => {
      alive = false;
    };
  }, [url, tick]);

  return {
    data: state.data,
    error: state.error,
    loading: pending,
    reload: () => {
      setPending(true);
      setTick((t) => t + 1);
    },
  };
}

export const yen = (n: number) =>
  new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY", maximumFractionDigits: 0 })
    .format(n);

export const kg = (n: number) => `${Number(n).toLocaleString("vi-VN")} kg`;

"use client";

import { useState } from "react";
import {
  Card, Table, Badge, Button, Field, inputCls, Notice, useApi, kg,
} from "@/components/ui";

type D = {
  id: string; delivered_kg: number; status: string;
  exception_reason: string | null; delivered_at: string;
  trade: { trade_code: string; quantity_kg: number; business_day: string; kind: string;
           buyer: { code: string; name: string } | null } | null;
};
type T = { id: string; trade_code: string; quantity_kg: number; reverses_id: string | null };

export default function DeliveriesPage() {
  const deliveries = useApi<D[]>("/api/deliveries");
  const trades = useApi<T[]>("/api/trades");
  const [msg, setMsg] = useState({ kind: "ok" as "ok" | "error", text: "" });
  const [form, setForm] = useState({
    trade_id: "", delivered_kg: "", status: "completed", exception_reason: "",
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const r = await fetch("/api/deliveries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const j = await r.json();
    if (!r.ok) return setMsg({ kind: "error", text: j.error });
    setMsg({ kind: "ok", text: "Đã ghi nhận lần giao hàng." });
    setForm({ ...form, delivered_kg: "", exception_reason: "" });
    deliveries.reload();
  }

  const rows = deliveries.data ?? [];
  const openTrades = (trades.data ?? []).filter((t) => !t.reverses_id && t.quantity_kg > 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Theo dõi giao hàng</h1>
        <p className="mt-1 text-sm text-slate-600">SCR-11 bảng theo dõi · SCR-12 ghi nhận · FEA-05</p>
      </div>

      <Notice kind={msg.kind} text={msg.text} />

      <Card
        title="Ghi nhận một lần giao"
        subtitle="Một giao dịch giao được nhiều lần — hệ thống cộng dồn, không ghi đè"
      >
        <form onSubmit={submit} className="grid gap-4 md:grid-cols-4">
          <Field label="Giao dịch">
            <select
              className={inputCls} value={form.trade_id}
              onChange={(e) => setForm({ ...form, trade_id: e.target.value })}
            >
              <option value="">— chọn —</option>
              {openTrades.slice(0, 100).map((t) => (
                <option key={t.id} value={t.id}>{t.trade_code} · {t.quantity_kg} kg</option>
              ))}
            </select>
          </Field>
          <Field label="Khối lượng giao (kg)">
            <input
              className={inputCls} type="number" step="0.01" min="0.01" value={form.delivered_kg}
              onChange={(e) => setForm({ ...form, delivered_kg: e.target.value })}
            />
          </Field>
          <Field label="Kết quả">
            <select
              className={inputCls} value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="completed">Giao đủ</option>
              <option value="partial">Giao thiếu</option>
              <option value="exception">Ngoại lệ</option>
            </select>
          </Field>
          <Field label="Lý do (bắt buộc khi ngoại lệ)">
            <input
              className={inputCls} value={form.exception_reason}
              onChange={(e) => setForm({ ...form, exception_reason: e.target.value })}
            />
          </Field>
          <div className="md:col-span-4">
            <Button type="submit">Ghi nhận</Button>
          </div>
        </form>
      </Card>

      <Card title={`Lịch sử giao hàng (${rows.length})`}>
        <Table head={["Giao dịch", "Ngày GD", "Bên mua", "Đã giao", "Trên hợp đồng", "Kết quả", "Lý do"]}>
          {rows.map((d) => (
            <tr key={d.id} className="hover:bg-slate-50">
              <td className="px-3 py-2 font-medium">{d.trade?.trade_code}</td>
              <td className="px-3 py-2">{d.trade?.business_day}</td>
              <td className="px-3 py-2">{d.trade?.buyer?.name}</td>
              <td className="px-3 py-2 tabular-nums">{kg(d.delivered_kg)}</td>
              <td className="px-3 py-2 tabular-nums text-slate-500">
                {d.trade ? kg(d.trade.quantity_kg) : "—"}
              </td>
              <td className="px-3 py-2">
                {d.status === "completed" ? <Badge tone="green">Đủ</Badge>
                  : d.status === "partial" ? <Badge tone="amber">Thiếu</Badge>
                  : <Badge tone="red">Ngoại lệ</Badge>}
              </td>
              <td className="px-3 py-2 text-slate-600">{d.exception_reason ?? "—"}</td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}

"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Card, Table, Badge, Button, Field, inputCls, Notice, useApi, yen, kg,
} from "@/components/ui";

type Trade = {
  id: string; trade_code: string; business_day: string;
  kind: "negotiated" | "auction";
  quantity_kg: number; unit_price: number; amount: number;
  hand_sign: string | null; reverses_id: string | null;
  lot: { lot_code: string; species: string } | null;
  seller: { code: string; name: string } | null;
  buyer: { code: string; name: string } | null;
};
type Lot = { id: string; lot_code: string; species: string; remaining_kg: number; business_day: string };
type Party = { id: string; code: string; name: string; kind: string };

function TradesPage() {
  const initialKind = useSearchParams().get("kind") ?? "";
  const [kind, setKind] = useState(initialKind);
  const [msg, setMsg] = useState({ kind: "ok" as "ok" | "error", text: "" });

  const trades = useApi<Trade[]>(`/api/trades${kind ? `?kind=${kind}` : ""}`);
  const lots = useApi<Lot[]>("/api/lots");
  const parties = useApi<Party[]>("/api/parties");

  const [form, setForm] = useState({
    lot_id: "", buyer_id: "", quantity_kg: "", unit_price: "",
    kind: "negotiated", hand_sign: "",
  });

  // Chỉ 仲卸 và 売買参加者 có tư cách mua trực tiếp. 買出人 phải mua qua trung gian.
  const buyers = (parties.data ?? []).filter(
    (p) => p.kind === "intermediate" || p.kind === "participant"
  );
  const openLots = (lots.data ?? []).filter((l) => Number(l.remaining_kg) > 0);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg({ kind: "ok", text: "" });
    const r = await fetch("/api/trades", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const j = await r.json();
    if (!r.ok) return setMsg({ kind: "error", text: j.error });
    setMsg({ kind: "ok", text: `Đã chốt giao dịch ${j.trade_code}.` });
    setForm({ ...form, quantity_kg: "", unit_price: "", hand_sign: "" });
    trades.reload();
    lots.reload();
  }

  async function reverse(t: Trade) {
    const reason = prompt(`Lý do huỷ giao dịch ${t.trade_code}?`);
    if (!reason) return;
    const r = await fetch("/api/trades/reverse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trade_id: t.id, reason }),
    });
    const j = await r.json();
    if (!r.ok) return setMsg({ kind: "error", text: j.error });
    setMsg({
      kind: "ok",
      text: `Đã ghi dòng đảo ${j.trade_code}. Giao dịch gốc vẫn còn nguyên trong sổ.`,
    });
    trades.reload();
    lots.reload();
  }

  const rows = trades.data ?? [];
  const reversedIds = new Set(rows.filter((r) => r.reverses_id).map((r) => r.reverses_id!));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Giao dịch</h1>
        <p className="mt-1 text-sm text-slate-600">
          SCR-07 chốt thỏa thuận · SCR-08 danh sách · SCR-09 ghi kết quả đấu giá
        </p>
      </div>

      <Notice kind={msg.kind} text={msg.text} />

      <Card
        title="Chốt giao dịch mới"
        subtitle="Hai luồng dùng chung một sổ. Thỏa thuận là luồng chính, đấu giá là luồng phụ."
      >
        <form onSubmit={submit} className="grid gap-4 md:grid-cols-3">
          <Field label="Loại giao dịch">
            <select
              className={inputCls}
              value={form.kind}
              onChange={(e) => setForm({ ...form, kind: e.target.value })}
            >
              <option value="negotiated">相対取引 — Thỏa thuận trực tiếp</option>
              <option value="auction">せり — Phiên đấu giá</option>
            </select>
          </Field>

          <Field label="Lô hàng">
            <select
              className={inputCls}
              value={form.lot_id}
              onChange={(e) => setForm({ ...form, lot_id: e.target.value })}
            >
              <option value="">— chọn lô còn hàng —</option>
              {openLots.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.lot_code} · {l.species} · còn {l.remaining_kg} kg
                </option>
              ))}
            </select>
          </Field>

          <Field label="Bên mua">
            <select
              className={inputCls}
              value={form.buyer_id}
              onChange={(e) => setForm({ ...form, buyer_id: e.target.value })}
            >
              <option value="">— chọn bên có tư cách —</option>
              {buyers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.code} · {p.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Khối lượng (kg)">
            <input
              className={inputCls} type="number" step="0.01" min="0.01"
              value={form.quantity_kg}
              onChange={(e) => setForm({ ...form, quantity_kg: e.target.value })}
            />
          </Field>

          <Field label="Đơn giá (JPY/kg)">
            <input
              className={inputCls} type="number" step="0.01" min="0.01"
              value={form.unit_price}
              onChange={(e) => setForm({ ...form, unit_price: e.target.value })}
            />
          </Field>

          {form.kind === "auction" && (
            <Field label="Ký hiệu tay (nhân viên nhập tay)">
              <input
                className={inputCls}
                value={form.hand_sign}
                placeholder="ví dụ ヤリ"
                onChange={(e) => setForm({ ...form, hand_sign: e.target.value })}
              />
            </Field>
          )}

          <div className="md:col-span-3">
            <Button type="submit">Chốt giao dịch</Button>
            <span className="ml-3 text-xs text-slate-500">
              Hệ thống sẽ chặn nếu ngày đã khoá sổ, bên mua hết tư cách, hoặc lô không đủ hàng.
            </span>
          </div>
        </form>
      </Card>

      <Card
        title={`Sổ giao dịch (${rows.length})`}
        subtitle="Sổ ghi-thêm: huỷ giao dịch tạo dòng đảo mới, dòng gốc không bị xoá"
        right={
          <select
            className={inputCls + " w-auto"}
            value={kind}
            onChange={(e) => setKind(e.target.value)}
          >
            <option value="">Tất cả</option>
            <option value="negotiated">Chỉ thỏa thuận</option>
            <option value="auction">Chỉ đấu giá</option>
          </select>
        }
      >
        <Table head={["Mã", "Ngày", "Loại", "Lô", "Bên mua", "Khối lượng", "Thành tiền", ""]}>
          {rows.map((t) => {
            const isRev = !!t.reverses_id;
            const wasReversed = reversedIds.has(t.id);
            return (
              <tr
                key={t.id}
                className={isRev ? "bg-red-50/50" : wasReversed ? "text-slate-400 line-through" : "hover:bg-slate-50"}
              >
                <td className="px-3 py-2 font-medium">{t.trade_code}</td>
                <td className="px-3 py-2">{t.business_day}</td>
                <td className="px-3 py-2">
                  {t.kind === "negotiated"
                    ? <Badge tone="blue">相対</Badge>
                    : <Badge tone="amber">せり {t.hand_sign ?? ""}</Badge>}
                  {isRev && <span className="ml-1"><Badge tone="red">đảo</Badge></span>}
                </td>
                <td className="px-3 py-2">{t.lot?.lot_code} · {t.lot?.species}</td>
                <td className="px-3 py-2">{t.buyer?.name}</td>
                <td className="px-3 py-2 tabular-nums">{kg(t.quantity_kg)}</td>
                <td className="px-3 py-2 tabular-nums">{yen(t.amount)}</td>
                <td className="px-3 py-2">
                  {!isRev && !wasReversed && (
                    <Button variant="danger" onClick={() => reverse(t)}>Huỷ</Button>
                  )}
                </td>
              </tr>
            );
          })}
        </Table>
      </Card>
    </div>
  );
}

export default function Page() {
  return <Suspense><TradesPage /></Suspense>;
}

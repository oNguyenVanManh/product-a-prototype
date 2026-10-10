"use client";

import { useState } from "react";
import {
  Card, Table, Badge, Button, Field, inputCls, Notice, useApi, kg,
} from "@/components/ui";

type Lot = {
  id: string; lot_code: string; business_day: string; species: string;
  quantity_kg: number; remaining_kg: number; status: string;
  party: { code: string; name: string } | null;
  inspection: { grade: string; note: string | null; inspected_at: string }[];
};
type Party = { id: string; code: string; name: string; kind: string };

export default function LotsPage() {
  const lots = useApi<Lot[]>("/api/lots");
  const parties = useApi<Party[]>("/api/parties");
  const [msg, setMsg] = useState({ kind: "ok" as "ok" | "error", text: "" });
  const [form, setForm] = useState({ species: "", quantity_kg: "", wholesaler_id: "" });

  const wholesalers = (parties.data ?? []).filter((p) => p.kind === "wholesaler");

  async function addLot(e: React.FormEvent) {
    e.preventDefault();
    const r = await fetch("/api/lots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const j = await r.json();
    if (!r.ok) return setMsg({ kind: "error", text: j.error });
    setMsg({ kind: "ok", text: `Đã tiếp nhận lô ${j.lot_code}.` });
    setForm({ ...form, species: "", quantity_kg: "" });
    lots.reload();
  }

  async function inspect(lot: Lot, grade: string) {
    const r = await fetch("/api/lots/inspect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lot_id: lot.id, grade, note: "Thẩm định bằng mắt tại bến." }),
    });
    const j = await r.json();
    if (!r.ok) return setMsg({ kind: "error", text: j.error });
    setMsg({ kind: "ok", text: `Đã ghi hạng ${grade} cho lô ${lot.lot_code}.` });
    lots.reload();
  }

  const rows = lots.data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Lô hàng và thẩm định</h1>
        <p className="mt-1 text-sm text-slate-600">SCR-05 tiếp nhận · SCR-06 ghi kết quả thẩm định</p>
      </div>

      <Notice kind={msg.kind} text={msg.text} />

      <Card
        title="Thẩm định do người làm, hệ thống chỉ ghi lại"
        subtitle="Tài liệu khách hàng loại việc tự động chấm chất lượng ra khỏi phạm vi"
      >
        <p className="text-sm leading-relaxed text-slate-700">
          Độ tươi được đánh giá bằng mắt tại bến. Hệ thống không có bất kỳ phép tính nào suy ra
          hạng — chỉ lưu hạng do người thẩm định chọn, kèm tên người đó và thời điểm. Đây là ràng
          buộc nghiệp vụ, không phải giới hạn kỹ thuật: giữ con người trong vòng lặp là yêu cầu
          của khách.
        </p>
      </Card>

      <Card title="Tiếp nhận lô mới">
        <form onSubmit={addLot} className="grid gap-4 md:grid-cols-4">
          <Field label="Đơn vị bán buôn">
            <select
              className={inputCls} value={form.wholesaler_id}
              onChange={(e) => setForm({ ...form, wholesaler_id: e.target.value })}
            >
              <option value="">— chọn —</option>
              {wholesalers.map((p) => (
                <option key={p.id} value={p.id}>{p.code} · {p.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Loài thủy sản">
            <input
              className={inputCls} value={form.species} placeholder="ví dụ Cá ngừ vây vàng"
              onChange={(e) => setForm({ ...form, species: e.target.value })}
            />
          </Field>
          <Field label="Khối lượng (kg)">
            <input
              className={inputCls} type="number" step="0.01" min="0.01" value={form.quantity_kg}
              onChange={(e) => setForm({ ...form, quantity_kg: e.target.value })}
            />
          </Field>
          <div className="flex items-end">
            <Button type="submit">Tiếp nhận</Button>
          </div>
        </form>
      </Card>

      <Card title={`Lô hàng (${rows.length})`}>
        <Table head={["Mã lô", "Ngày", "Loài", "Bán buôn", "Khối lượng", "Còn lại", "Thẩm định"]}>
          {rows.map((l) => {
            const insp = l.inspection?.[0];
            return (
              <tr key={l.id} className="hover:bg-slate-50">
                <td className="px-3 py-2 font-medium">{l.lot_code}</td>
                <td className="px-3 py-2">{l.business_day}</td>
                <td className="px-3 py-2">{l.species}</td>
                <td className="px-3 py-2 text-slate-600">{l.party?.name}</td>
                <td className="px-3 py-2 tabular-nums">{kg(l.quantity_kg)}</td>
                <td className="px-3 py-2 tabular-nums">
                  {Number(l.remaining_kg) > 0
                    ? kg(l.remaining_kg)
                    : <Badge tone="slate">đã bán hết</Badge>}
                </td>
                <td className="px-3 py-2">
                  {insp ? (
                    <Badge tone={insp.grade === "A" ? "green" : insp.grade === "B" ? "blue" : "amber"}>
                      Hạng {insp.grade}
                    </Badge>
                  ) : (
                    <span className="flex gap-1">
                      {["A", "B", "C"].map((g) => (
                        <Button key={g} variant="ghost" onClick={() => inspect(l, g)}>{g}</Button>
                      ))}
                    </span>
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

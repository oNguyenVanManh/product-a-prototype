"use client";

import { useState } from "react";
import {
  Card, Table, Badge, Button, Field, inputCls, Notice, useApi, yen,
} from "@/components/ui";

type Inc = {
  id: string; business_day: string; base_amount: number;
  rate_version_no: number; rate_pct: number; incentive_amt: number; on_time: boolean;
  party: { code: string; name: string; kind: string } | null;
};
type Rate = { version_no: number; effective_from: string; rate_pct: number; tax_factor: number };

export default function IncentivesPage() {
  const { data, loading, error, reload } = useApi<{ rows: Inc[]; rates: Rate[] }>("/api/incentives");
  const [day, setDay] = useState("2026-10-05");
  const [msg, setMsg] = useState({ kind: "ok" as "ok" | "error", text: "" });

  async function calc() {
    const r = await fetch("/api/incentives", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ business_day: day }),
    });
    const j = await r.json();
    if (!r.ok) return setMsg({ kind: "error", text: j.error });
    setMsg({
      kind: "ok",
      text: `Đã tính ${j.count} dòng cho ngày ${day}, dùng biểu suất phiên bản ${j.rate_used.version_no} (${j.rate_used.rate_pct}%, hiệu lực từ ${j.rate_used.effective_from}).`,
    });
    reload();
  }

  if (loading) return <p className="text-sm text-slate-500">Đang tải…</p>;
  if (error) return <p className="text-sm text-red-700">{error}</p>;

  const rows = data?.rows ?? [];
  const rates = data?.rates ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Tiền khuyến khích thanh toán đúng hạn</h1>
        <p className="mt-1 text-sm text-slate-600">完納奨励金 · SCR-20 · FEA-07</p>
      </div>

      <Notice kind={msg.kind} text={msg.text} />

      <Card
        title="Biểu suất tra theo ngày nghiệp vụ, không lấy bản mới nhất"
        subtitle="Đây là quy tắc dễ cài sai nhất của đề"
      >
        <p className="text-sm leading-relaxed text-slate-700">
          Khi tính thưởng cho một ngày, hệ thống lấy biểu suất <span className="font-medium">có
          hiệu lực vào chính ngày đó</span>. Nếu lấy biểu suất mới nhất tại thời điểm bấm nút thì
          mỗi lần ban quản lý chợ đổi biểu suất, toàn bộ kết quả đã chốt của các kỳ trước sẽ đổi
          theo — sai về nghiệp vụ và không giải trình được khi kiểm toán. Phiên bản đã dùng được
          lưu lại ở từng dòng kết quả để về sau vẫn tái lập được con số.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {rates.map((r) => (
            <div key={r.version_no} className="rounded-md border border-slate-200 p-3 text-sm">
              <Badge tone="blue">Phiên bản {r.version_no}</Badge>
              <div className="mt-2 text-slate-700">
                Tỷ lệ <span className="font-medium">{r.rate_pct}%</span> · hệ số thuế {r.tax_factor}
              </div>
              <div className="text-slate-500">Hiệu lực từ {r.effective_from}</div>
            </div>
          ))}
        </div>

        <p className="mt-3 text-xs text-slate-500">
          Thử tính cho ngày 2026-09-29 rồi tính cho 2026-10-06 — hai ngày sẽ dùng hai phiên bản
          biểu suất khác nhau, dù bấm nút ở cùng một thời điểm.
        </p>
      </Card>

      <Card title="Tính thưởng cho một ngày">
        <div className="flex flex-wrap items-end gap-4">
          <Field label="Ngày nghiệp vụ">
            <input
              type="date" className={inputCls} value={day}
              onChange={(e) => setDay(e.target.value)}
            />
          </Field>
          <Button onClick={calc}>Tính thưởng</Button>
          <span className="text-xs text-slate-500">
            Cơ sở tính là tổng giao dịch đã chốt trong ngày, đã trừ dòng đảo. Trả sau hạn thì
            thưởng bằng 0.
          </span>
        </div>
      </Card>

      <Card title={`Kết quả đã tính (${rows.length})`}>
        <Table
          head={["Ngày", "Bên tham gia", "Cơ sở tính", "Biểu suất", "Thanh toán", "Tiền thưởng"]}
        >
          {rows.map((r) => (
            <tr key={r.id} className="hover:bg-slate-50">
              <td className="px-3 py-2">{r.business_day}</td>
              <td className="px-3 py-2">
                <span className="font-medium">{r.party?.code}</span> · {r.party?.name}
              </td>
              <td className="px-3 py-2 tabular-nums">{yen(r.base_amount)}</td>
              <td className="px-3 py-2 tabular-nums">
                {r.rate_pct}% <span className="text-xs text-slate-400">(v{r.rate_version_no})</span>
              </td>
              <td className="px-3 py-2">
                {r.on_time ? <Badge tone="green">Đúng hạn</Badge> : <Badge tone="red">Quá hạn</Badge>}
              </td>
              <td className="px-3 py-2 tabular-nums font-medium">
                {r.incentive_amt > 0 ? yen(r.incentive_amt) : <span className="text-slate-400">0</span>}
              </td>
            </tr>
          ))}
        </Table>
        {rows.length === 0 && (
          <p className="mt-3 text-sm text-slate-500">
            Chưa có kết quả nào. Chọn một ngày ở trên rồi bấm Tính thưởng.
          </p>
        )}
      </Card>
    </div>
  );
}

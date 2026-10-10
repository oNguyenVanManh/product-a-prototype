"use client";

import { useState } from "react";
import { Card, Table, Badge, Button, Notice, useApi, yen } from "@/components/ui";

type Row = {
  business_day: string; is_locked: boolean; locked_at: string | null;
  negotiated_amt: number; auction_amt: number;
  negotiated_cnt: number; auction_cnt: number; reversal_cnt: number;
  total_amt: number; negotiated_share: number;
};

export default function SettlementPage() {
  const { data, loading, error, reload } = useApi<Row[]>("/api/settlement");
  const [msg, setMsg] = useState({ kind: "ok" as "ok" | "error", text: "" });

  async function toggleLock(r: Row) {
    const willLock = !r.is_locked;
    if (willLock && !confirm(
      `Khoá sổ ngày ${r.business_day}?\n\n` +
      `Sau khi khoá, hệ thống sẽ CHẶN mọi giao dịch ghi mới vào ngày này ở tầng database.`
    )) return;

    const res = await fetch("/api/settlement/lock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ business_day: r.business_day, lock: willLock }),
    });
    const j = await res.json();
    if (!res.ok) return setMsg({ kind: "error", text: j.error });
    setMsg({
      kind: "ok",
      text: willLock
        ? `Đã khoá sổ ngày ${r.business_day}. Thử chốt giao dịch vào ngày này sẽ bị chặn.`
        : `Đã mở lại ngày ${r.business_day}.`,
    });
    reload();
  }

  if (loading) return <p className="text-sm text-slate-500">Đang tải…</p>;
  if (error) return <p className="text-sm text-red-700">{error}</p>;

  const rows = data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Đối soát và chốt sổ</h1>
        <p className="mt-1 text-sm text-slate-600">SCR-14 bảng đối soát · SCR-15 khoá ngày · FEA-06</p>
      </div>

      <Notice kind={msg.kind} text={msg.text} />

      <Card
        title="Khoá ngày nghiệp vụ được thi hành ở tầng database"
        subtitle="Không phải chỉ ẩn nút trên giao diện"
      >
        <p className="text-sm leading-relaxed text-slate-700">
          Khi một ngày đã khoá, trigger trong Supabase từ chối mọi lệnh ghi giao dịch vào ngày đó
          và trả về thông điệp lỗi. Nghĩa là dù gọi thẳng API hay thao tác trực tiếp trên database,
          dữ liệu đã chốt vẫn không đổi được. Cột <span className="font-medium">Dòng đảo</span> bên
          dưới cho thấy số bản ghi sửa sai — sửa bằng cách thêm dòng mới, không xoá dòng cũ.
        </p>
      </Card>

      <Card title={`Bảng đối soát theo ngày (${rows.length})`}>
        <Table
          head={["Ngày", "Thỏa thuận", "Đấu giá", "Dòng đảo", "Tổng ròng", "Tỷ trọng thỏa thuận", "Trạng thái", ""]}
        >
          {rows.map((r) => (
            <tr key={r.business_day} className="hover:bg-slate-50">
              <td className="px-3 py-2 font-medium">{r.business_day}</td>
              <td className="px-3 py-2 tabular-nums">{r.negotiated_cnt} · {yen(r.negotiated_amt)}</td>
              <td className="px-3 py-2 tabular-nums">{r.auction_cnt} · {yen(r.auction_amt)}</td>
              <td className="px-3 py-2">
                {r.reversal_cnt > 0 ? <Badge tone="red">{r.reversal_cnt}</Badge> : "—"}
              </td>
              <td className="px-3 py-2 tabular-nums font-medium">{yen(r.total_amt)}</td>
              <td className="px-3 py-2 tabular-nums">{r.negotiated_share.toFixed(1)}%</td>
              <td className="px-3 py-2">
                {r.is_locked ? <Badge tone="green">Đã khoá</Badge> : <Badge>Đang mở</Badge>}
              </td>
              <td className="px-3 py-2">
                <Button variant={r.is_locked ? "ghost" : "primary"} onClick={() => toggleLock(r)}>
                  {r.is_locked ? "Mở lại" : "Khoá sổ"}
                </Button>
              </td>
            </tr>
          ))}
        </Table>
        <p className="mt-4 text-xs text-slate-500">
          Chỉ vai trò đối soát và quản trị hệ thống mới thao tác được. Đăng nhập bằng vai trò khác
          sẽ nhận lỗi từ chối quyền.
        </p>
      </Card>
    </div>
  );
}

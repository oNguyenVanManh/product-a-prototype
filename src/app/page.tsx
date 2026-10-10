"use client";

import Link from "next/link";
import { Card, Stat, Badge, useApi, yen, Table } from "@/components/ui";

type Row = {
  business_day: string;
  is_locked: boolean;
  negotiated_amt: number;
  auction_amt: number;
  negotiated_cnt: number;
  auction_cnt: number;
  reversal_cnt: number;
  total_amt: number;
  negotiated_share: number;
};

export default function Dashboard() {
  const { data, loading, error } = useApi<Row[]>("/api/settlement");

  if (loading) return <p className="text-sm text-slate-500">Đang tải…</p>;
  if (error) return <p className="text-sm text-red-700">{error}</p>;

  const rows = data ?? [];
  const neg = rows.reduce((s, r) => s + r.negotiated_amt, 0);
  const auc = rows.reduce((s, r) => s + r.auction_amt, 0);
  const total = neg + auc;
  const share = total > 0 ? (neg / total) * 100 : 0;
  const locked = rows.filter((r) => r.is_locked).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Tổng quan vận hành</h1>
        <p className="mt-1 text-sm text-slate-600">
          Prototype LAB-3 · 10 màn hình · dữ liệu đọc/ghi thật trên Supabase
        </p>
      </div>

      {/* Con số quan trọng nhất của cả đề đặt ngay đầu trang. */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Giao dịch thỏa thuận 相対取引"
          value={`${share.toFixed(1)}%`}
          hint={`${yen(neg)} — luồng chính`}
          tone="blue"
        />
        <Stat
          label="Phiên đấu giá せり"
          value={`${(100 - share).toFixed(1)}%`}
          hint={`${yen(auc)} — luồng phụ`}
          tone="amber"
        />
        <Stat label="Tổng giá trị giao dịch" value={yen(total)} hint="đã trừ dòng đảo" />
        <Stat
          label="Ngày đã khoá sổ"
          value={`${locked} / ${rows.length}`}
          hint="ngày khoá thì chặn ghi mới"
          tone="green"
        />
      </div>

      <Card
        title="Vì sao tỷ trọng này quan trọng"
        subtitle="Điểm dễ đọc sai nhất của đề, và là lý do prototype đặt nó lên đầu"
      >
        <p className="text-sm leading-relaxed text-slate-700">
          Tên gọi &ldquo;chợ đấu giá&rdquo; khiến người ngoài tưởng phiên đấu giá công khai
          (<span className="font-medium">せり</span>) là luồng nghiệp vụ chính. Thực tế theo tài
          liệu khách hàng, phần lớn giá trị giao dịch đến từ thỏa thuận trực tiếp giữa hai bên
          (<span className="font-medium">相対取引</span>). Một hệ thống chỉ dựng quanh phiên đấu
          giá sẽ bỏ sót khoảng 90% giá trị thật — nên prototype dựng cả hai luồng, dùng chung một
          sổ giao dịch, và hiển thị tỷ trọng ngay ở màn hình đầu tiên.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/trades?kind=negotiated">
            <Badge tone="blue">Xem giao dịch thỏa thuận →</Badge>
          </Link>
          <Link href="/trades?kind=auction">
            <Badge tone="amber">Xem kết quả đấu giá →</Badge>
          </Link>
        </div>
      </Card>

      <Card title="Theo ngày nghiệp vụ" subtitle="14 ngày trong dữ liệu mẫu">
        <Table
          head={["Ngày", "Trạng thái", "Thỏa thuận", "Đấu giá", "Dòng đảo", "Tổng", "Tỷ trọng thỏa thuận"]}
        >
          {rows.map((r) => (
            <tr key={r.business_day} className="hover:bg-slate-50">
              <td className="px-3 py-2 font-medium">{r.business_day}</td>
              <td className="px-3 py-2">
                {r.is_locked ? <Badge tone="green">Đã khoá</Badge> : <Badge>Đang mở</Badge>}
              </td>
              <td className="px-3 py-2 tabular-nums">
                {r.negotiated_cnt} · {yen(r.negotiated_amt)}
              </td>
              <td className="px-3 py-2 tabular-nums">
                {r.auction_cnt} · {yen(r.auction_amt)}
              </td>
              <td className="px-3 py-2 tabular-nums">
                {r.reversal_cnt > 0 ? <Badge tone="red">{r.reversal_cnt}</Badge> : "—"}
              </td>
              <td className="px-3 py-2 tabular-nums font-medium">{yen(r.total_amt)}</td>
              <td className="px-3 py-2 tabular-nums">{r.negotiated_share.toFixed(1)}%</td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}

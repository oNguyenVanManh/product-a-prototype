"use client";

import { Card, Table, Badge, useApi } from "@/components/ui";

type Q = { kind: "permit" | "approval"; cert_no: string; valid_from: string; valid_to: string; suspended: boolean };
type Party = {
  id: string; code: string; name: string; kind: string; phone: string | null;
  is_active: boolean; party_qualification: Q[];
};

const KIND_LABEL: Record<string, string> = {
  wholesaler: "卸売業者 — Đơn vị bán buôn",
  intermediate: "仲卸 — Đơn vị trung gian",
  participant: "売買参加者 — Bên tham gia mua bán",
  buyer: "買出人 — Người mua lẻ tại chợ",
};

export default function PartiesPage() {
  const { data, loading, error } = useApi<Party[]>("/api/parties");
  if (loading) return <p className="text-sm text-slate-500">Đang tải…</p>;
  if (error) return <p className="text-sm text-red-700">{error}</p>;

  const today = new Date().toISOString().slice(0, 10);
  const rows = data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Bên tham gia và tư cách giao dịch</h1>
        <p className="mt-1 text-sm text-slate-600">SCR-03 · FEA-01</p>
      </div>

      <Card
        title="Hai cấp pháp lý khác nhau"
        subtitle="Tài liệu khách hàng cấm gộp hai cấp này thành một quyền chung"
      >
        <div className="grid gap-4 text-sm sm:grid-cols-2">
          <div className="rounded-md border border-blue-200 bg-blue-50 p-3">
            <Badge tone="blue">許可 — Giấy phép</Badge>
            <p className="mt-2 text-slate-700">
              Cấp cho <span className="font-medium">仲卸 đơn vị trung gian</span>. Thủ tục nặng hơn,
              là điều kiện để được giao dịch trực tiếp tại chợ.
            </p>
          </div>
          <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3">
            <Badge tone="green">承認 — Chấp thuận</Badge>
            <p className="mt-2 text-slate-700">
              Cấp cho <span className="font-medium">売買参加者 bên tham gia mua bán</span>. Thủ tục
              nhẹ hơn và là cơ chế độc lập, không phải một dạng của giấy phép.
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm text-slate-600">
          <span className="font-medium">買出人 người mua lẻ</span> không có tư cách giao dịch trực
          tiếp — phải mua qua đơn vị trung gian. Vì vậy họ không xuất hiện trong ô chọn bên mua ở
          màn hình giao dịch.
        </p>
      </Card>

      <Card title={`Danh sách (${rows.length})`}>
        <Table head={["Mã", "Tên", "Vai trò tham gia chợ", "Tư cách", "Hiệu lực đến", "Trạng thái"]}>
          {rows.map((p) => {
            const q = p.party_qualification?.[0];
            const expired = q ? q.valid_to < today : false;
            const soon = q ? !expired && q.valid_to <= "2026-11-30" : false;
            return (
              <tr key={p.id} className="hover:bg-slate-50">
                <td className="px-3 py-2 font-medium">{p.code}</td>
                <td className="px-3 py-2">{p.name}</td>
                <td className="px-3 py-2 text-slate-600">{KIND_LABEL[p.kind] ?? p.kind}</td>
                <td className="px-3 py-2">
                  {!q ? <span className="text-slate-400">— không có —</span>
                    : q.kind === "permit"
                      ? <Badge tone="blue">許可 {q.cert_no}</Badge>
                      : <Badge tone="green">承認 {q.cert_no}</Badge>}
                </td>
                <td className="px-3 py-2 tabular-nums">{q?.valid_to ?? "—"}</td>
                <td className="px-3 py-2">
                  {!q ? <Badge>Mua qua trung gian</Badge>
                    : q.suspended ? <Badge tone="red">Tạm ngưng</Badge>
                    : expired ? <Badge tone="red">Hết hạn</Badge>
                    : soon ? <Badge tone="amber">Sắp hết hạn</Badge>
                    : <Badge tone="green">Hợp lệ</Badge>}
                </td>
              </tr>
            );
          })}
        </Table>
      </Card>
    </div>
  );
}

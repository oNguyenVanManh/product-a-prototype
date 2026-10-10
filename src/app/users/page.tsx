"use client";

import { useState } from "react";
import { Card, Table, Badge, Button, Notice, useApi } from "@/components/ui";

type U = { id: string; email: string; full_name: string; role: string; is_active: boolean };

const ROLE_LABEL: Record<string, string> = {
  ROLE_SYS_ADMIN: "Quản trị hệ thống",
  ROLE_INTAKE: "Tiếp nhận lô",
  ROLE_JUDGE: "Thẩm định",
  ROLE_TRADE: "Chốt giao dịch",
  ROLE_DELIVERY: "Giao hàng",
  ROLE_SETTLEMENT: "Đối soát",
};

export default function UsersPage() {
  const { data, loading, error, reload } = useApi<U[]>("/api/users");
  const [msg, setMsg] = useState({ kind: "ok" as "ok" | "error", text: "" });

  async function toggle(u: U) {
    const r = await fetch("/api/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: u.id, is_active: !u.is_active }),
    });
    const j = await r.json();
    if (!r.ok) return setMsg({ kind: "error", text: j.error });
    setMsg({ kind: "ok", text: `Đã ${u.is_active ? "tắt" : "bật"} tài khoản ${u.email}.` });
    reload();
  }

  if (loading) return <p className="text-sm text-slate-500">Đang tải…</p>;
  if (error) return <p className="text-sm text-red-700">{error}</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Tài khoản và quyền</h1>
        <p className="mt-1 text-sm text-slate-600">SCR-02 · FEA-02</p>
      </div>

      <Notice kind={msg.kind} text={msg.text} />

      <Card
        title={`Người dùng nội bộ (${(data ?? []).length})`}
        subtitle="Vai trò hệ thống, khác với vai trò tham gia chợ ở màn hình Bên tham gia"
      >
        <Table head={["Email", "Họ tên", "Vai trò", "Trạng thái", ""]}>
          {(data ?? []).map((u) => (
            <tr key={u.id} className="hover:bg-slate-50">
              <td className="px-3 py-2 font-medium">{u.email}</td>
              <td className="px-3 py-2">{u.full_name}</td>
              <td className="px-3 py-2">
                <Badge tone={u.role === "ROLE_SYS_ADMIN" ? "blue" : "slate"}>
                  {ROLE_LABEL[u.role] ?? u.role}
                </Badge>
              </td>
              <td className="px-3 py-2">
                {u.is_active ? <Badge tone="green">Đang hoạt động</Badge> : <Badge tone="red">Đã tắt</Badge>}
              </td>
              <td className="px-3 py-2">
                <Button variant={u.is_active ? "danger" : "ghost"} onClick={() => toggle(u)}>
                  {u.is_active ? "Tắt" : "Bật"}
                </Button>
              </td>
            </tr>
          ))}
        </Table>
        <p className="mt-4 text-xs text-slate-500">
          Chỉ vai trò quản trị hệ thống mới đổi được trạng thái. Mọi thao tác bật/tắt đều ghi vào
          nhật ký kiểm toán.
        </p>
      </Card>
    </div>
  );
}

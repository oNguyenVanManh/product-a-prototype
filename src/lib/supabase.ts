import { createClient } from "@supabase/supabase-js";

/**
 * Supabase client dùng ở phía server.
 *
 * Dùng service_role key nên TUYỆT ĐỐI không import file này vào component
 * chạy ở trình duyệt. Mọi truy cập dữ liệu đi qua API route trong src/app/api.
 */
export function db() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Thiếu NEXT_PUBLIC_SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY trong .env.local"
    );
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Ghi nhật ký thao tác nhạy cảm (FR-AUDIT-01). Lỗi ghi log không làm hỏng nghiệp vụ. */
export async function audit(
  actorId: string | null,
  action: string,
  entity: string,
  entityId?: string,
  detail?: Record<string, unknown>
) {
  try {
    await db().from("audit_log").insert({
      actor_id: actorId,
      action,
      entity,
      entity_id: entityId ?? null,
      detail: detail ?? null,
    });
  } catch {
    // nuốt lỗi: nhật ký hỏng không được chặn nghiệp vụ
  }
}

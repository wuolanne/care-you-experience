import { supabaseAdmin } from "@/integrations/supabase/client.server";
import {
  deliverOutbox,
  resolveRecipients,
  type NotificationInput,
  type NotificationStore,
  type OutboxRecord,
  type RecipientKey,
} from "./notifications";
import { sendWithResend } from "./resend";

type ContactRequest = {
  email: string;
  message: string;
  lang: string;
  idempotencyKey: string;
};

type BookingRequest = {
  meetingDate: string;
  preferredTime: string;
  email: string;
  lang: string;
  idempotencyKey: string;
};

type ServiceStartRequest = {
  customerName: string;
  contactPerson: string;
  email: string;
  workAddress: string;
  startDate: string;
  startTime: string;
  serviceType: "once" | "monthly";
  onceDetails?: string | undefined;
  packageName?: string | undefined;
  lang: string;
  idempotencyKey: string;
};

type FallbackPersist = () => Promise<void>;

export async function saveContactRequest(data: ContactRequest, fallback: FallbackPersist) {
  const input: NotificationInput = {
    requestType: "contact",
    idempotencyKey: data.idempotencyKey,
    recipientKey: "contact",
    replyTo: data.email,
    subject: "TGN Services – uusi yhteydenottopyyntö",
    payload: { email: data.email, message: data.message, lang: data.lang },
  };

  return submitWithConfiguredStore(input, fallback, async (store) =>
    store.persist(input, {
      p_email: data.email,
      p_message: data.message,
      p_lang: data.lang,
    }),
  );
}

export async function saveBookingRequest(data: BookingRequest, fallback: FallbackPersist) {
  const input: NotificationInput = {
    requestType: "booking",
    idempotencyKey: data.idempotencyKey,
    recipientKey: "booking",
    replyTo: data.email,
    subject: "TGN Services – uusi videopalaveripyyntö",
    payload: {
      meetingDate: data.meetingDate,
      preferredTime: data.preferredTime,
      email: data.email,
      lang: data.lang,
    },
  };

  return submitWithConfiguredStore(input, fallback, async (store) =>
    store.persist(input, {
      p_meeting_date: data.meetingDate,
      p_preferred_time: data.preferredTime,
      p_contact_email: data.email,
      p_lang: data.lang,
    }),
  );
}

export async function saveServiceStartRequest(
  data: ServiceStartRequest,
  fallback: FallbackPersist,
) {
  const input: NotificationInput = {
    requestType: "service_start",
    idempotencyKey: data.idempotencyKey,
    recipientKey: "service_start",
    replyTo: data.email,
    subject: "TGN Services – uusi palvelun aloituspyyntö",
    payload: {
      customerName: data.customerName,
      contactPerson: data.contactPerson,
      email: data.email,
      workAddress: data.workAddress,
      startDate: data.startDate,
      startTime: data.startTime,
      serviceType: data.serviceType,
      onceDetails: data.onceDetails,
      packageName: data.packageName,
      lang: data.lang,
    },
  };

  return submitWithConfiguredStore(input, fallback, async (store) =>
    store.persist(input, {
      p_customer_name: data.customerName,
      p_contact_person: data.contactPerson,
      p_email: data.email,
      p_work_address: data.workAddress,
      p_start_date: data.startDate,
      p_start_time: data.startTime,
      p_service_type: data.serviceType,
      p_once_details: data.onceDetails ?? null,
      p_package_name: data.packageName ?? null,
      p_lang: data.lang,
    }),
  );
}

export async function retryPendingEmailOutbox(limit = 20): Promise<number> {
  if (!process.env["SUPABASE_URL"] || !process.env["SUPABASE_SERVICE_ROLE_KEY"]) return 0;

  const store = new AdminNotificationStore();
  const now = new Date();
  await supabaseAdmin
    .from("email_outbox")
    .update({
      status: "failed",
      last_error: "stale_processing",
      available_at: now.toISOString(),
      updated_at: now.toISOString(),
    })
    .eq("status", "processing")
    .lt("updated_at", new Date(now.getTime() - 10 * 60_000).toISOString());
  const { data, error } = await supabaseAdmin
    .from("email_outbox")
    .select("id")
    .in("status", ["pending", "failed", "blocked"])
    .lt("attempts", 10)
    .lte("available_at", now.toISOString())
    .order("available_at", { ascending: true })
    .limit(limit);
  if (error) throw new Error("Outbox retry read failed");

  let handled = 0;
  for (const row of data ?? []) {
    const status = await deliverOutbox(
      store,
      { send: (record) => sendWithResend(record) },
      row["id"],
    );
    if (status === "accepted" || status === "blocked" || status === "failed") handled += 1;
  }
  return handled;
}

async function submitWithConfiguredStore(
  input: NotificationInput,
  fallback: FallbackPersist,
  persistWithAdmin: (
    store: AdminNotificationStore,
  ) => Promise<{ requestId: string; outboxId: string; status: "pending" | "blocked" }>,
) {
  if (!process.env["SUPABASE_URL"] || !process.env["SUPABASE_SERVICE_ROLE_KEY"]) {
    try {
      await fallback();
      return { ok: true as const, notificationStatus: "blocked" as const };
    } catch {
      return { ok: false as const, error: "storage_failed" as const };
    }
  }

  try {
    const store = new AdminNotificationStore();
    const persisted = await persistWithAdmin(store);
    const notificationStatus = await deliverOutbox(
      store,
      { send: (record) => sendWithResend(record) },
      persisted.outboxId,
    );
    return { ok: true as const, requestId: persisted.requestId, notificationStatus };
  } catch {
    return { ok: false as const, error: "storage_failed" as const };
  }
}

class AdminNotificationStore implements NotificationStore {
  async persist(input: NotificationInput, requestData: Record<string, unknown> = {}) {
    const recipients = resolveRecipients(input.recipientKey);
    const rpcName = rpcNameFor(input.requestType);
    const rpcArgs = {
      ...requestData,
      p_recipient: recipients.join(",") || null,
      p_reply_to: input.replyTo,
      p_subject: input.subject,
      p_payload: input.payload,
      p_idempotency_key: input.idempotencyKey,
    };
    const { data, error } = await supabaseAdmin.rpc(rpcName, rpcArgs as never);
    if (error) throw new Error("Request persistence failed");
    const row = Array.isArray(data) ? data[0] : data;
    if (!row || typeof row !== "object") throw new Error("Request persistence returned no id");
    const typed = row as { request_id?: unknown; outbox_id?: unknown };
    if (typeof typed.request_id !== "string" || typeof typed.outbox_id !== "string") {
      throw new Error("Request persistence returned invalid ids");
    }
    return {
      requestId: typed.request_id,
      outboxId: typed.outbox_id,
      status: recipients.length > 0 ? ("pending" as const) : ("blocked" as const),
    };
  }

  async claim(outboxId: string): Promise<OutboxRecord | null> {
    const { data: current, error: readError } = await supabaseAdmin
      .from("email_outbox")
      .select("status, attempts")
      .eq("id", outboxId)
      .maybeSingle();
    if (readError || !current) return null;
    if (!["pending", "failed", "blocked"].includes(current.status) || current.attempts >= 10) {
      return null;
    }

    const { data, error } = await supabaseAdmin
      .from("email_outbox")
      .update({
        status: "processing",
        attempts: current.attempts + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("id", outboxId)
      .eq("status", current.status)
      .lt("attempts", 10)
      .lte("available_at", new Date().toISOString())
      .select("*")
      .maybeSingle();
    if (error) throw new Error("Outbox claim failed");
    return data ? toOutboxRecord(data) : null;
  }

  async current(outboxId: string): Promise<OutboxRecord | null> {
    const { data, error } = await supabaseAdmin
      .from("email_outbox")
      .select("*")
      .eq("id", outboxId)
      .maybeSingle();
    if (error) throw new Error("Outbox read failed");
    return data ? toOutboxRecord(data) : null;
  }

  async markAccepted(outboxId: string, providerId: string | null) {
    const { error } = await supabaseAdmin
      .from("email_outbox")
      .update({
        status: "accepted",
        provider_id: providerId,
        accepted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", outboxId);
    if (error) throw new Error("Outbox update failed");
  }

  async markFailed(outboxId: string, reason: string) {
    const { error } = await supabaseAdmin
      .from("email_outbox")
      .update({
        status: "failed",
        last_error: reason,
        available_at: new Date(Date.now() + 60_000).toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", outboxId);
    if (error) throw new Error("Outbox update failed");
  }

  async markBlocked(outboxId: string, reason: string) {
    const { error } = await supabaseAdmin
      .from("email_outbox")
      .update({ status: "blocked", last_error: reason, updated_at: new Date().toISOString() })
      .eq("id", outboxId);
    if (error) throw new Error("Outbox update failed");
  }
}

function rpcNameFor(type: RecipientKey) {
  return {
    contact: "create_contact_submission_with_notification",
    booking: "create_booking_request_with_notification",
    service_start: "create_service_start_request_with_notification",
  }[type] as never;
}

function toOutboxRecord(row: Record<string, unknown>): OutboxRecord {
  return {
    id: String(row["id"]),
    requestType: row["request_type"] as RecipientKey,
    recipientKey: row["recipient_key"] as RecipientKey,
    recipient: typeof row["recipient"] === "string" ? row["recipient"] : null,
    replyTo: typeof row["reply_to"] === "string" ? row["reply_to"] : null,
    subject: String(row["subject"]),
    payload: (row["payload"] ?? {}) as OutboxRecord["payload"],
    idempotencyKey: String(row["idempotency_key"]),
    status: row["status"] as OutboxRecord["status"],
    attempts: Number(row["attempts"] ?? 0),
  };
}

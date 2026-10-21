export type RecipientKey = "contact" | "booking" | "service_start";

export type NotificationStatus = "queued" | "accepted" | "processing" | "failed" | "blocked";

export type NotificationPayload = Record<string, string | null | undefined>;

export type NotificationInput = {
  requestType: RecipientKey;
  idempotencyKey: string;
  recipientKey: RecipientKey;
  replyTo: string;
  subject: string;
  payload: NotificationPayload;
};

export type PersistedNotification = {
  requestId: string | null;
  outboxId: string | null;
  status: "pending" | "blocked";
};

export type OutboxRecord = {
  id: string;
  requestType: RecipientKey;
  recipientKey: RecipientKey;
  recipient: string | null;
  replyTo: string | null;
  subject: string;
  payload: NotificationPayload;
  idempotencyKey: string;
  status: "pending" | "processing" | "accepted" | "failed" | "blocked";
  attempts: number;
};

export interface NotificationStore {
  persist(input: NotificationInput): Promise<PersistedNotification>;
  claim(outboxId: string): Promise<OutboxRecord | null>;
  current(outboxId: string): Promise<OutboxRecord | null>;
  markAccepted(outboxId: string, providerId: string | null): Promise<void>;
  markFailed(outboxId: string, reason: string): Promise<void>;
  markBlocked(outboxId: string, reason: string): Promise<void>;
}

export interface NotificationSender {
  send(
    record: OutboxRecord,
  ): Promise<{ status: "accepted" | "blocked"; providerId?: string | null }>;
}

const recipientEnvironmentVariables: Record<RecipientKey, string> = {
  contact: "CONTACT_EMAIL",
  booking: "BOOKING_EMAIL",
  service_start: "SERVICE_START_EMAIL",
};

export function resolveRecipients(
  key: RecipientKey,
  environment: Record<string, string | undefined> = process.env,
): string[] {
  const primary = environment[recipientEnvironmentVariables[key]];
  const fallback = environment["CONTACT_EMAIL"];
  const configured = primary?.trim() || fallback?.trim() || "";

  return configured
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);
}

export function environmentVariableForRecipient(key: RecipientKey): string {
  return recipientEnvironmentVariables[key];
}

export function renderNotificationEmail(record: Pick<OutboxRecord, "subject" | "payload">) {
  const lines = Object.entries(record.payload)
    .filter(([, value]) => value != null && value !== "")
    .map(([key, value]) => `${labelFor(key)}: ${value}`);

  return {
    text: [record.subject, "", ...lines].join("\n"),
    html: `<h1>${escapeHtml(record.subject)}</h1><dl>${Object.entries(record.payload)
      .filter(([, value]) => value != null && value !== "")
      .map(
        ([key, value]) =>
          `<dt><strong>${escapeHtml(labelFor(key))}</strong></dt><dd>${escapeHtml(String(value))}</dd>`,
      )
      .join("")}</dl>`,
  };
}

export async function persistAndDeliver(
  store: NotificationStore,
  sender: NotificationSender,
  input: NotificationInput,
) {
  let persisted: PersistedNotification;
  try {
    persisted = await store.persist(input);
  } catch {
    return { ok: false as const, error: "storage_failed" as const };
  }

  if (!persisted.outboxId) {
    return {
      ok: true as const,
      requestId: persisted.requestId,
      notificationStatus: "blocked" as const,
    };
  }

  const notificationStatus = await deliverOutbox(store, sender, persisted.outboxId);
  return {
    ok: true as const,
    requestId: persisted.requestId,
    notificationStatus,
  };
}

export async function deliverOutbox(
  store: NotificationStore,
  sender: NotificationSender,
  outboxId: string,
): Promise<NotificationStatus> {
  const claimed = await store.claim(outboxId);
  if (!claimed) {
    const current = await store.current(outboxId);
    if (!current) return "failed";
    if (current.status === "accepted") return "accepted";
    if (current.status === "processing") return "processing";
    if (current.status === "blocked") return "blocked";
    return "queued";
  }

  try {
    const result = await sender.send(claimed);
    if (result.status === "blocked") {
      await safeUpdate(() => store.markBlocked(outboxId, "email_configuration_missing"));
      return "blocked";
    }
    await safeUpdate(() => store.markAccepted(outboxId, result.providerId ?? null));
    return "accepted";
  } catch {
    await safeUpdate(() => store.markFailed(outboxId, "email_provider_error"));
    return "failed";
  }
}

async function safeUpdate(update: () => Promise<void>) {
  try {
    await update();
  } catch {
    // The request is already persisted. A later outbox retry can reconcile this state.
  }
}

function labelFor(key: string): string {
  const labels: Record<string, string> = {
    customerName: "Asiakas",
    contactPerson: "Yhteyshenkilö",
    email: "Sähköposti",
    message: "Viesti",
    meetingDate: "Toivottu päivämäärä",
    preferredTime: "Toivottu kellonaika",
    workAddress: "Työkohteen osoite",
    startDate: "Aloituspäivä",
    startTime: "Aloituskellonaika",
    serviceType: "Palvelu",
    onceDetails: "Lisätiedot",
    packageName: "Paketti",
    lang: "Kieli",
  };
  return labels[key] ?? key;
}

function escapeHtml(value: string): string {
  return value.replace(
    /[&<>'"]/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] ??
      character,
  );
}

import { renderNotificationEmail, resolveRecipients, type OutboxRecord } from "./notifications";

export type ResendEnvironment = Record<string, string | undefined>;

export async function sendWithResend(
  record: OutboxRecord,
  environment: ResendEnvironment = process.env,
  fetchImplementation: typeof fetch = fetch,
): Promise<{ status: "accepted" | "blocked"; providerId?: string }> {
  const apiKey = environment["RESEND_API_KEY"]?.trim();
  const from = environment["EMAIL_FROM"]?.trim();
  const recipients = resolveRecipients(record.recipientKey, environment);

  if (!apiKey || !from || recipients.length === 0) {
    return { status: "blocked" };
  }

  const rendered = renderNotificationEmail(record);
  const response = await fetchImplementation("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": record.idempotencyKey,
    },
    body: JSON.stringify({
      from,
      to: recipients,
      reply_to: record.replyTo ?? undefined,
      subject: record.subject,
      text: rendered.text,
      html: rendered.html,
    }),
  });

  if (!response.ok) {
    throw new Error(`Resend request failed with status ${response.status}`);
  }

  const responseBody = (await response.json()) as { id?: unknown };
  const providerId = typeof responseBody.id === "string" ? responseBody.id : null;
  return providerId ? { status: "accepted" as const, providerId } : { status: "accepted" as const };
}

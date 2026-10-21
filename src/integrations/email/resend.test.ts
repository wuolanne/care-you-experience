import { describe, expect, it, vi } from "vitest";
import { sendWithResend } from "./resend";
import type { OutboxRecord } from "./notifications";

const record: OutboxRecord = {
  id: "outbox-1",
  requestType: "contact",
  recipientKey: "contact",
  recipient: "company@example.com",
  replyTo: "customer@example.com",
  subject: "New contact request",
  payload: { email: "customer@example.com", message: "<hello>", lang: "fi" },
  idempotencyKey: "9c3c4b30-4e6c-4b2d-9c3c-4b304e6c4b2d",
  status: "processing",
  attempts: 1,
};

describe("Resend adapter", () => {
  it("sends a server-side request with an idempotency key", async () => {
    const fetchMock = vi.fn(
      async (..._args: Parameters<typeof fetch>) =>
        new Response(JSON.stringify({ id: "re_123" }), { status: 200 }),
    );

    const result = await sendWithResend(
      record,
      {
        RESEND_API_KEY: "server-only-key",
        EMAIL_FROM: "TGN Services <noreply@example.com>",
        CONTACT_EMAIL: "company@example.com",
      },
      fetchMock,
    );

    expect(result).toEqual({ status: "accepted", providerId: "re_123" });
    expect(fetchMock).toHaveBeenCalledOnce();
    const request = fetchMock.mock.calls[0]?.[1];
    expect(request?.headers).toMatchObject({ "Idempotency-Key": record.idempotencyKey });
    expect(JSON.parse(String(request?.body)).html).toContain("&lt;hello&gt;");
  });

  it("blocks without email configuration", async () => {
    const fetchMock = vi.fn();

    const result = await sendWithResend(
      record,
      { CONTACT_EMAIL: "company@example.com" },
      fetchMock,
    );

    expect(result).toEqual({ status: "blocked" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("surfaces provider failures to the outbox layer", async () => {
    const fetchMock = vi.fn(async () => new Response("invalid", { status: 500 }));

    await expect(
      sendWithResend(
        record,
        {
          RESEND_API_KEY: "server-only-key",
          EMAIL_FROM: "TGN Services <noreply@example.com>",
          CONTACT_EMAIL: "company@example.com",
        },
        fetchMock,
      ),
    ).rejects.toThrow("status 500");
  });
});

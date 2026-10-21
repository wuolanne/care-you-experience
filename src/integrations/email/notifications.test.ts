import { describe, expect, it, vi } from "vitest";
import {
  persistAndDeliver,
  resolveRecipients,
  type NotificationStore,
  type OutboxRecord,
} from "./notifications";

function record(overrides: Partial<OutboxRecord> = {}): OutboxRecord {
  return {
    id: "outbox-1",
    requestType: "contact",
    recipientKey: "contact",
    recipient: "company@example.com",
    replyTo: "customer@example.com",
    subject: "New contact request",
    payload: { email: "customer@example.com", message: "Hello", lang: "fi" },
    idempotencyKey: "9c3c4b30-4e6c-4b2d-9c3c-4b304e6c4b2d",
    status: "pending",
    attempts: 0,
    ...overrides,
  };
}

function storeFor(current = record()) {
  let state = current;
  return {
    persist: vi.fn(async () => ({
      requestId: "request-1",
      outboxId: state.id,
      status: "pending" as const,
    })),
    claim: vi.fn(async () => {
      if (state.status === "accepted") return null;
      state = { ...state, status: "processing", attempts: state.attempts + 1 };
      return state;
    }),
    current: vi.fn(async () => state),
    markAccepted: vi.fn(async (_id: string, providerId: string | null) => {
      state = { ...state, status: "accepted", providerId } as OutboxRecord;
    }),
    markFailed: vi.fn(async () => {
      state = { ...state, status: "failed" };
    }),
    markBlocked: vi.fn(async () => {
      state = { ...state, status: "blocked" };
    }),
  } satisfies NotificationStore;
}

const input = {
  requestType: "contact" as const,
  idempotencyKey: "9c3c4b30-4e6c-4b2d-9c3c-4b304e6c4b2d",
  recipientKey: "contact" as const,
  replyTo: "customer@example.com",
  subject: "New contact request",
  payload: { email: "customer@example.com", message: "Hello", lang: "fi" },
};

describe("email notification delivery", () => {
  it("persists first and marks the provider request accepted", async () => {
    const store = storeFor();
    const sender = {
      send: vi.fn(async () => ({ status: "accepted" as const, providerId: "re_123" })),
    };

    const result = await persistAndDeliver(store, sender, input);

    expect(result).toMatchObject({ ok: true, notificationStatus: "accepted" });
    expect(store.persist).toHaveBeenCalledOnce();
    expect(store.markAccepted).toHaveBeenCalledWith("outbox-1", "re_123");
  });

  it("keeps the request successful when the email provider fails", async () => {
    const store = storeFor();
    const sender = {
      send: vi.fn(async () => {
        throw new Error("provider unavailable");
      }),
    };

    const result = await persistAndDeliver(store, sender, input);

    expect(result).toMatchObject({ ok: true, notificationStatus: "failed" });
    expect(store.markFailed).toHaveBeenCalledWith("outbox-1", "email_provider_error");
  });

  it("does not call the email provider when Supabase persistence fails", async () => {
    const store = storeFor();
    store.persist.mockRejectedValueOnce(new Error("database unavailable"));
    const sender = { send: vi.fn() };

    const result = await persistAndDeliver(store, sender, input);

    expect(result).toEqual({ ok: false, error: "storage_failed" });
    expect(sender.send).not.toHaveBeenCalled();
  });

  it("does not send an already accepted idempotent outbox item again", async () => {
    const store = storeFor(record({ status: "accepted" }));
    const sender = { send: vi.fn() };

    const result = await persistAndDeliver(store, sender, input);

    expect(result).toMatchObject({ ok: true, notificationStatus: "accepted" });
    expect(sender.send).not.toHaveBeenCalled();
  });

  it("selects a dedicated recipient and falls back to CONTACT_EMAIL", () => {
    expect(
      resolveRecipients("booking", {
        CONTACT_EMAIL: "contact@example.com",
        BOOKING_EMAIL: "booking@example.com, second@example.com",
      }),
    ).toEqual(["booking@example.com", "second@example.com"]);
    expect(resolveRecipients("service_start", { CONTACT_EMAIL: "contact@example.com" })).toEqual([
      "contact@example.com",
    ]);
  });
});

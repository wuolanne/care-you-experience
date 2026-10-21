import { describe, expect, it } from "vitest";
import { bookingRequestSchema } from "./model";

const valid = {
  meetingDate: "2026-10-30",
  preferredTime: "10:00",
  email: "customer@example.com",
  lang: "fi" as const,
  idempotencyKey: "9c3c4b30-4e6c-4b2d-9c3c-4b304e6c4b2d",
  website: "",
};

describe("booking request validation", () => {
  it("accepts a valid request and rejects a filled honeypot", () => {
    expect(bookingRequestSchema.safeParse(valid).success).toBe(true);
    expect(bookingRequestSchema.safeParse({ ...valid, website: "spam" }).success).toBe(false);
  });

  it("requires a valid idempotency key", () => {
    expect(bookingRequestSchema.safeParse({ ...valid, idempotencyKey: "not-a-uuid" }).success).toBe(
      false,
    );
  });
});

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

const bookingSchema = z.object({
  meetingDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "invalid_date"),
  preferredTime: z.string().regex(/^\d{2}:\d{2}$/, "invalid_time"),
  email: z.string().trim().email("invalid_email").max(255),
  lang: z.enum(["fi", "sv", "es", "en"]),
});

// Basic per-instance rate limiting; durable state lives in the database.
const recentSubmissions = new Map<string, number[]>();
const RATE_LIMIT_MS = 60_000;
const RATE_LIMIT_MAX = 5;

export const submitBookingRequest = createServerFn({ method: "POST" })
  .inputValidator((data) => bookingSchema.parse(data))
  .handler(async ({ data }) => {
    const ip = (await import("@tanstack/react-start")).getRequestHeader("x-forwarded-for") ?? "unknown";
    const now = Date.now();
    const hits = (recentSubmissions.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_MS);
    if (hits.length >= RATE_LIMIT_MAX) {
      return { ok: false as const, error: "rate_limited" };
    }
    hits.push(now);
    recentSubmissions.set(ip, hits);

    const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
    const supabase = createClient<Database>(process.env["SUPABASE_URL"]!, key, {
      auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const h = new Headers(init?.headers);
          if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
          h.set("apikey", key);
          return fetch(input, { ...init, headers: h });
        },
      },
    });

    const { error } = await supabase.from("booking_requests").insert({
      meeting_date: data.meetingDate,
      preferred_time: data.preferredTime,
      contact_email: data.email,
      lang: data.lang,
    });
    if (error) {
      console.error("booking insert failed:", error.message);
      return { ok: false as const, error: "storage_failed" };
    }
    return { ok: true as const };
  });

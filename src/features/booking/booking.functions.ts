import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { dateSchema, timeSchema } from "@/features/home-service/model";

const bookingSchema = z.object({
  meetingDate: dateSchema,
  preferredTime: timeSchema,
  email: z.string().trim().email("invalid_email").max(255),
  lang: z.enum(["fi", "sv", "es", "en"]),
});

// Per-worker burst protection; durable limits are checked against the database.
let workerSubmissions = 0;
let workerWindow = 0;
const WORKER_WINDOW_MS = 60_000;
const WORKER_LIMIT = 30;

export const submitBookingRequest = createServerFn({ method: "POST" })
  .inputValidator((data) => bookingSchema.parse(data))
  .handler(async ({ data }) => {
    const now = Date.now();
    if (now - workerWindow > WORKER_WINDOW_MS) {
      workerWindow = now;
      workerSubmissions = 0;
    }
    if (++workerSubmissions > WORKER_LIMIT) {
      return { ok: false as const, error: "rate_limited" };
    }

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

    // Durable rate limit: at most 3 requests per address within a minute.
    const { count } = await supabase
      .from("booking_requests")
      .select("id", { count: "exact", head: true })
      .eq("contact_email", data.email)
      .gte("created_at", new Date(now - 60_000).toISOString());
    if ((count ?? 0) >= 3) {
      return { ok: false as const, error: "rate_limited" };
    }

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

import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { bookingRequestSchema } from "./model";

// Per-worker burst protection; durable limits are checked against the database.
let workerSubmissions = 0;
let workerWindow = 0;
const WORKER_WINDOW_MS = 60_000;
const WORKER_LIMIT = 30;

export const submitBookingRequest = createServerFn({ method: "POST" })
  .validator((data) => bookingRequestSchema.parse(data))
  .handler(async ({ data }) => {
    const now = Date.now();
    if (now - workerWindow > WORKER_WINDOW_MS) {
      workerWindow = now;
      workerSubmissions = 0;
    }
    if (++workerSubmissions > WORKER_LIMIT) {
      return { ok: false as const, error: "rate_limited" };
    }

    if (data.website) return { ok: false as const };
    const { saveBookingRequest } = await import("@/integrations/email/request-notifications.server");
    return saveBookingRequest(data, async () => {
      const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
      const url = process.env["SUPABASE_URL"];
      if (!key || !url) throw new Error("Supabase is not configured");
      const supabase = createClient<Database>(url, key, {
        auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
      });
      const { error } = await supabase.from("booking_requests").insert({
        meeting_date: data.meetingDate,
        preferred_time: data.preferredTime,
        contact_email: data.email,
        lang: data.lang,
      });
      if (error) throw error;
    });
  });

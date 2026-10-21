import { createHash } from "node:crypto";
import { getRequest } from "@tanstack/react-start/server";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export type FormRateLimitBucket = "contact" | "booking" | "service_start";

export async function isFormRequestAllowed(bucket: FormRateLimitBucket): Promise<boolean> {
  if (!process.env["SUPABASE_URL"] || !process.env["SUPABASE_SERVICE_ROLE_KEY"]) return true;

  const request = getRequest();
  const forwarded = request?.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const address = request?.headers.get("x-real-ip")?.trim() || forwarded || "unknown";
  const bucketKey = `${bucket}:${createHash("sha256").update(address, "utf8").digest("hex")}`;
  const { data, error } = await supabaseAdmin.rpc("check_form_rate_limit", {
    p_bucket_key: bucketKey,
    p_limit: 10,
  });

  if (error) return false;
  return data === true;
}

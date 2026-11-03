import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

function createPublicSupabaseClient() {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) return null;

  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

function notFoundResponse() {
  return new Response("Not found", {
    status: 404,
    headers: { "Cache-Control": "public, max-age=60" },
  });
}

export const Route = createFileRoute("/api/news-image/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        if (
          !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
            params.id,
          )
        ) {
          return notFoundResponse();
        }

        const client = createPublicSupabaseClient();
        if (!client) return notFoundResponse();

        const { data: item, error } = await client
          .from("news")
          .select("image_path")
          .eq("id", params.id)
          .eq("published", true)
          .maybeSingle();
        if (error || !item?.image_path) return notFoundResponse();

        const { data: signed, error: signError } = await client.storage
          .from("news-images")
          .createSignedUrl(item.image_path, 3600);
        if (signError || !signed?.signedUrl) return notFoundResponse();

        const imageResponse = await fetch(signed.signedUrl);
        if (!imageResponse.ok || !imageResponse.body) return notFoundResponse();

        const headers = new Headers();
        const contentType =
          imageResponse.headers.get("content-type") ??
          (item.image_path.toLowerCase().endsWith(".png")
            ? "image/png"
            : item.image_path.toLowerCase().endsWith(".webp")
              ? "image/webp"
              : "image/jpeg");
        headers.set("Content-Type", contentType);
        headers.set("Cache-Control", "public, max-age=300, stale-while-revalidate=86400");
        headers.set("X-Content-Type-Options", "nosniff");
        return new Response(imageResponse.body, { status: 200, headers });
      },
    },
  },
});

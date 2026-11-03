import { createFileRoute } from "@tanstack/react-router";

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

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: item, error } = await supabaseAdmin
          .from("news")
          .select("image_path")
          .eq("id", params.id)
          .eq("published", true)
          .maybeSingle();
        if (error || !item?.image_path) return notFoundResponse();

        const { data: signed, error: signError } = await supabaseAdmin.storage
          .from("news-images")
          .createSignedUrl(item.image_path, 3600);
        if (signError || !signed?.signedUrl) return notFoundResponse();

        const imageResponse = await fetch(signed.signedUrl);
        if (!imageResponse.ok || !imageResponse.body) return notFoundResponse();

        const headers = new Headers();
        const contentType = imageResponse.headers.get("content-type");
        if (contentType) headers.set("Content-Type", contentType);
        headers.set("Cache-Control", "public, max-age=300, stale-while-revalidate=86400");
        return new Response(imageResponse.body, { status: 200, headers });
      },
    },
  },
});

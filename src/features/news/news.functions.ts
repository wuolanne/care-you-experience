import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { hasNewsTranslation, type NewsItem } from "./model";
import { newsImagePath } from "./seo";

type PublicNewsRequest = { id: string; lang: "fi" | "sv" | "es" | "en" };

function publicNewsRequest(input: unknown): PublicNewsRequest {
  if (!input || typeof input !== "object") throw new Error("Invalid news request");
  const value = input as { id?: unknown; lang?: unknown };
  if (
    typeof value.id !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value.id) ||
    !["fi", "sv", "es", "en"].includes(value.lang as string)
  ) {
    throw new Error("Invalid news request");
  }
  return { id: value.id, lang: value.lang as PublicNewsRequest["lang"] };
}

export const listNews = createServerFn({ method: "GET" }).handler(async () => {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  const url = process.env["SUPABASE_URL"];
  if (!key || !url) {
    console.warn("[News] Supabase environment is not configured; rendering without news.");
    return [];
  }
  const client = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`)
          headers.delete("Authorization");
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
  const { data, error } = await client
    .from("news")
    .select("id,title,body,news_date,image_path,published")
    .eq("published", true)
    .order("news_date", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw new Error("Uutisia ei voitu ladata.");
  return (data as NewsItem[]).map((item) => ({
    ...item,
    imageUrl: item.image_path ? newsImagePath(item.id) : null,
  }));
});

export const getNews = createServerFn({ method: "GET" })
  .validator((input) => publicNewsRequest(input))
  .handler(async ({ data: request }) => {
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
    const url = process.env["SUPABASE_URL"];
    if (!key || !url) return null;

    const client = createClient<Database>(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const headers = new Headers(init?.headers);
          if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`)
            headers.delete("Authorization");
          headers.set("apikey", key);
          return fetch(input, { ...init, headers });
        },
      },
    });

    const { data, error } = await client
      .from("news")
      .select("id,title,body,news_date,image_path,published")
      .eq("id", request.id)
      .eq("published", true)
      .maybeSingle();
    if (error) throw new Error("Uutista ei voitu ladata.");
    const item = (data as NewsItem | null) ?? null;
    return item && hasNewsTranslation(item, request.lang) ? item : null;
  });

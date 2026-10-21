import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import type { NewsItem } from "./model";

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
  return await Promise.all(
    (data as NewsItem[]).map(async (item) => {
      if (!item.image_path) return { ...item, imageUrl: null };
      const { data: signed } = await client.storage
        .from("news-images")
        .createSignedUrl(item.image_path, 3600);
      const imageUrl =
        signed?.signedUrl?.replace(url, import.meta.env["VITE_SUPABASE_URL"]) ?? null;
      return { ...item, imageUrl };
    }),
  );
});

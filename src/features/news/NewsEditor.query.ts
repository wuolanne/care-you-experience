import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { editorAccess } from "@/features/news/editor.functions";
import type { NewsItem } from "@/features/news/model";

export const newsEditorQuery = queryOptions({
  queryKey: ["news-editor"],
  queryFn: async () => {
    const allowed = await editorAccess();
    if (!allowed) return { allowed: false, items: [] as NewsItem[] };

    const { data, error } = await supabase
      .from("news")
      .select("*")
      .order("news_date", { ascending: false });
    if (error) throw new Error("Uutisia ei voitu ladata.");

    const items = await Promise.all(
      (data as NewsItem[]).map(async (news) => {
        if (!news.image_path) return news;
        const { data: signed } = await supabase.storage
          .from("news-images")
          .createSignedUrl(news.image_path, 3600);
        return { ...news, imageUrl: signed?.signedUrl ?? null };
      }),
    );

    return { allowed: true, items };
  },
});

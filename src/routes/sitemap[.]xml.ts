import { createFileRoute } from "@tanstack/react-router";
import { buildSitemapXml, type NewsSitemapEntry } from "@/features/seo/sitemap";
import { hasNewsTranslation, type NewsText } from "@/features/news/model";
import type { Lang } from "@/i18n/translations";

const languages: Lang[] = ["fi", "sv", "es", "en"];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        let news: NewsSitemapEntry[] = [];
        try {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { data, error } = await supabaseAdmin
            .from("news")
            .select("id,title,body")
            .eq("published", true);
          if (error) throw error;
          news = (data ?? []).flatMap((item) => {
            const translated = {
              title: item.title as NewsText,
              body: item.body as NewsText,
            };
            return languages
              .filter((lang) => hasNewsTranslation(translated, lang))
              .map((lang) => ({ id: item.id, lang }));
          });
        } catch (error) {
          console.warn("[SEO] Published news could not be loaded for sitemap.", error);
        }

        return new Response(buildSitemapXml(news), {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=300, stale-while-revalidate=3600",
          },
        });
      },
    },
  },
});

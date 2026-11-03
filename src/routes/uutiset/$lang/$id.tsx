import { createFileRoute, notFound } from "@tanstack/react-router";
import { NewsArticle } from "@/features/news/NewsArticle";
import { getNews } from "@/features/news/news.functions";
import { isNewsId } from "@/features/news/model";
import { newsArticleHead } from "@/features/news/seo";
import type { Lang } from "@/i18n/translations";

function newsLanguage(value: string): Lang {
  if (value === "fi" || value === "sv" || value === "es" || value === "en") return value;
  throw notFound();
}

export const Route = createFileRoute("/uutiset/$lang/$id")({
  loader: async ({ params }) => {
    const lang = newsLanguage(params.lang);
    if (!isNewsId(params.id)) throw notFound();
    const item = await getNews({ data: { id: params.id, lang } });
    if (!item) throw notFound();
    return { item, lang };
  },
  head: ({ loaderData }) => (loaderData ? newsArticleHead(loaderData.item, loaderData.lang) : {}),
  component: LocalizedNewsArticleRoute,
});

function LocalizedNewsArticleRoute() {
  const { item, lang } = Route.useLoaderData();
  return <NewsArticle item={item} lang={lang} />;
}

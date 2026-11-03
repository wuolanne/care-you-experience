import { createFileRoute, notFound } from "@tanstack/react-router";
import { NewsArticle } from "@/features/news/NewsArticle";
import { getNews } from "@/features/news/news.functions";
import { isNewsId } from "@/features/news/model";
import { newsArticleHead } from "@/features/news/seo";

export const Route = createFileRoute("/uutiset/$id")({
  loader: async ({ params }) => {
    if (!isNewsId(params.id)) throw notFound();
    const item = await getNews({ data: { id: params.id, lang: "fi" } });
    if (!item) throw notFound();
    return { item };
  },
  head: ({ loaderData }) => (loaderData ? newsArticleHead(loaderData.item, "fi") : {}),
  component: FinnishNewsArticleRoute,
});

function FinnishNewsArticleRoute() {
  const { item } = Route.useLoaderData();
  return <NewsArticle item={item} lang="fi" />;
}

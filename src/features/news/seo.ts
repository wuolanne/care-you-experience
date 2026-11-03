import type { Lang } from "@/i18n/translations";
import { pageHead, SITE_URL } from "@/features/seo/head";
import { newsPublicPath, newsText, type NewsItem } from "./model";

export function newsImagePath(id: string): string {
  return `/api/news-image/${encodeURIComponent(id)}`;
}

function newsSocialOrigin(): string {
  if (typeof window !== "undefined") return window.location.origin;

  const vercelEnvironment = typeof process !== "undefined" ? process.env["VERCEL_ENV"] : undefined;
  const vercelUrl = typeof process !== "undefined" ? process.env["VERCEL_URL"] : undefined;
  if (vercelEnvironment === "preview" && vercelUrl) return `https://${vercelUrl}`;

  return SITE_URL;
}

export function newsImageUrl(id: string): string {
  return `${newsSocialOrigin()}${newsImagePath(id)}`;
}

function newsDescription(item: NewsItem, lang: Lang): string {
  const text = newsText(item.body, lang).replace(/\s+/g, " ").trim();
  return text.length <= 180 ? text : `${text.slice(0, 177).trimEnd()}…`;
}

export function newsArticleHead(item: NewsItem, lang: Lang) {
  const title = newsText(item.title, lang);
  const description = newsDescription(item, lang);
  const path = newsPublicPath(item.id, lang);
  const image = newsImageUrl(item.id);

  return pageHead({
    path,
    title,
    description,
    imageUrl: image,
    imageAlt: title,
    ogType: "article",
    publishedTime: `${item.news_date}T12:00:00.000Z`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: title,
      description,
      datePublished: item.news_date,
      image: [image],
      mainEntityOfPage: `${SITE_URL}${path}`,
      publisher: {
        "@type": "Organization",
        name: "TGN Services",
        url: SITE_URL,
      },
    },
  });
}

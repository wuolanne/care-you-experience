export const SITE_URL = "https://tgnservices.fi";
export const SOCIAL_IMAGE_URL = `${SITE_URL}/favicon.png`;

const publicIndexingEnabled = import.meta.env["VITE_PUBLIC_SITE_INDEXING_ENABLED"] === "true";

type JsonLd = Record<string, unknown>;

type PageHeadOptions = {
  path: string;
  title: string;
  description: string;
  indexable?: boolean;
  imageUrl?: string;
  imageAlt?: string;
  ogType?: "website" | "article";
  publishedTime?: string;
  jsonLd?: JsonLd;
};

export function pageHead({
  path,
  title,
  description,
  indexable = true,
  imageUrl = SOCIAL_IMAGE_URL,
  imageAlt = "TGN Services",
  ogType = "website",
  publishedTime,
  jsonLd,
}: PageHeadOptions) {
  const canonical = new URL(path, SITE_URL).toString();
  const shouldIndex = indexable && publicIndexingEnabled;

  return {
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: shouldIndex ? "index,follow" : "noindex,nofollow" },
      { property: "og:type", content: ogType },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: canonical },
      { property: "og:image", content: imageUrl },
      { property: "og:image:alt", content: imageAlt },
      ...(publishedTime ? [{ property: "article:published_time", content: publishedTime }] : []),
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: imageUrl },
      { name: "twitter:image:alt", content: imageAlt },
      { name: "twitter:url", content: canonical },
      ...(jsonLd ? [{ "script:ld+json": jsonLd }] : []),
    ],
    links: indexable ? [{ rel: "canonical", href: canonical }] : [],
  };
}

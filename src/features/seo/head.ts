export const SITE_URL = "https://tgnservices.fi";
export const SOCIAL_IMAGE_URL = `${SITE_URL}/favicon.png`;

const publicIndexingEnabled = import.meta.env["VITE_PUBLIC_SITE_INDEXING_ENABLED"] === "true";

type JsonLd = Record<string, unknown>;

type PageHeadOptions = {
  path: string;
  title: string;
  description: string;
  indexable?: boolean;
  jsonLd?: JsonLd;
};

export function pageHead({ path, title, description, indexable = true, jsonLd }: PageHeadOptions) {
  const canonical = new URL(path, SITE_URL).toString();
  const shouldIndex = indexable && publicIndexingEnabled;

  return {
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: shouldIndex ? "index,follow" : "noindex,nofollow" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: canonical },
      { property: "og:image", content: SOCIAL_IMAGE_URL },
      { property: "og:image:alt", content: "TGN Services" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: SOCIAL_IMAGE_URL },
      ...(jsonLd ? [{ "script:ld+json": jsonLd }] : []),
    ],
    links: indexable ? [{ rel: "canonical", href: canonical }] : [],
  };
}

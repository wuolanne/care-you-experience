import { describe, expect, it } from "vitest";
import { newsArticleHead, newsImageUrl } from "./seo";
import type { NewsItem } from "./model";

const item: NewsItem = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  title: { fi: "Uusi palvelu", en: "New service launched" },
  body: { fi: "Palvelu on nyt saatavilla.", en: "The service is now available." },
  news_date: "2026-10-20",
  image_path: "news-image.webp",
  published: true,
};

describe("news article SEO", () => {
  it("uses the requested language and a stable image endpoint", () => {
    const head = newsArticleHead(item, "en");

    expect(newsImageUrl(item.id)).toBe(
      "https://tgnservices.fi/api/news-image/123e4567-e89b-12d3-a456-426614174000",
    );
    expect(head.meta).toEqual(
      expect.arrayContaining([
        { property: "og:title", content: "New service launched" },
        { property: "og:type", content: "article" },
        {
          property: "og:image",
          content: "https://tgnservices.fi/api/news-image/123e4567-e89b-12d3-a456-426614174000",
        },
      ]),
    );
    expect(head.links).toEqual([
      {
        rel: "canonical",
        href: "https://tgnservices.fi/uutiset/en/123e4567-e89b-12d3-a456-426614174000",
      },
    ]);
  });
});

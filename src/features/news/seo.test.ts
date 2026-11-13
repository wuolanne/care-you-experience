import { describe, expect, it } from "vitest";
import { newsArticleHead, newsImagePath, newsImageUrl } from "./seo";
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
    const originalEnvironment = process.env["VERCEL_ENV"];
    const originalUrl = process.env["VERCEL_URL"];
    delete process.env["VERCEL_ENV"];
    delete process.env["VERCEL_URL"];

    try {
      const head = newsArticleHead(item, "en");

      expect(newsImagePath(item.id)).toBe("/api/news-image/123e4567-e89b-12d3-a456-426614174000");
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
    } finally {
      if (originalEnvironment === undefined) delete process.env["VERCEL_ENV"];
      else process.env["VERCEL_ENV"] = originalEnvironment;
      if (originalUrl === undefined) delete process.env["VERCEL_URL"];
      else process.env["VERCEL_URL"] = originalUrl;
    }
  });

  it("keeps public news image URLs deterministic for SSR and the first client render", () => {
    expect(newsImagePath(item.id)).toBe("/api/news-image/123e4567-e89b-12d3-a456-426614174000");
  });

  it("uses the Preview deployment for social images without changing the canonical URL", () => {
    const originalEnvironment = process.env["VERCEL_ENV"];
    const originalUrl = process.env["VERCEL_URL"];
    process.env["VERCEL_ENV"] = "preview";
    process.env["VERCEL_URL"] = "care-you-experience-preview.vercel.app";

    try {
      const head = newsArticleHead(item, "en");
      const image =
        "https://care-you-experience-preview.vercel.app/api/news-image/123e4567-e89b-12d3-a456-426614174000";

      expect(newsImageUrl(item.id)).toBe(image);
      expect(head.meta).toEqual(
        expect.arrayContaining([
          { property: "og:image", content: image },
          {
            property: "og:url",
            content: "https://tgnservices.fi/uutiset/en/123e4567-e89b-12d3-a456-426614174000",
          },
        ]),
      );
      expect(head.links).toEqual([
        {
          rel: "canonical",
          href: "https://tgnservices.fi/uutiset/en/123e4567-e89b-12d3-a456-426614174000",
        },
      ]);
    } finally {
      if (originalEnvironment === undefined) delete process.env["VERCEL_ENV"];
      else process.env["VERCEL_ENV"] = originalEnvironment;
      if (originalUrl === undefined) delete process.env["VERCEL_URL"];
      else process.env["VERCEL_URL"] = originalUrl;
    }
  });
});

import { SITE_URL } from "./head";

export const publicSitemapPages = [
  { path: "/", sitemap: { changefreq: "weekly", priority: 1 } },
  { path: "/care-kotiin", sitemap: { changefreq: "monthly", priority: 0.8 } },
  { path: "/care-yrityksille", sitemap: { changefreq: "monthly", priority: 0.8 } },
  { path: "/hinnoittelu", sitemap: { changefreq: "monthly", priority: 0.8 } },
  { path: "/meista", sitemap: { changefreq: "monthly", priority: 0.7 } },
  { path: "/varaa", sitemap: { changefreq: "monthly", priority: 0.7 } },
  { path: "/tietosuoja", sitemap: { changefreq: "yearly", priority: 0.3 } },
] as const;

export const publicSitemapPaths = publicSitemapPages.map(({ path }) => path);

export type NewsSitemapEntry = { id: string; lang: "fi" | "sv" | "es" | "en" };

function newsSitemapPath(item: NewsSitemapEntry): string {
  return item.lang === "fi" ? `/uutiset/${item.id}` : `/uutiset/${item.lang}/${item.id}`;
}

export function buildSitemapXml(news: readonly NewsSitemapEntry[] = []): string {
  const staticEntries = publicSitemapPages.map(({ path, sitemap }) => ({ path, ...sitemap }));
  const newsEntries = news.map((item) => ({
    path: newsSitemapPath(item),
    changefreq: "monthly",
    priority: 0.6,
  }));

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...[...staticEntries, ...newsEntries].flatMap((entry) => [
      "  <url>",
      `    <loc>${new URL(entry.path, SITE_URL).toString()}</loc>`,
      `    <priority>${entry.priority}</priority>`,
      `    <changefreq>${entry.changefreq}</changefreq>`,
      "  </url>",
    ]),
    "</urlset>",
    "",
  ].join("\n");
}

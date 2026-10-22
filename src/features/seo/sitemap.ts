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

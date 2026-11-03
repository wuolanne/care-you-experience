import { describe, expect, it } from "vitest";
import { buildSitemapXml, publicSitemapPaths } from "./sitemap";

describe("public sitemap routes", () => {
  it("contains only finished public routes", () => {
    expect(publicSitemapPaths).toEqual([
      "/",
      "/care-kotiin",
      "/care-yrityksille",
      "/hinnoittelu",
      "/meista",
      "/varaa",
      "/tietosuoja",
    ]);
  });

  it("does not expose private, authentication, or unfinished routes", () => {
    expect(
      publicSitemapPaths.some(
        (path) =>
          path.startsWith("/admin") ||
          path.startsWith("/auth") ||
          path.startsWith("/reset-password") ||
          path.startsWith("/uutisten-yllapito") ||
          path.includes("palveluseteli"),
      ),
    ).toBe(false);
  });

  it("renders published news paths without inventing modification dates", () => {
    const sitemapXml = buildSitemapXml([
      { id: "123e4567-e89b-12d3-a456-426614174000", lang: "fi" },
      { id: "123e4567-e89b-12d3-a456-426614174000", lang: "en" },
    ]);

    expect(sitemapXml).not.toContain("<lastmod>");
    for (const path of publicSitemapPaths) {
      expect(sitemapXml).toContain(`<loc>https://tgnservices.fi${path}</loc>`);
    }
    expect(sitemapXml).toContain(
      "https://tgnservices.fi/uutiset/123e4567-e89b-12d3-a456-426614174000",
    );
    expect(sitemapXml).toContain(
      "https://tgnservices.fi/uutiset/en/123e4567-e89b-12d3-a456-426614174000",
    );
  });
});

import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { publicSitemapPaths } from "./sitemap";

const sitemapXml = readFileSync(new URL("../../../public/sitemap.xml", import.meta.url), "utf8");

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

  it("does not claim that the build date is the content modification date", () => {
    expect(sitemapXml).not.toContain("<lastmod>");
    for (const path of publicSitemapPaths) {
      expect(sitemapXml).toContain(`<loc>https://tgnservices.fi${path}</loc>`);
    }
  });
});

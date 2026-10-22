import { describe, expect, it } from "vitest";
import { publicSitemapPaths } from "./sitemap";

describe("public sitemap routes", () => {
  it("contains only finished public routes", () => {
    expect(publicSitemapPaths).toEqual([
      "/",
      "/care-kotiin",
      "/care-yrityksille",
      "/hinnoittelu",
      "/meista",
      "/osta",
      "/tarjouspyynto",
      "/varaa",
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
});

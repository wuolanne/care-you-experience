import { describe, expect, it } from "vitest";
import { pageHead } from "./head";

describe("SEO page head", () => {
  it("uses the primary-domain canonical and complete social metadata", () => {
    const head = pageHead({
      path: "/care-kotiin",
      title: "TGN Kotiin",
      description: "Kodinhoitoa ja siivousta.",
    });

    expect(head.links).toEqual([{ rel: "canonical", href: "https://tgnservices.fi/care-kotiin" }]);
    expect(head.meta).toEqual(
      expect.arrayContaining([
        { name: "robots", content: "noindex,nofollow" },
        { property: "og:url", content: "https://tgnservices.fi/care-kotiin" },
        { property: "og:image", content: "https://tgnservices.fi/favicon.png" },
        { name: "twitter:image", content: "https://tgnservices.fi/favicon.png" },
      ]),
    );
  });

  it("can explicitly mark private routes non-indexable", () => {
    const head = pageHead({
      path: "/admin",
      title: "Hallintapaneeli",
      description: "Ylläpito.",
      indexable: false,
    });

    expect(head.links).toEqual([]);
    expect(head.meta).toContainEqual({ name: "robots", content: "noindex,nofollow" });
  });
});

import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const vercelConfig = JSON.parse(
  readFileSync(new URL("../../../vercel.json", import.meta.url), "utf8"),
) as { redirects?: Array<{ source: string; destination: string; permanent: boolean }> };

describe("legacy public route redirects", () => {
  it("uses permanent redirects without reintroducing removed React routes", () => {
    expect(vercelConfig.redirects).toEqual(
      expect.arrayContaining([
        { source: "/osta", destination: "/hinnoittelu", permanent: true },
        { source: "/tarjouspyynto", destination: "/", permanent: true },
      ]),
    );
  });
});

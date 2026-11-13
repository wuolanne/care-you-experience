import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { newsImagePath } from "./seo";

const newsFunctionsSource = readFileSync(new URL("./news.functions.ts", import.meta.url), "utf8");

describe("public news image loading", () => {
  it("uses a stable server proxy instead of time-limited signed URLs", () => {
    expect(newsImagePath("123e4567-e89b-12d3-a456-426614174000")).toBe(
      "/api/news-image/123e4567-e89b-12d3-a456-426614174000",
    );
    expect(newsFunctionsSource).toContain(
      "imageUrl: item.image_path ? newsImagePath(item.id) : null",
    );
    expect(newsFunctionsSource).not.toContain("createSignedUrl");
  });
});

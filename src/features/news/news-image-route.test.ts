import { afterEach, describe, expect, it, vi } from "vitest";
import { Route } from "../../routes/api/news-image/$id";

const newsId = "123e4567-e89b-12d3-a456-426614174000";
const originalUrl = process.env["SUPABASE_URL"];
const originalKey = process.env["SUPABASE_PUBLISHABLE_KEY"];

type NewsImageGet = (args: { params: { id: string } }) => Promise<Response>;

function getHandler() {
  const handler = (
    Route.options as {
      server?: { handlers?: { GET?: NewsImageGet } };
    }
  ).server?.handlers?.GET;
  if (!handler) throw new Error("News image GET handler is not available");
  return handler;
}

afterEach(() => {
  vi.restoreAllMocks();
  if (originalUrl === undefined) delete process.env["SUPABASE_URL"];
  else process.env["SUPABASE_URL"] = originalUrl;
  if (originalKey === undefined) delete process.env["SUPABASE_PUBLISHABLE_KEY"];
  else process.env["SUPABASE_PUBLISHABLE_KEY"] = originalKey;
});

describe("news image route", () => {
  it("returns the published image bytes with an image content type", async () => {
    process.env["SUPABASE_URL"] = "https://supabase.example.test";
    process.env["SUPABASE_PUBLISHABLE_KEY"] = "sb_publishable_test";

    const imageBytes = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
      const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
      if (url.includes("/rest/v1/news?")) {
        return new Response(JSON.stringify([{ image_path: "news-images/test.png" }]), {
          headers: { "content-type": "application/json" },
        });
      }
      if (
        url ===
        "https://supabase.example.test/storage/v1/object/sign/news-images/test.png?token=test"
      ) {
        return new Response(imageBytes, { headers: { "content-type": "image/png" } });
      }
      if (url.includes("/storage/v1/object/sign/news-images/")) {
        return new Response(
          JSON.stringify({ signedURL: "/object/sign/news-images/test.png?token=test" }),
          {
            headers: { "content-type": "application/json" },
          },
        );
      }
      throw new Error(`Unexpected fetch URL: ${url}`);
    });

    const response = await getHandler()({ params: { id: newsId } });

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("image/png");
    expect(response.headers.get("x-content-type-options")).toBe("nosniff");
    expect(new Uint8Array(await response.arrayBuffer())).toEqual(imageBytes);
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("does not expose an image for an unpublished or image-less news item", async () => {
    process.env["SUPABASE_URL"] = "https://supabase.example.test";
    process.env["SUPABASE_PUBLISHABLE_KEY"] = "sb_publishable_test";

    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify([{ image_path: null }]), {
        headers: { "content-type": "application/json" },
      }),
    );

    const response = await getHandler()({ params: { id: newsId } });

    expect(response.status).toBe(404);
  });
});

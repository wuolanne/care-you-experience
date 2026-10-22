import { beforeEach, describe, expect, it, vi } from "vitest";

const { from } = vi.hoisted(() => ({ from: vi.fn() }));

vi.mock("@/integrations/supabase/client", () => ({
  supabase: { from },
}));

import { publicReviewsQuery } from "./queries";

function mockReviewQuery(result: unknown) {
  const query = {
    select: vi.fn(),
    eq: vi.fn(),
    order: vi.fn(),
  };
  query.select.mockReturnValue(query);
  query.eq.mockReturnValue(query);
  query.order.mockReturnValueOnce(query).mockReturnValueOnce(result);
  from.mockReturnValue(query);
  return query;
}

async function runPublicReviewsQuery() {
  return publicReviewsQuery.queryFn!({} as never);
}

describe("publicReviewsQuery", () => {
  beforeEach(() => {
    from.mockReset();
    vi.restoreAllMocks();
  });

  it("requests only published, consented and visible reviews", async () => {
    const query = mockReviewQuery({
      data: [{ id: "review-1", lang: "fi" }],
      error: null,
    });

    const result = await runPublicReviewsQuery();

    expect(query.eq).toHaveBeenNthCalledWith(1, "published", true);
    expect(query.eq).toHaveBeenNthCalledWith(2, "consent_granted", true);
    expect(query.eq).toHaveBeenNthCalledWith(3, "hidden", false);
    expect(result).toEqual({
      reviews: [{ id: "review-1", lang: "fi" }],
      error: false,
    });
  });

  it("returns an explicit error state without exposing database details", async () => {
    mockReviewQuery({
      data: null,
      error: { code: "PGRST205", message: "internal schema detail" },
    });
    const log = vi.spyOn(console, "error").mockImplementation(() => undefined);

    const result = await runPublicReviewsQuery();

    expect(result).toEqual({ reviews: [], error: true });
    expect(log).toHaveBeenCalledWith("[CustomerReviews] Public review query failed", {
      code: "PGRST205",
    });
    expect(log.mock.calls[0]?.[1]).not.toHaveProperty("message");
  });
});

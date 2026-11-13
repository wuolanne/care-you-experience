import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const rootSource = readFileSync(new URL("../routes/__root.tsx", import.meta.url), "utf8");
const homeSource = readFileSync(new URL("../routes/index.tsx", import.meta.url), "utf8");
const footerSource = readFileSync(new URL("../components/SiteFooter.tsx", import.meta.url), "utf8");
const reviewsSource = readFileSync(new URL("../components/CustomerReviews.tsx", import.meta.url), "utf8");
const newsSource = readFileSync(new URL("./news/NewsSection.tsx", import.meta.url), "utf8");

describe("SSR query data handoff", () => {
  it("uses Router loader data as initial data for first client render", () => {
    expect(rootSource).toContain("const [initialContact, initialSocialLinks, initialReviews] = Route.useLoaderData();");
    expect(rootSource).toContain("<CustomerReviews initialReviews={initialReviews} />");
    expect(rootSource).toContain("<SiteFooter initialContact={initialContact} initialManagedLinks={initialSocialLinks} />");
    expect(homeSource).toContain("const [initialNews, initialHomeContent] = Route.useLoaderData();");
    expect(homeSource).toContain('initialData: initialHomeContent');
    expect(homeSource).toContain("<NewsSection initialItems={initialNews} />");
    expect(footerSource).toContain("initialData: initialContact");
    expect(footerSource).toContain("initialData: initialManagedLinks");
    expect(reviewsSource).toContain("initialData: initialReviews");
    expect(newsSource).toContain("initialData: initialItems");
  });
});

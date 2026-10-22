import { expect, test } from "@playwright/test";

const publicRoutes = ["/", "/care-kotiin", "/care-yrityksille", "/care-palveluseteli", "/meista"];

for (const route of publicRoutes) {
  test(`public route ${route} renders on desktop and mobile`, async ({ page }) => {
    const response = await page.goto(route, { waitUntil: "domcontentloaded" });

    expect(response, `No response received for ${route}`).toBeTruthy();
    expect(response?.status(), `Server error on ${route}`).toBeLessThan(500);
    await expect(page.locator("body")).toBeVisible();
  });
}

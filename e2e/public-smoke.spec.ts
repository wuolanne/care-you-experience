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

test("does not load Google Analytics in local development", async ({ page }) => {
  const analyticsRequests: string[] = [];
  page.on("request", (request) => {
    if (/googletagmanager|google-analytics/.test(request.url())) {
      analyticsRequests.push(request.url());
    }
  });

  await page.goto("/", { waitUntil: "domcontentloaded" });

  expect(analyticsRequests).toEqual([]);
});

const footerContactTranslations = {
  fi: "Yhteystiedot",
  sv: "Kontakt",
  es: "Contacto",
  en: "Contact",
} as const;

test("footer contact alignment stays responsive across languages and viewports", async ({
  page,
}) => {
  const viewports = [320, 375, 390, 430, 768, 1440];

  for (const width of viewports) {
    await page.setViewportSize({ width, height: 900 });

    for (const [language, heading] of Object.entries(footerContactTranslations)) {
      await page.goto("/", { waitUntil: "domcontentloaded" });
      await page.evaluate((lang) => window.localStorage.setItem("cys-lang", lang), language);
      await page.reload({ waitUntil: "domcontentloaded" });

      const contactHeading = page.getByRole("contentinfo").getByText(heading, { exact: true });
      await expect(contactHeading).toBeVisible();

      const alignment = await contactHeading.locator("xpath=..").evaluate((column) => {
        const columnRect = column.getBoundingClientRect();
        const headingRect = column.querySelector(":scope > p")?.getBoundingClientRect();
        const list = column.querySelector(":scope > div");
        const itemRects = Array.from(list?.children ?? []).map((item) => {
          const rect = item.getBoundingClientRect();
          return { left: rect.left, right: rect.right };
        });

        return {
          columnCenter: (columnRect.left + columnRect.right) / 2,
          headingLeft: headingRect?.left ?? null,
          headingCenter: headingRect ? (headingRect.left + headingRect.right) / 2 : null,
          itemCenters: itemRects.map((rect) => (rect.left + rect.right) / 2),
          itemLefts: itemRects.map((rect) => rect.left),
        };
      });

      expect(alignment.headingCenter).not.toBeNull();
      expect(alignment.itemCenters.length).toBeGreaterThanOrEqual(4);

      if (width < 768) {
        expect(Math.abs(alignment.headingCenter! - alignment.columnCenter)).toBeLessThan(2);
        for (const center of alignment.itemCenters) {
          expect(Math.abs(center - alignment.columnCenter)).toBeLessThan(2);
        }
      } else {
        expect(Math.max(...alignment.itemLefts) - Math.min(...alignment.itemLefts)).toBeLessThan(2);
        expect(Math.abs(alignment.headingLeft! - alignment.itemLefts[0]!)).toBeLessThan(2);
      }
    }
  }
});

const billingTranslations = {
  fi: { heading: "Laskutustiedot", businessId: "Y-tunnus" },
  sv: { heading: "Faktureringsuppgifter", businessId: "Y-tunnus" },
  es: { heading: "Datos de facturación", businessId: "NIF" },
  en: { heading: "Billing details", businessId: "Business ID" },
} as const;

test("about page shows ordered billing details in every language", async ({ page }) => {
  for (const [lang, copy] of Object.entries(billingTranslations)) {
    await page.goto("/meista", { waitUntil: "domcontentloaded" });
    await page.evaluate((language) => window.localStorage.setItem("cys-lang", language), lang);
    await page.reload({ waitUntil: "domcontentloaded" });

    await expect(page.getByRole("heading", { name: copy.heading, level: 3 })).toBeVisible();
    const billingDetails = page.getByTestId("billing-details");
    await expect(billingDetails.locator("p")).toHaveText([
      "T&G Nordic Services",
      "Alisa-pankki FI20 7140 1420 0611 43",
      `${copy.businessId}: 3664346-2`,
    ]);
    expect(
      await billingDetails.evaluate((element) => element.scrollWidth <= element.clientWidth),
    ).toBe(true);
  }
});

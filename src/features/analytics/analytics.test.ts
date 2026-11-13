import { describe, expect, it } from "vitest";
import {
  ANALYTICS_CONSENT_STORAGE_KEY,
  initializeAnalytics,
  readAnalyticsConsent,
  shouldEnableAnalytics,
  shouldShowAnalyticsConsent,
  trackPageView,
  writeAnalyticsConsent,
} from "./analytics";

function createStorage(initial: string | null = null) {
  let value = initial;
  return {
    getItem: (_key: string) => value,
    setItem: (_key: string, nextValue: string) => {
      value = nextValue;
    },
  };
}

describe("analytics runtime guard", () => {
  const production = {
    measurementId: "G-3DG3SZ1G35",
    dev: false,
    mode: "production",
    vercelEnv: "production",
  };

  it("enables GA only for a production build with a measurement ID", () => {
    expect(shouldEnableAnalytics(production)).toBe(true);
    expect(shouldEnableAnalytics({ ...production, dev: true })).toBe(false);
    expect(shouldEnableAnalytics({ ...production, mode: "development" })).toBe(false);
    expect(shouldEnableAnalytics({ ...production, vercelEnv: "preview" })).toBe(false);
    expect(shouldEnableAnalytics({ ...production, measurementId: "" })).toBe(false);
  });

  it("shows the consent UI in Preview while keeping GA disabled", () => {
    const preview = { ...production, measurementId: "", vercelEnv: "preview" };

    expect(shouldShowAnalyticsConsent(preview)).toBe(true);
    expect(shouldEnableAnalytics(preview)).toBe(false);
    expect(shouldShowAnalyticsConsent({ ...preview, dev: true })).toBe(false);
  });
});

describe("analytics consent persistence", () => {
  it("accepts only explicit consent values", () => {
    expect(readAnalyticsConsent(createStorage("granted"))).toBe("granted");
    expect(readAnalyticsConsent(createStorage("denied"))).toBe("denied");
    expect(readAnalyticsConsent(createStorage("unknown"))).toBeNull();
  });

  it("stores the choice under the dedicated consent key", () => {
    const storage = createStorage();
    writeAnalyticsConsent(storage, "granted");

    expect(storage.getItem(ANALYTICS_CONSENT_STORAGE_KEY)).toBe("granted");

    writeAnalyticsConsent(storage, "denied");
    expect(storage.getItem(ANALYTICS_CONSENT_STORAGE_KEY)).toBe("denied");
  });
});

describe("analytics browser integration", () => {
  it("queues gtag commands as arguments objects for Google Tag", () => {
    const originalWindow = globalThis.window;
    const originalDocument = globalThis.document;
    const fakeWindow = { dataLayer: [] as unknown[] } as unknown as Window;
    const fakeDocument = {
      createElement: () => ({ id: "", async: false, src: "" }),
      getElementById: () => null,
      head: { appendChild: () => undefined },
    } as unknown as Document;

    Object.defineProperty(globalThis, "window", { configurable: true, value: fakeWindow });
    Object.defineProperty(globalThis, "document", { configurable: true, value: fakeDocument });

    try {
      expect(initializeAnalytics("G-3DG3SZ1G35")).toBe(true);
      const firstCommand = fakeWindow.dataLayer?.[0];

      expect(Array.isArray(firstCommand)).toBe(false);
      expect(Object.prototype.toString.call(firstCommand)).toBe("[object Arguments]");
      expect(Array.from(firstCommand as IArguments)).toEqual([
        "consent",
        "default",
        expect.objectContaining({ analytics_storage: "denied" }),
      ]);
    } finally {
      if (originalWindow === undefined) delete (globalThis as { window?: Window }).window;
      else
        Object.defineProperty(globalThis, "window", { configurable: true, value: originalWindow });
      if (originalDocument === undefined) delete (globalThis as { document?: Document }).document;
      else
        Object.defineProperty(globalThis, "document", {
          configurable: true,
          value: originalDocument,
        });
    }
  });

  it("sends one page view per route and allows the next route", () => {
    const originalWindow = globalThis.window;
    const calls: unknown[][] = [];
    const fakeWindow = {
      gtag: (...args: unknown[]) => calls.push(args),
      __tgnAnalyticsInitialized: true,
      __tgnLastTrackedPage: undefined,
      location: { hostname: "example.test" },
    } as unknown as Window;
    Object.defineProperty(globalThis, "window", { configurable: true, value: fakeWindow });

    try {
      const firstPage = {
        path: "/",
        location: "https://example.test/",
        title: "Home",
      };
      expect(trackPageView(firstPage)).toBe(true);
      expect(trackPageView(firstPage)).toBe(false);
      expect(
        trackPageView({
          ...firstPage,
          path: "/palvelut",
          location: "https://example.test/palvelut",
          title: "Services",
        }),
      ).toBe(true);
      expect(
        calls.filter(([command, event]) => command === "event" && event === "page_view"),
      ).toHaveLength(2);
    } finally {
      if (originalWindow === undefined) delete (globalThis as { window?: Window }).window;
      else
        Object.defineProperty(globalThis, "window", { configurable: true, value: originalWindow });
    }
  });
});

import { describe, expect, it } from "vitest";
import {
  ANALYTICS_CONSENT_STORAGE_KEY,
  readAnalyticsConsent,
  shouldEnableAnalytics,
  shouldShowAnalyticsConsent,
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
  });
});

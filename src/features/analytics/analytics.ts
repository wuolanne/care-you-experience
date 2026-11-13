export const ANALYTICS_CONSENT_STORAGE_KEY = "tgn-analytics-consent";
export const ANALYTICS_SCRIPT_ID = "tgn-google-analytics";

export type AnalyticsConsent = "granted" | "denied";
export type StoredAnalyticsConsent = AnalyticsConsent | null;

export type AnalyticsRuntime = {
  measurementId?: string;
  dev: boolean;
  mode: string;
  vercelEnv?: string;
};

export const DEFAULT_CONSENT = {
  ad_storage: "denied",
  analytics_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
} as const;

const GRANTED_ANALYTICS_CONSENT = {
  ...DEFAULT_CONSENT,
  analytics_storage: "granted",
} as const;

type ConsentStorage = Pick<Storage, "getItem" | "setItem">;

export type PageView = {
  path: string;
  location: string;
  title: string;
};

type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
    __tgnAnalyticsInitialized?: boolean;
    __tgnLastTrackedPage?: string;
  }
}

export function shouldEnableAnalytics(runtime: AnalyticsRuntime): boolean {
  const measurementId = runtime.measurementId?.trim();

  return Boolean(
    measurementId &&
    !runtime.dev &&
    runtime.mode === "production" &&
    runtime.vercelEnv !== "preview",
  );
}

export function shouldShowAnalyticsConsent(runtime: AnalyticsRuntime): boolean {
  return !runtime.dev && runtime.mode === "production";
}

export function readAnalyticsConsent(storage: ConsentStorage): StoredAnalyticsConsent {
  try {
    const value = storage.getItem(ANALYTICS_CONSENT_STORAGE_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

export function writeAnalyticsConsent(storage: ConsentStorage, consent: AnalyticsConsent): void {
  try {
    storage.setItem(ANALYTICS_CONSENT_STORAGE_KEY, consent);
  } catch {
    // Analytics remains consent-gated for this session even if storage is unavailable.
  }
}

function createGtag(): Gtag {
  window.dataLayer = window.dataLayer ?? [];
  return function gtag() {
    // Google Tag expects each queued command as the arguments object.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer?.push(arguments);
  };
}

export function initializeAnalytics(measurementId: string): boolean {
  if (typeof window === "undefined" || typeof document === "undefined") return false;

  const id = measurementId.trim();
  if (!id) return false;

  window.gtag = window.gtag ?? createGtag();

  if (!window.__tgnAnalyticsInitialized) {
    window.gtag("consent", "default", DEFAULT_CONSENT);
    window.gtag("consent", "update", GRANTED_ANALYTICS_CONSENT);
    window.gtag("js", new Date());
    window.gtag("config", id, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });

    if (!document.getElementById(ANALYTICS_SCRIPT_ID)) {
      const script = document.createElement("script");
      script.id = ANALYTICS_SCRIPT_ID;
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
      document.head.appendChild(script);
    }

    window.__tgnAnalyticsInitialized = true;
  }

  return true;
}

export function trackPageView(page: PageView): boolean {
  if (typeof window === "undefined" || !window.gtag || !window.__tgnAnalyticsInitialized) {
    return false;
  }

  if (window.__tgnLastTrackedPage === page.location) return false;

  window.__tgnLastTrackedPage = page.location;

  window.gtag("event", "page_view", {
    page_title: page.title,
    page_location: page.location,
    page_path: page.path,
  });
  return true;
}

function deleteCookie(name: string, domain?: string): void {
  const domainPart = domain ? `; domain=${domain}` : "";
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domainPart}`;
}

function deleteAnalyticsCookies(measurementId: string): void {
  const normalizedId = measurementId.replace(/^G-/i, "").replace(/[^a-z0-9]/gi, "_");
  const cookieNames = ["_ga", `_ga_${normalizedId}`];
  const hostname = window.location.hostname;

  for (const name of cookieNames) {
    deleteCookie(name);
    if (hostname && hostname !== "localhost" && hostname !== "127.0.0.1") {
      deleteCookie(name, hostname);
      deleteCookie(name, `.${hostname}`);
    }
  }
}

export function revokeAnalytics(measurementId: string): void {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  window.gtag?.("consent", "update", DEFAULT_CONSENT);
  window.__tgnAnalyticsInitialized = false;
  delete window.__tgnLastTrackedPage;
  deleteAnalyticsCookies(measurementId);
}

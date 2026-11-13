import { useRouterState } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { useLang } from "@/i18n/LanguageProvider";
import {
  initializeAnalytics,
  readAnalyticsConsent,
  revokeAnalytics,
  shouldEnableAnalytics,
  shouldShowAnalyticsConsent,
  trackPageView,
  writeAnalyticsConsent,
  type AnalyticsConsent,
  type AnalyticsRuntime,
} from "./analytics";
import { AnalyticsConsentContext } from "./analytics-context";

const measurementId = (import.meta.env.VITE_GA_MEASUREMENT_ID ?? "").trim();
const analyticsRuntime: AnalyticsRuntime = {
  measurementId,
  dev: import.meta.env.DEV,
  mode: import.meta.env.MODE,
  vercelEnv: import.meta.env.VERCEL_ENV ?? "",
};
const analyticsEnabled = shouldEnableAnalytics(analyticsRuntime);
const consentUiAvailable = shouldShowAnalyticsConsent(analyticsRuntime);

export function AnalyticsConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<AnalyticsConsent | null>(null);
  const [isConsentLoaded, setIsConsentLoaded] = useState(!consentUiAvailable);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    if (!consentUiAvailable) return;

    try {
      setConsent(readAnalyticsConsent(window.localStorage));
    } catch {
      setConsent(null);
    } finally {
      setIsConsentLoaded(true);
    }
  }, []);

  const chooseConsent = (nextConsent: AnalyticsConsent) => {
    if (!consentUiAvailable) return;

    try {
      writeAnalyticsConsent(window.localStorage, nextConsent);
    } catch {
      // The state still applies for this session when browser storage is blocked.
    }
    setConsent(nextConsent);
    setSettingsOpen(false);
  };

  const contextValue = useMemo(
    () => ({
      isAvailable: consentUiAvailable,
      openSettings: () => {
        if (consentUiAvailable) setSettingsOpen(true);
      },
    }),
    [],
  );

  return (
    <AnalyticsConsentContext.Provider value={contextValue}>
      {children}
      <AnalyticsTracker consent={consent} analyticsEnabled={analyticsEnabled} />
      {consentUiAvailable && isConsentLoaded && (consent === null || settingsOpen) && (
        <AnalyticsConsentBanner onChoose={chooseConsent} isSettings={consent !== null} />
      )}
    </AnalyticsConsentContext.Provider>
  );
}

function AnalyticsTracker({
  consent,
  analyticsEnabled,
}: {
  consent: AnalyticsConsent | null;
  analyticsEnabled: boolean;
}) {
  const routeHref = useRouterState({ select: (state) => state.location.href });
  const lastTrackedPage = useRef<string | null>(null);

  useEffect(() => {
    if (!analyticsEnabled || consent !== "granted") return;

    if (!initializeAnalytics(measurementId)) return;

    const page = new URL(routeHref, window.location.origin);
    const pageKey = page.href;
    if (lastTrackedPage.current === pageKey) return;

    lastTrackedPage.current = pageKey;
    trackPageView({
      path: `${page.pathname}${page.search}${page.hash}`,
      location: page.href,
      title: document.title,
    });
  }, [analyticsEnabled, consent, routeHref]);

  useEffect(() => {
    if (!analyticsEnabled || consent !== "denied") return;

    lastTrackedPage.current = null;
    revokeAnalytics(measurementId);
  }, [analyticsEnabled, consent]);

  return null;
}

function AnalyticsConsentBanner({
  onChoose,
  isSettings,
}: {
  onChoose: (consent: AnalyticsConsent) => void;
  isSettings: boolean;
}) {
  const { tr } = useLang();

  return (
    <section
      role="dialog"
      aria-labelledby="analytics-consent-title"
      className="fixed inset-x-4 bottom-4 z-[60] mx-auto max-w-2xl rounded-sm border border-border bg-background p-5 shadow-[var(--shadow-soft)] md:inset-x-auto md:right-6 md:p-6"
    >
      <h2 id="analytics-consent-title" className="text-xl text-primary">
        {isSettings ? tr.analyticsConsent.settings : tr.analyticsConsent.title}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {tr.analyticsConsent.body}{" "}
        <Link to="/tietosuoja" className="underline underline-offset-4 hover:text-primary">
          {tr.analyticsConsent.privacyLink}
        </Link>
        .
      </p>
      <div className="mt-5 flex flex-wrap justify-end gap-3">
        <button
          type="button"
          onClick={() => onChoose("denied")}
          className="rounded-sm border border-border px-4 py-2 text-sm text-foreground transition-colors hover:border-primary hover:text-primary"
        >
          {tr.analyticsConsent.reject}
        </button>
        <button
          type="button"
          onClick={() => onChoose("granted")}
          className="rounded-sm bg-primary px-4 py-2 text-sm text-primary-foreground transition-opacity hover:opacity-90"
        >
          {tr.analyticsConsent.accept}
        </button>
      </div>
    </section>
  );
}

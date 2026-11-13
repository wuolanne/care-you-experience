import { createContext, useContext } from "react";

export type AnalyticsConsentContextValue = {
  isAvailable: boolean;
  openSettings: () => void;
};

export const AnalyticsConsentContext = createContext<AnalyticsConsentContextValue>({
  isAvailable: false,
  openSettings: () => {},
});

export function useAnalyticsConsent() {
  return useContext(AnalyticsConsentContext);
}

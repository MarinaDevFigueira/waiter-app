import { useState } from "react";

const CONSENT_KEY = "cookie_consent";

export type CookieConsentStatus = "accepted" | "declined" | null;

function getStoredConsent(): CookieConsentStatus {
  const stored = localStorage.getItem(CONSENT_KEY);
  if (stored === "accepted" || stored === "declined") return stored;
  return null;
}

export function useCookieConsent() {
  const [consent, setConsent] = useState<CookieConsentStatus>(getStoredConsent);

  const hasConsented = consent !== null;

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setConsent("accepted");
  };

  const decline = () => {
    localStorage.setItem(CONSENT_KEY, "declined");
    setConsent("declined");
  };

  return { consent, hasConsented, accept, decline };
}

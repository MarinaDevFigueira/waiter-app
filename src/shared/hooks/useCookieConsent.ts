import { useEffect, useState } from "react";
import { cookieConsentObservable, type CookieConsentStatus } from "@/shared/subjects/cookie-consent.subject";

export type { CookieConsentStatus };

export function useCookieConsent() {
  const [consent, setConsent] = useState<CookieConsentStatus>(cookieConsentObservable.getValue);

  useEffect(() => {
    const subscription = cookieConsentObservable.subscribe(setConsent);
    return () => subscription.unsubscribe();
  }, []);

  const isAccepted = consent === "accepted";
  const isDeclined = consent === "declined";
  const isPending = consent === null;

  return {
    consent,
    isAccepted,
    isDeclined,
    isPending,
    accept: cookieConsentObservable.accept,
    decline: cookieConsentObservable.decline,
    reset: cookieConsentObservable.reset,
  };
}

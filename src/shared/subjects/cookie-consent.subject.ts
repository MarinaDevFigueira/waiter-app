import { BehaviorSubject, type Subscription } from "rxjs";
import { StorageKeys } from "@/shared/constants/storage-keys";

export type CookieConsentStatus = "accepted" | "declined" | null;

function getStoredConsent(): CookieConsentStatus {
  const stored = localStorage.getItem(StorageKeys.COOKIE_CONSENT);
  if (stored === "accepted" || stored === "declined") return stored;
  return null;
}

const cookieConsentSubject = new BehaviorSubject<CookieConsentStatus>(getStoredConsent());

export const cookieConsentObservable = {
  subscribe: (callback: (value: CookieConsentStatus) => void): Subscription =>
    cookieConsentSubject.subscribe(callback),
  getValue: (): CookieConsentStatus => cookieConsentSubject.getValue(),
  accept: (): void => {
    localStorage.setItem(StorageKeys.COOKIE_CONSENT, "accepted");
    cookieConsentSubject.next("accepted");
  },
  decline: (): void => {
    localStorage.setItem(StorageKeys.COOKIE_CONSENT, "declined");
    cookieConsentSubject.next("declined");
  },
  reset: (): void => {
    localStorage.removeItem(StorageKeys.COOKIE_CONSENT);
    cookieConsentSubject.next(null);
  },
};

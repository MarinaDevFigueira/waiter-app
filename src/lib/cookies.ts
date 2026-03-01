const cookieDomain = import.meta.env.VITE_COOKIE_DOMAIN;
const hostname = window.location.hostname;
const isLocalhost = hostname === "localhost" || hostname === "127.0.0.1";
const domainAttr = cookieDomain && !isLocalhost ? `;Domain=${cookieDomain}` : "";

export const cookies = {
  set: (name: string, value: string, days = 365): void => {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    const isSecure = window.location.protocol === "https:";
    const secureAttr = isSecure ? ";Secure" : "";
    document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax${secureAttr}${domainAttr}`;
  },

  get: (name: string): string | null => {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(";");

    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      const startsWithSpace = c.charAt(0) === " ";
      if (startsWithSpace) {
        c = c.substring(1);
      }
      const isTargetCookie = c.indexOf(nameEQ) === 0;
      if (isTargetCookie) {
        return c.substring(nameEQ.length);
      }
    }
    return null;
  },

  remove: (name: string): void => {
    const isSecure = window.location.protocol === "https:";
    const secureAttr = isSecure ? ";Secure" : "";
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=Lax${secureAttr}${domainAttr}`;
  },

  safeClearAll: (): void => {
    const cookiesArray = document.cookie.split(";");
    const isSecure = window.location.protocol === "https:";
    const secureAttr = isSecure ? ";Secure" : "";

    for (let i = 0; i < cookiesArray.length; i++) {
      const cookie = cookiesArray[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
      const isLanguageCookie = name === "user_language";
      if (!isLanguageCookie) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=Lax${secureAttr}${domainAttr}`;
      }
    }
  },
};

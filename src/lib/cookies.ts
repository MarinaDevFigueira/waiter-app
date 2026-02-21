export const cookies = {
  set: (name: string, value: string, days = 365): void => {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/`;
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
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
  },
};

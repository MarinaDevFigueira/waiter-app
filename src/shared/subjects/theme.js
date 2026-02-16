import { BehaviorSubject } from "rxjs";
import { StorageKeys } from "@/shared/constants/storage-keys";

const getSystemTheme = () => {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
};

const getStoredTheme = () => {
  const stored = sessionStorage.getItem(StorageKeys.THEME);
  const isValidTheme = stored === "light" || stored === "dark";
  if (isValidTheme) {
    return stored;
  }
  return null;
};

const getInitialTheme = () => {
  const storedTheme = getStoredTheme();
  const hasStoredTheme = storedTheme !== null;
  if (hasStoredTheme) {
    return storedTheme;
  }
  return getSystemTheme();
};

const applyTheme = (theme) => {
  const isDark = theme === "dark";
  if (isDark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};

const initialTheme = getInitialTheme();
applyTheme(initialTheme);

const themeSubject = new BehaviorSubject(initialTheme);

export const themeObservable = {
  subscribe: (callback) => themeSubject.subscribe(callback),
  getValue: () => themeSubject.getValue(),
  setTheme: (theme) => {
    const isValidTheme = theme === "light" || theme === "dark";
    if (!isValidTheme) {
      return;
    }
    sessionStorage.setItem(StorageKeys.THEME, theme);
    applyTheme(theme);
    themeSubject.next(theme);
  },
  toggleTheme: () => {
    const currentTheme = themeSubject.getValue();
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    themeObservable.setTheme(newTheme);
  },
};

import { BehaviorSubject, type Subscription } from "rxjs";
import { StorageKeys } from "@/shared/constants/storage-keys";

type Theme = "light" | "dark";

const getSystemTheme = (): Theme => {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
};

const getStoredTheme = (): Theme | null => {
  const stored = sessionStorage.getItem(StorageKeys.THEME);
  const isValidTheme = stored === "light" || stored === "dark";
  if (isValidTheme) {
    return stored as Theme;
  }
  return null;
};

const getInitialTheme = (): Theme => {
  const storedTheme = getStoredTheme();
  const hasStoredTheme = storedTheme !== null;
  if (hasStoredTheme) {
    return storedTheme;
  }
  return getSystemTheme();
};

const applyTheme = (theme: Theme): void => {
  const isDark = theme === "dark";
  if (isDark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};

const initialTheme = getInitialTheme();
applyTheme(initialTheme);

const themeSubject = new BehaviorSubject<Theme>(initialTheme);

export const themeObservable = {
  subscribe: (callback: (value: Theme) => void): Subscription =>
    themeSubject.subscribe(callback),
  getValue: (): Theme => themeSubject.getValue(),
  setTheme: (theme: Theme): void => {
    const isValidTheme = theme === "light" || theme === "dark";
    if (!isValidTheme) {
      return;
    }
    sessionStorage.setItem(StorageKeys.THEME, theme);
    applyTheme(theme);
    themeSubject.next(theme);
  },
  toggleTheme: (): void => {
    const currentTheme = themeSubject.getValue();
    const newTheme: Theme = currentTheme === "dark" ? "light" : "dark";
    themeObservable.setTheme(newTheme);
  },
};

export type { Theme };

import { BehaviorSubject } from "rxjs";
import { StorageKeys } from "@/shared/constants/storage-keys";

const getSystemTheme = () => {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
};

const getStoredTheme = () => {
  const stored = sessionStorage.getItem(StorageKeys.THEME);
  const isStoredValid = stored === "light" || stored === "dark";
  if (isStoredValid) {
    return stored;
  }
  return null;
};

const getInitialTheme = () => {
  const storedTheme = getStoredTheme();
  if (storedTheme !== null) {
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

export const themeSubject = new BehaviorSubject(initialTheme);

export const setTheme = (theme) => {
  const isValidTheme = theme === "light" || theme === "dark";
  if (!isValidTheme) {
    return;
  }

  sessionStorage.setItem(StorageKeys.THEME, theme);
  applyTheme(theme);
  themeSubject.next(theme);
};

export const getTheme = () => {
  return themeSubject.getValue();
};

export const toggleTheme = () => {
  const currentTheme = getTheme();
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  setTheme(newTheme);
};

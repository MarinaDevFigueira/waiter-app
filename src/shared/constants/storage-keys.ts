export const StorageKeys = Object.freeze({
  AUTH: "auth",
  SIDEBAR_MINIMIZED: "sidebar-minimized",
  THEME: "theme",
  LANGUAGE: "language",
});

export type StorageKey = (typeof StorageKeys)[keyof typeof StorageKeys];

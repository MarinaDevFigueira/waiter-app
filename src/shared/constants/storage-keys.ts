export const StorageKeys = Object.freeze({
  AUTH: "auth",
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  SIDEBAR_MINIMIZED: "sidebar-minimized",
  THEME: "theme",
  LANGUAGE: "language",
});

export type StorageKey = (typeof StorageKeys)[keyof typeof StorageKeys];

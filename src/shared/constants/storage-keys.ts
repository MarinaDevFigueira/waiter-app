export const StorageKeys = Object.freeze({
  AUTH: "auth",
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  SIDEBAR_MINIMIZED: "sidebar-minimized",
  THEME: "theme",
  LANGUAGE: "language",
  ORDERS_VIEW: "orders-view",
  CART: "cart",
  BUSINESS_ID: "business_id",
  BUSINESS_NAME: "business_name",
  BUSINESS_ADDRESS: "business_address",
  COOKIE_CONSENT: "cookie_consent",
  USER_NAME: "user_name",
  USER_ID: "user_id",
  USER_EMAIL: "user_email",
  USER_ROLE: "user_role",
});

export type StorageKey = (typeof StorageKeys)[keyof typeof StorageKeys];

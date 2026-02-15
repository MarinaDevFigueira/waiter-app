import { BehaviorSubject } from "rxjs";
import { StorageKeys } from "@/shared/constants/storage-keys";

const getStoredAuth = () => {
  const stored = sessionStorage.getItem(StorageKeys.AUTH);
  const isStoredValid = stored !== null;
  if (isStoredValid) {
    return JSON.parse(stored);
  }
  return null;
};

const initialAuth = getStoredAuth();

export const authSubject = new BehaviorSubject(initialAuth);

export const setAuth = (authData) => {
  const hasAuthData = authData !== null;
  if (hasAuthData) {
    sessionStorage.setItem(StorageKeys.AUTH, JSON.stringify(authData));
  } else {
    sessionStorage.removeItem(StorageKeys.AUTH);
  }
  authSubject.next(authData);
};

export const clearAuth = () => {
  setAuth(null);
};

export const getAuth = () => {
  return authSubject.getValue();
};

export const isAuthenticated = () => {
  const auth = getAuth();
  return auth !== null;
};

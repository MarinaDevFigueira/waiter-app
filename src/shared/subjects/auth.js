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

const authSubject = new BehaviorSubject(initialAuth);

export const authObservable = {
  subscribe: (callback) => authSubject.subscribe(callback),
  getValue: () => authSubject.getValue(),
  setAuth: (authData) => {
    const hasAuthData = authData !== null;
    if (hasAuthData) {
      sessionStorage.setItem(StorageKeys.AUTH, JSON.stringify(authData));
    } else {
      sessionStorage.removeItem(StorageKeys.AUTH);
    }
    authSubject.next(authData);
  },
  clearAuth: () => {
    sessionStorage.removeItem(StorageKeys.AUTH);
    authSubject.next(null);
  },
  isAuthenticated: () => {
    const auth = authSubject.getValue();
    return auth !== null;
  },
};

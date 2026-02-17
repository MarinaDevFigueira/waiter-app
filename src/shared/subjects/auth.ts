import { BehaviorSubject, type Subscription } from "rxjs";
import { StorageKeys } from "@/shared/constants/storage-keys";
import type { UserProfile } from "@/shared/constants/user-profile";

interface AuthData {
  name: string;
  profile: UserProfile;
  username: string;
}

const getStoredAuth = (): AuthData | null => {
  const stored = sessionStorage.getItem(StorageKeys.AUTH);
  const isStoredValid = stored !== null;
  if (isStoredValid) {
    return JSON.parse(stored) as AuthData;
  }
  return null;
};

const initialAuth = getStoredAuth();

const authSubject = new BehaviorSubject<AuthData | null>(initialAuth);

export const authObservable = {
  subscribe: (callback: (value: AuthData | null) => void): Subscription =>
    authSubject.subscribe(callback),
  getValue: (): AuthData | null => authSubject.getValue(),
  setAuth: (authData: AuthData | null): void => {
    const hasAuthData = authData !== null;
    if (hasAuthData) {
      sessionStorage.setItem(StorageKeys.AUTH, JSON.stringify(authData));
    } else {
      sessionStorage.removeItem(StorageKeys.AUTH);
    }
    authSubject.next(authData);
  },
  clearAuth: (): void => {
    sessionStorage.removeItem(StorageKeys.AUTH);
    sessionStorage.removeItem(StorageKeys.ACCESS_TOKEN);
    sessionStorage.removeItem(StorageKeys.REFRESH_TOKEN);
    authSubject.next(null);
  },
  isAuthenticated: (): boolean => {
    const auth = authSubject.getValue();
    return auth !== null;
  },
};

export type { AuthData };

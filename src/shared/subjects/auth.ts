import { BehaviorSubject, type Subscription } from "rxjs";
import { StorageKeys } from "@/shared/constants/storage-keys";
import { UserRoleEnum } from "@/shared/enums/user-role.enum";
import { cookies } from "@/lib/cookies";

export const roleToProfile: Record<string, UserRoleEnum> = {
  admin: UserRoleEnum.ADMIN,
  table: UserRoleEnum.TABLE,
  kitchen: UserRoleEnum.KITCHEN,
  customer: UserRoleEnum.CUSTOMER,
  attendant: UserRoleEnum.ATTENDANT,
  owner: UserRoleEnum.OWNER,
  system_manager: UserRoleEnum.SYSTEM_MANAGER,
};

interface AuthData {
  name: string;
  userId: string;
  email: string | null;
  profile: UserRoleEnum;
  username: string;
}

const getStoredAuth = (): AuthData | null => {
  const userName = cookies.get(StorageKeys.USER_NAME);
  const userId = cookies.get(StorageKeys.USER_ID);
  const userRole = cookies.get(StorageKeys.USER_ROLE);

  const hasRequiredFields = userName !== null && userId !== null && userRole !== null;
  if (!hasRequiredFields) return null;

  const userEmail = cookies.get(StorageKeys.USER_EMAIL);
  const profile = roleToProfile[userRole.toLowerCase()] ?? UserRoleEnum.ATTENDANT;

  return {
    name: userName,
    userId,
    email: userEmail,
    profile,
    username: userEmail ?? userName,
  };
};

const initialAuth = getStoredAuth();

const authSubject = new BehaviorSubject<AuthData | null>(initialAuth);

export const authObservable = {
  subscribe: (callback: (value: AuthData | null) => void): Subscription =>
    authSubject.subscribe(callback),
  getValue: (): AuthData | null => authSubject.getValue(),
  setAuth: (authData: AuthData | null): void => {
    authSubject.next(authData);
  },
  clearAuth: (): void => {
    cookies.remove(StorageKeys.USER_NAME);
    cookies.remove(StorageKeys.USER_ID);
    cookies.remove(StorageKeys.USER_EMAIL);
    cookies.remove(StorageKeys.USER_ROLE);
    cookies.remove(StorageKeys.ACCESS_TOKEN);
    cookies.remove(StorageKeys.REFRESH_TOKEN);
    authSubject.next(null);
  },
  isAuthenticated: (): boolean => {
    const auth = authSubject.getValue();
    return auth !== null;
  },
};

export type { AuthData };

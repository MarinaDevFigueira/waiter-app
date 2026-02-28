import { useEffect, useState } from "react";
import { authObservable, type AuthData } from "@/shared/subjects/auth";
import { UserRoleEnum } from "@/shared/enums/user-role.enum";

interface UseAuthReturn {
  auth: AuthData | null;
  isAuthenticated: boolean;
  profile?: UserRoleEnum;
}

export function useAuth(): UseAuthReturn {
  const [auth, setAuthState] = useState<AuthData | null>(authObservable.getValue());

  useEffect(() => {
    const subscription = authObservable.subscribe(setAuthState);
    return () => subscription.unsubscribe();
  }, []);

  const isAuthenticated = auth !== null;
  const profile = auth?.profile;

  return { auth, isAuthenticated, profile };
}

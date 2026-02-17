import { useEffect, useState } from "react";
import { authObservable, type AuthData } from "@/shared/subjects/auth";

interface UseAuthReturn {
  auth: AuthData | null;
  isAuthenticated: boolean;
  profile: string | null;
}

export function useAuth(): UseAuthReturn {
  const [auth, setAuthState] = useState<AuthData | null>(authObservable.getValue());

  useEffect(() => {
    const subscription = authObservable.subscribe(setAuthState);
    return () => subscription.unsubscribe();
  }, []);

  const isAuthenticated = auth !== null;
  const profile = auth?.profile ?? null;

  return { auth, isAuthenticated, profile };
}

import { useEffect, useState } from "react";
import { authSubject } from "@/shared/subjects/auth";

export function useAuth() {
  const [auth, setAuthState] = useState(authSubject.getValue());

  useEffect(() => {
    const subscription = authSubject.subscribe(setAuthState);
    return () => subscription.unsubscribe();
  }, []);

  const isAuthenticated = auth !== null;
  const profile = auth?.profile ?? null;

  return { auth, isAuthenticated, profile };
}

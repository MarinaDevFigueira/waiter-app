import { useEffect, useState } from "react";
import { authObservable } from "@/shared/subjects/auth";

export function useAuth() {
  const [auth, setAuthState] = useState(authObservable.getValue());

  useEffect(() => {
    const subscription = authObservable.subscribe(setAuthState);
    return () => subscription.unsubscribe();
  }, []);

  const isAuthenticated = auth !== null;
  const profile = auth?.profile ?? null;

  return { auth, isAuthenticated, profile };
}

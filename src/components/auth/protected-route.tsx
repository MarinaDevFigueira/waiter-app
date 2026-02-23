import { Navigate } from "@tanstack/react-router";
import { useAuth } from "@/shared/hooks/useAuth";
import type { UserProfile } from "@/shared/constants/user-profile";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedProfiles: UserProfile[];
}

export function ProtectedRoute({ children, allowedProfiles }: ProtectedRouteProps) {
  const { auth, isAuthenticated } = useAuth();

  const userIsNotAuthenticated = !isAuthenticated;
  if (userIsNotAuthenticated) {
    return <Navigate to="/login" />;
  }

  const userProfile = auth?.profile;
  const isProfileAllowed = allowedProfiles.includes(userProfile as UserProfile);

  const userIsNotAllowed = !isProfileAllowed;
  if (userIsNotAllowed) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}

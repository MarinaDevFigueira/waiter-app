import { Navigate } from "@tanstack/react-router";
import { useAuth } from "@/shared/hooks/useAuth";

export function ProtectedRoute({ children, allowedProfiles }) {
  const { auth, isAuthenticated } = useAuth();

  const userIsNotAuthenticated = !isAuthenticated;
  if (userIsNotAuthenticated) {
    return <Navigate to="/login" />;
  }

  const userProfile = auth?.profile;
  const isProfileAllowed = allowedProfiles.includes(userProfile);

  const userIsNotAllowed = !isProfileAllowed;
  if (userIsNotAllowed) {
    return <Navigate to="/" />;
  }

  return children;
}

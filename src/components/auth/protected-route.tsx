import { Navigate } from "@tanstack/react-router";
import { useAuth } from "@/shared/hooks/useAuth";
import { UserRoleEnum } from "@/shared/enums/user-role.enum";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedProfiles: UserRoleEnum[];
}

export function ProtectedRoute({ children, allowedProfiles }: ProtectedRouteProps) {
  const { auth, isAuthenticated } = useAuth();

  const userIsNotAuthenticated = !isAuthenticated;
  if (userIsNotAuthenticated) {
    return <Navigate to="/login" />;
  }

  const userProfile = auth?.profile;
  const isProfileAllowed = allowedProfiles.includes(userProfile as UserRoleEnum);

  const userIsNotAllowed = !isProfileAllowed;
  if (userIsNotAllowed) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}

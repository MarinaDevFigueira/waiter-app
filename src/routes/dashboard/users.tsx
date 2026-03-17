import { createFileRoute, redirect } from "@tanstack/react-router";
import { authObservable } from "@/shared/subjects/auth";
import { USERS_PAGE_ALLOWED_PROFILES } from "@/shared/constants/users-page-access";
import { UsersPage } from "@/pages/users/page";

export const Route = createFileRoute("/dashboard/users")({
  beforeLoad: ({ location }) => {
    const isAuthenticated = authObservable.isAuthenticated();
    if (!isAuthenticated) {
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }

    const auth = authObservable.getValue();
    const userProfile = auth?.profile;
    const allowedProfiles = USERS_PAGE_ALLOWED_PROFILES as readonly string[];
    const isAllowed = userProfile && allowedProfiles.includes(userProfile);
    const notAllowed = !isAllowed;

    if (notAllowed) {
      throw redirect({ to: "/" });
    }
  },
  component: UsersPage,
});

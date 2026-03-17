import { createFileRoute, redirect } from "@tanstack/react-router";
import { authObservable } from "@/shared/subjects/auth";
import { USERS_PAGE_ALLOWED_PROFILES } from "@/shared/constants/users-page-access";
import { SettingsPage } from "@/pages/settings/page";

export const Route = createFileRoute("/dashboard/settings")({
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
  component: SettingsPage,
});

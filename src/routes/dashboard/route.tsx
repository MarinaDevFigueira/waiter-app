import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/layouts/dashboard-layout/dashboard-layout";
import { DashboardNotFoundPage } from "@/pages/dashboard/page";
import { authObservable } from "@/shared/subjects/auth";
import { DASHBOARD_PROFILES } from "@/shared/hooks/useRoles";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: ({ location }) => {
    const isAuthenticated = authObservable.isAuthenticated();
    if (!isAuthenticated) {
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }

    const auth = authObservable.getValue();
    const userProfile = auth?.profile;
    const allowedProfiles = DASHBOARD_PROFILES as readonly string[];
    const isAllowed = userProfile && allowedProfiles.includes(userProfile);
    const notAllowed = !isAllowed;

    if (notAllowed) {
      throw redirect({ to: "/" });
    }
  },
  component: () => (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  ),
  notFoundComponent: () => <DashboardNotFoundPage />,
});

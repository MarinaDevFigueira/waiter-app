import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { DashboardNotFoundPage } from "@/pages/dashboard/not-found-page";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { UserProfileEnum } from "@/shared/constants/user-profile";

export const Route = createFileRoute("/dashboard")({
  component: () => (
    <ProtectedRoute
      allowedProfiles={[UserProfileEnum.ADMIN, UserProfileEnum.ATTENDANT]}
    >
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </ProtectedRoute>
  ),
  notFoundComponent: () => <DashboardNotFoundPage />,
});

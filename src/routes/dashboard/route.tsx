import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/layouts/dashboard-layout/dashboard-layout";
import { DashboardNotFoundPage } from "@/pages/dashboard/page";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { UserProfileEnum } from "@/shared/constants/user-profile";

export const Route = createFileRoute("/dashboard")({
  component: () => (
    <ProtectedRoute
      allowedProfiles={[
        UserProfileEnum.OWNER,
        UserProfileEnum.ADMIN,
        UserProfileEnum.ATTENDANT,
        UserProfileEnum.COZINHA,
      ]}
    >
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </ProtectedRoute>
  ),
  notFoundComponent: () => <DashboardNotFoundPage />,
});

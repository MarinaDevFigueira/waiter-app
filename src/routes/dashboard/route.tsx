import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/layouts/dashboard-layout/dashboard-layout";
import { DashboardNotFoundPage } from "@/pages/dashboard/page";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { UserRoleEnum } from "@/shared/enums/user-role.enum";

export const Route = createFileRoute("/dashboard")({
  component: () => (
    <ProtectedRoute
      allowedProfiles={[
        UserRoleEnum.OWNER,
        UserRoleEnum.ADMIN,
        UserRoleEnum.ATTENDANT,
        UserRoleEnum.KITCHEN,
        UserRoleEnum.SYSTEM_MANAGER,
        UserRoleEnum.WAITER
      ]}
    >
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </ProtectedRoute>
  ),
  notFoundComponent: () => <DashboardNotFoundPage />,
});

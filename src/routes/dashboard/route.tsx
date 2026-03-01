import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/layouts/dashboard-layout/dashboard-layout";
import { DashboardNotFoundPage } from "@/pages/dashboard/page";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { DASHBOARD_PROFILES } from "@/shared/hooks/useRoles";

export const Route = createFileRoute("/dashboard")({
  component: () => (
    <ProtectedRoute allowedProfiles={[...DASHBOARD_PROFILES]}>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </ProtectedRoute>
  ),
  notFoundComponent: () => <DashboardNotFoundPage />,
});

import { createFileRoute, Navigate } from "@tanstack/react-router";
import { FoodsPage } from "@/pages/foods/page";
import { KitchenPage } from "@/pages/kitchen/page";
import { LoginPage } from "@/pages/login/page";
import { AppLayout } from "@/components/layouts/app-layout/app-layout";
import { useAuth } from "@/shared/hooks/useAuth";
import { useRoles } from "@/shared/hooks/useRoles";

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const { canAccessDashboard, isTable, isCustomer, isKitchen } = useRoles();

  const userIsNotAuthenticated = !isAuthenticated;
  if (userIsNotAuthenticated) {
    return <LoginPage />;
  }

  if (canAccessDashboard) {
    return <Navigate to="/dashboard" />;
  }

  const renderHome = () => {
    const isTableOrCustomer = isTable || isCustomer;
    if (isTableOrCustomer) {
      return <FoodsPage />;
    }

    if (isKitchen) {
      return <KitchenPage />;
    }

    return null;
  };

  return <AppLayout>{renderHome()}</AppLayout>;
};

export const Route = createFileRoute("/")({
  component: HomePage,
});

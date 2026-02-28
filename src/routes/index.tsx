import { createFileRoute, Navigate } from "@tanstack/react-router";
import { FoodsPage } from "@/pages/foods/page";
import { KitchenPage } from "@/pages/kitchen/page";
import { LoginPage } from "@/pages/login/page";
import { AppLayout } from "@/components/layouts/app-layout/app-layout";
import { useAuth } from "@/shared/hooks/useAuth";
import { UserRoleEnum } from "@/shared/enums/user-role.enum";

const HomePage = () => {
  const { auth, isAuthenticated } = useAuth();

  const userIsNotAuthenticated = !isAuthenticated;
  if (userIsNotAuthenticated) {
    return <LoginPage />;
  }

  const profile = auth?.profile;

  const dashboardProfiles = [
    UserRoleEnum.OWNER,
    UserRoleEnum.ADMIN,
    UserRoleEnum.ATTENDANT,
    UserRoleEnum.KITCHEN,
  ];
  const hasDashboardAccess = dashboardProfiles.includes(
    profile as UserRoleEnum,
  );
  if (hasDashboardAccess) {
    return <Navigate to="/dashboard" />;
  }

  const renderHome = () => {
    const isTableOrCustomer =
      profile === UserRoleEnum.TABLE || profile === UserRoleEnum.CUSTOMER;
    if (isTableOrCustomer) {
      return <FoodsPage />;
    }

    const isKitchen = profile === UserRoleEnum.KITCHEN;
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

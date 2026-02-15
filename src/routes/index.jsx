import { createFileRoute, Navigate } from "@tanstack/react-router";
import { FoodsPage } from "@/pages/foods/page";
import { KitchenPage } from "@/pages/kitchen/kitchen-page";
import { LoginPage } from "@/pages/login/login-page";
import { AppLayout } from "@/components/layouts/app-layout";
import { useAuth } from "@/shared/hooks/useAuth";
import { UserProfileEnum } from "@/shared/constants/user-profile";

const HomePage = () => {
  const { auth, isAuthenticated } = useAuth();

  const userIsNotAuthenticated = !isAuthenticated;
  if (userIsNotAuthenticated) {
    return <LoginPage />;
  }

  const profile = auth?.profile;

  const isAdminOrAttendant =
    profile === UserProfileEnum.ADMIN ||
    profile === UserProfileEnum.ATTENDANT;
  if (isAdminOrAttendant) {
    return <Navigate to="/dashboard" />;
  }

  const renderHome = () => {
    const isMesaOrDelivery =
      profile === UserProfileEnum.MESA || profile === UserProfileEnum.DELIVERY;
    if (isMesaOrDelivery) {
      return <FoodsPage />;
    }

    const isKitchen = profile === UserProfileEnum.COZINHA;
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

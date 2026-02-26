import { useAuth } from "@/shared/hooks/useAuth";
import { useOrdersView } from "@/shared/hooks/useOrdersView";
import { UserProfileEnum } from "@/shared/constants/user-profile";
import { OrdersViewEnum } from "@/shared/enums/orders-view.enum";
import { AdminOrdersPage } from "@/pages/orders/admin-orders/page";
import { KitchenOrdersPage } from "@/pages/orders/kitchen-orders/page";

export function OrdersPage() {
  const { auth } = useAuth();
  const { view } = useOrdersView();

  const profile = auth?.profile;

  const ordersAdminProfiles = [
    UserProfileEnum.OWNER,
    UserProfileEnum.ADMIN,
    UserProfileEnum.ATTENDANT,
  ];
  const hasOrdersAdminAccess = ordersAdminProfiles.includes(
    profile as UserProfileEnum,
  );

  if (hasOrdersAdminAccess) {
    const isTableView = view === OrdersViewEnum.TABLE;
    if (isTableView) {
      return <AdminOrdersPage canSwitchOrdersView={hasOrdersAdminAccess} />;
    }

    return <KitchenOrdersPage canSwitchOrdersView={hasOrdersAdminAccess} />;
  }

  return <KitchenOrdersPage canSwitchOrdersView={hasOrdersAdminAccess} />;
}

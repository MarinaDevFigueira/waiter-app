import { useAuth } from "@/shared/hooks/useAuth";
import { useOrdersView } from "@/shared/hooks/useOrdersView";
import { UserRoleEnum } from "@/shared/enums/user-role.enum";
import { OrdersViewEnum } from "@/shared/enums/orders-view.enum";
import { AdminOrdersPage } from "@/pages/orders/admin-orders/page";
import { KitchenOrdersPage } from "@/pages/orders/kitchen-orders/page";

export function OrdersPage() {
  const { auth } = useAuth();
  const { view } = useOrdersView();

  const profile = auth?.profile;

  const ordersAdminProfiles = [
    UserRoleEnum.OWNER,
    UserRoleEnum.ADMIN,
    UserRoleEnum.ATTENDANT,
  ];
  const hasOrdersAdminAccess = ordersAdminProfiles.includes(
    profile as UserRoleEnum,
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

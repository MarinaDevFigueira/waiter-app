import { useState, useCallback } from "react";
import { QrCodeIcon } from "@phosphor-icons/react";
import { useOrdersView } from "@/shared/hooks/useOrdersView";
import { useRoles } from "@/shared/hooks/useRoles";
import { UserRoleEnum } from "@/shared/enums/user-role.enum";
import { OrdersViewEnum } from "@/shared/enums/orders-view.enum";
import { AdminOrdersPage } from "@/pages/orders/admin-orders/page";
import { KitchenOrdersPage } from "@/pages/orders/kitchen-orders/page";
import { SessionScannerModal } from "@/pages/orders/components/session-scanner-modal/session-scanner-modal";
import { StaffSessionSummaryModal } from "@/pages/orders/components/staff-session-summary-modal/staff-session-summary-modal";
import { Button } from "@/components/ui/button/button";
import { useTranslation } from "@/shared/hooks/useTranslation";

export function OrdersPage() {
  const { view } = useOrdersView();
  const { t } = useTranslation();
  const { canCloseOrderSessions, hasAnyRole } = useRoles();
  const [showScanner, setShowScanner] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [scannedSessionId, setScannedSessionId] = useState<string | null>(null);

  const ordersAdminProfiles = [
    UserRoleEnum.OWNER,
    UserRoleEnum.ADMIN,
    UserRoleEnum.ATTENDANT,
  ];
  const hasOrdersAdminAccess = hasAnyRole(ordersAdminProfiles);

  const handleOpenScanner = useCallback(() => {
    setShowScanner(true);
  }, []);

  const handleCloseScanner = useCallback(() => {
    setShowScanner(false);
  }, []);

  const handleSessionScanned = useCallback((sessionId: string) => {
    setScannedSessionId(sessionId);
    setShowScanner(false);
    setShowSummary(true);
  }, []);

  const handleCloseSummary = useCallback(() => {
    setShowSummary(false);
    setScannedSessionId(null);
  }, []);

  const scanButton = canCloseOrderSessions ? (
    <Button
      variant="outline"
      size="sm"
      onClick={handleOpenScanner}
      className="gap-2"
      data-testid="scan-session-button"
    >
      <QrCodeIcon className="w-4 h-4" />
      {t("orderSession.scanner.button")}
    </Button>
  ) : null;

  const modals = (
    <>
      <SessionScannerModal
        open={showScanner}
        onClose={handleCloseScanner}
        onSessionScanned={handleSessionScanned}
      />
      <StaffSessionSummaryModal
        open={showSummary}
        onClose={handleCloseSummary}
        sessionId={scannedSessionId}
      />
    </>
  );

  if (hasOrdersAdminAccess) {
    const isTableView = view === OrdersViewEnum.TABLE;
    if (isTableView) {
      return (
        <>
          <AdminOrdersPage canSwitchOrdersView={hasOrdersAdminAccess} extraActions={scanButton} />
          {modals}
        </>
      );
    }

    return (
      <>
        <KitchenOrdersPage canSwitchOrdersView={hasOrdersAdminAccess} extraActions={scanButton} />
        {modals}
      </>
    );
  }

  return (
    <>
      <KitchenOrdersPage canSwitchOrdersView={hasOrdersAdminAccess} extraActions={scanButton} />
      {modals}
    </>
  );
}

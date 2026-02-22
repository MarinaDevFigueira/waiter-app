import { useCallback } from "react";
import { AlertCircle } from "lucide-react";
import { Dialog } from "@/components/ui/dialog/dialog";
import { Button } from "@/components/ui/button/button";
import { useTranslation } from "@/shared/hooks/useTranslation";
import type { LogoutConfirmationModalProps } from "./logout-confirmation-modal.interface";

export function LogoutConfirmationModal({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
}: LogoutConfirmationModalProps) {
  const { t } = useTranslation();

  const isDisabled = isLoading;

  const handleCancel = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="max-w-md">
        <Dialog.Header className="items-start gap-3">
          <AlertCircle className="w-6 h-6 text-orange-500 shrink-0 mt-0.5" />
          <div className="flex-1 space-y-2">
            <Dialog.Title>{t("logout.confirmWithActiveSession")}</Dialog.Title>
            <Dialog.Description>
              {t("logout.activeSessionWarning")}
            </Dialog.Description>
          </div>
          <Dialog.Close />
        </Dialog.Header>

        <Dialog.Footer>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isDisabled}
          >
            {t("common.buttons.cancel")}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isDisabled}
            data-testid="confirm-logout-button"
          >
            {isLoading ? t("common.buttons.saving") : t("logout.closeSessionAndLogout")}
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
}

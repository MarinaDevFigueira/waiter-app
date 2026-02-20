import { AlertCircle } from "lucide-react";
import { useTranslation } from "@/shared/hooks/useTranslation";
import type { LogoutConfirmationModalProps } from "./logout-confirmation-modal.interface";

export function LogoutConfirmationModal({
  open,
  onConfirm,
  onCancel,
  isLoading = false,
}: LogoutConfirmationModalProps) {
  const { t } = useTranslation();

  if (!open) return null;

  const isDisabled = isLoading;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-orange-500 shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">{t("logout.confirmWithActiveSession")}</h2>
            <p className="text-sm text-muted-foreground">
              {t("logout.activeSessionWarning")}
            </p>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={isDisabled}
            data-disabled={isDisabled}
            className="px-4 py-2 rounded-lg border border-border hover:bg-muted hover:cursor-pointer transition-colors data-[disabled=true]:opacity-50 data-[disabled=true]:pointer-events-none"
          >
            {t("common.buttons.cancel")}
          </button>
          <button
            onClick={onConfirm}
            disabled={isDisabled}
            data-disabled={isDisabled}
            data-testid="confirm-logout-button"
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 hover:cursor-pointer active:shadow-sm transition-opacity data-[disabled=true]:opacity-50 data-[disabled=true]:pointer-events-none"
          >
            {isLoading ? t("common.buttons.saving") : t("logout.closeSessionAndLogout")}
          </button>
        </div>
      </div>
    </div>
  );
}

import { Receipt } from "lucide-react";
import { useTranslation } from "@/shared/hooks/useTranslation";

interface OrderSessionButtonProps {
  hasActiveSession: boolean;
  onClick: () => void;
  hasUnviewedOrder?: boolean;
}

export function OrderSessionButton({ hasActiveSession, onClick, hasUnviewedOrder = false }: OrderSessionButtonProps) {
  const { t } = useTranslation();

  if (!hasActiveSession) return null;

  return (
    <button
      onClick={onClick}
      data-testid="order-session-button"
      aria-label={t("orderSession.viewSummary")}
      className="relative flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-primary bg-primary text-primary-foreground hover:opacity-90 active:shadow-sm hover:cursor-pointer transition-opacity"
    >
      <Receipt className="w-5 h-5 shrink-0" />
      <span className="text-sm font-medium">{t("orderSession.viewSummary")}</span>
      {hasUnviewedOrder && (
        <span
          className="absolute -top-1 -right-1 size-3 bg-destructive rounded-full animate-pulse"
          data-testid="order-session-notification"
        />
      )}
    </button>
  );
}

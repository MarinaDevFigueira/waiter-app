import { Receipt } from "lucide-react";
import { useTranslation } from "@/shared/hooks/useTranslation";

interface OrderSessionButtonProps {
  hasActiveSession: boolean;
  onClick: () => void;
}

export function OrderSessionButton({ hasActiveSession, onClick }: OrderSessionButtonProps) {
  const { t } = useTranslation();

  if (!hasActiveSession) return null;

  return (
    <button
      onClick={onClick}
      data-testid="order-session-button"
      aria-label={t("orderSession.viewSummary")}
      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-primary bg-primary text-primary-foreground hover:opacity-90 active:shadow-sm hover:cursor-pointer transition-opacity"
    >
      <Receipt className="w-4 h-4" />
      <span className="text-sm font-medium">{t("orderSession.viewSummary")}</span>
    </button>
  );
}

import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "react-toastify";
import { logger } from "@/lib/logger";
import { useTranslation } from "@/shared/hooks/useTranslation";

export function GoogleErrorPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const errorMessage = params.get("error");
    const displayMessage = errorMessage ?? t("login.google.unknownError");

    logger.error(
      "[GoogleErrorPage] OAuth error",
      new Error(displayMessage),
    );
    toast.error(displayMessage);
    navigate({ to: "/login" });
  }, [navigate, t]);

  return (
    <div className="flex items-center justify-center min-h-screen w-screen bg-background">
      <p className="text-muted-foreground">{t("login.google.redirecting")}</p>
    </div>
  );
}

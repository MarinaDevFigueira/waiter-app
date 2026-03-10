import { useEffect } from "react";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { toast } from "react-toastify";
import { logger } from "@/lib/logger";
import { authService } from "@/services/auth/auth.service";
import { useTranslation } from "@/shared/hooks/useTranslation";

export function GoogleCallbackPage() {
  const navigate = useNavigate();
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const oauthtoken = params.get("oauthtoken");

    const hasToken = oauthtoken !== null;

    if (!hasToken) {
      toast.error(t("login.google.callbackMissingTokens"));
      navigate({ to: "/login" });
      return;
    }

    const handleToken = async () => {
      const result = await authService.handleGoogleOAuthTokens(oauthtoken);

      const hasError = "error" in result;
      if (hasError) {
        const error = new Error(result.error);
        logger.error("[GoogleCallbackPage] Auth failed", error);
        toast.error(result.error);
        navigate({ to: "/login" });
        return;
      }

      router.invalidate({ sync: true });
      navigate({ to: "/" });
    };

    handleToken();
  }, [navigate, router, t]);

  const authenticatingMessage = t("login.google.authenticating");

  return (
    <div data-testid="google-callback-page" className="flex items-center justify-center min-h-screen w-screen bg-background">
      <p data-testid="google-callback-message" className="text-muted-foreground">{authenticatingMessage}</p>
    </div>
  );
}

import { useState, useCallback } from "react";
import { SignOutIcon } from "@phosphor-icons/react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button/button";
import { Logo } from "@/components/ui/logo/logo";
import { ThemeToggle } from "@/components/ui/theme-toggle/theme-toggle";
import { LanguageSelector } from "@/components/ui/language-selector/language-selector";
import { LogoutConfirmationModal } from "@/components/logout-confirmation-modal/logout-confirmation-modal";
import { authService } from "@/services/auth/auth.service";
import { orderSessionsService } from "@/services/order-sessions/order-sessions.service";
import { useAuth } from "@/shared/hooks/useAuth";
import { useRoles } from "@/shared/hooks/useRoles";
import { cartObservable } from "@/shared/subjects/cart.subject";
import { logger } from "@/lib/logger";
import { useTranslation } from "@/shared/hooks/useTranslation";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { isTable } = useRoles();
  const { t } = useTranslation();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogoutClick = useCallback(() => {
    const currentCart = cartObservable.getValue();
    const hasActiveSession = Boolean(currentCart.orderSessionId);
    const shouldConfirm = isTable && hasActiveSession;

    if (shouldConfirm) {
      setIsLogoutModalOpen(true);
      return;
    }

    authService.logout().then(() => {
      navigate({ to: "/" });
    });
  }, [isTable, navigate]);

  const handleConfirmLogout = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      const currentCart = cartObservable.getValue();
      const sessionId = currentCart.orderSessionId;
      const hasSession = Boolean(sessionId);

      if (hasSession && sessionId) {
        const result = await orderSessionsService.close(sessionId);
        const hasError = "error" in result;
        if (hasError) {
          logger.error("Erro ao encerrar sessão no logout", new Error(result.error));
        }
      }

      cartObservable.clearCart();
      toast.success(t("orderSession.sessionClosedAndLoggedOut"));
      await authService.logout();
      setIsLogoutModalOpen(false);
      navigate({ to: "/" });
    } finally {
      setIsLoggingOut(false);
    }
  }, [navigate, t]);

  const handleLogoutModalOpenChange = useCallback((isOpen: boolean) => {
    setIsLogoutModalOpen(isOpen);
  }, []);

  return (
    <div className="w-screen min-h-screen flex flex-col items-center justify-start bg-background pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
      <header className="w-full bg-background shadow-sm shrink-0 z-50">
        <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-3 sm:py-4">
          <Logo className="text-lg sm:text-xl" />
          <div className="flex items-center gap-4">
            {auth && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  {auth.name}
                </span>
                <span className="text-xs bg-secondary px-2 py-1 rounded">
                  {auth.profile}
                </span>
              </div>
            )}
            <LanguageSelector />
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleLogoutClick}
              data-testid="logout-button"
            >
              <SignOutIcon />
            </Button>
          </div>
        </div>
      </header>
      <main className="w-full flex-1 min-h-0 overflow-y-auto flex justify-center h-full">
        <div className="w-full max-w-7xl px-2 md:px-4 py-4">
          {children}
        </div>
      </main>
      <LogoutConfirmationModal
        open={isLogoutModalOpen}
        onOpenChange={handleLogoutModalOpenChange}
        onConfirm={handleConfirmLogout}
        isLoading={isLoggingOut}
      />
    </div>
  );
}

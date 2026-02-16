import { SignOutIcon } from "@phosphor-icons/react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button/button";
import { Logo } from "@/components/ui/logo/logo";
import { ThemeToggle } from "@/components/ui/theme-toggle/theme-toggle";
import { LanguageSelector } from "@/components/ui/language-selector/language-selector";
import { authService } from "@/services/auth/auth.service";
import { useAuth } from "@/shared/hooks/useAuth";

export function AppLayout({ children }) {
  const navigate = useNavigate();
  const { auth } = useAuth();

  const handleLogout = async () => {
    await authService.logout();
    navigate({ to: "/login" });
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-start bg-background">
      <header className="w-full bg-background shadow-sm sticky top-0 z-50">
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
              onClick={handleLogout}
              data-testid="logout-button"
            >
              <SignOutIcon />
            </Button>
          </div>
        </div>
      </header>
      <main className="w-full flex-1 overflow-y-auto flex justify-center">
        <div className="w-full h-full max-w-7xl max-h-[720px] px-2 md:px-0 py-4">
          {children}
        </div>
      </main>
    </div>
  );
}

import { useMemo } from "react";
import { useNavigate, useLocation } from "@tanstack/react-router";
import { ArrowLeftIcon, HouseIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button/button";

export function DashboardNotFoundPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const pathname = location.pathname;
  const parentPath = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);

    const isAtDashboardRoot = segments.length === 1;
    if (isAtDashboardRoot) {
      return "/dashboard";
    }

    segments.pop();
    return `/${segments.join("/")}`;
  }, [pathname]);

  const handleGoBack = () => {
    navigate({ to: parentPath });
  };

  const handleGoHome = () => {
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
        <h2 className="text-2xl font-semibold text-foreground">
          Página não encontrada
        </h2>
        <p className="text-muted-foreground text-center max-w-md">
          A página que você está procurando não existe ou foi removida.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          onClick={handleGoBack}
          data-testid="go-back-button"
        >
          <ArrowLeftIcon className="mr-2" />
          Voltar
        </Button>
        <Button onClick={handleGoHome} data-testid="go-home-button">
          <HouseIcon className="mr-2" />
          Ir para Dashboard
        </Button>
      </div>
    </div>
  );
}

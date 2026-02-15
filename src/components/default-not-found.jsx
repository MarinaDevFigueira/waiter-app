import { useNavigate } from "@tanstack/react-router";
import { HouseIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card/card";

export function DefaultNotFound() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate({ to: "/" });
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-6xl font-bold text-muted-foreground mb-2">
            404
          </CardTitle>
          <CardTitle className="text-2xl">Página não encontrada</CardTitle>
          <CardDescription className="text-base">
            A página que você está procurando não existe ou foi removida.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button
            onClick={handleGoHome}
            data-testid="go-home-button"
          >
            <HouseIcon className="mr-2" />
            Voltar para a página inicial
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

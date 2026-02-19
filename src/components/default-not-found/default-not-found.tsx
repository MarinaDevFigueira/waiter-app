import { useNavigate } from "@tanstack/react-router";
import { HouseIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card/card";
import { useTranslation } from "@/shared/hooks/useTranslation";

export function DefaultNotFound(): JSX.Element {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleGoHome = () => {
    navigate({ to: "/" });
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-6xl font-bold text-muted-foreground mb-2">
            {t("notFound.errorCode")}
          </CardTitle>
          <CardTitle className="text-2xl">{t("notFound.title")}</CardTitle>
          <CardDescription className="text-base">
            {t("notFound.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button
            onClick={handleGoHome}
            data-testid="go-home-button"
          >
            <HouseIcon className="mr-2" />
            {t("common.buttons.goToHome")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

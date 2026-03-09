import { CookieIcon, WarningCircleIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button/button";
import { Dialog } from "@/components/ui/dialog/dialog";
import { useCookieConsent } from "@/shared/hooks/useCookieConsent";
import { useTranslation } from "@/shared/hooks/useTranslation";

function DeclinedScreen() {
  const { t } = useTranslation();
  const { reset } = useCookieConsent();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background p-4">
      <div className="flex flex-col items-center gap-6 max-w-md text-center">
        <WarningCircleIcon size={48} className="text-destructive" />
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold">{t("cookieConsent.declinedTitle")}</h2>
          <p className="text-sm text-muted-foreground">{t("cookieConsent.declinedDescription")}</p>
        </div>
        <Button onClick={reset}>{t("cookieConsent.reviewButton")}</Button>
      </div>
    </div>
  );
}

export function CookieConsentModal() {
  const { t } = useTranslation();
  const { isPending, isDeclined, accept, decline } = useCookieConsent();

  if (isDeclined) {
    return <DeclinedScreen />;
  }

  return (
    <Dialog open={isPending} onOpenChange={() => {}}>
      <Dialog.Content className="max-w-md">
        <Dialog.Header>
          <div className="flex items-center gap-2">
            <CookieIcon size={20} />
            <Dialog.Title>{t("cookieConsent.title")}</Dialog.Title>
          </div>
        </Dialog.Header>

        <p className="text-sm text-muted-foreground px-4 pb-2">
          {t("cookieConsent.description")}
        </p>

        <Dialog.Footer>
          <Button variant="outline" onClick={decline}>
            {t("cookieConsent.declineButton")}
          </Button>
          <Button onClick={accept}>
            {t("cookieConsent.acceptButton")}
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
}

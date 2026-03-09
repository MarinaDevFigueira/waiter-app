import { CookieIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button/button";
import { Dialog } from "@/components/ui/dialog/dialog";
import { useCookieConsent } from "@/shared/hooks/useCookieConsent";
import { useTranslation } from "@/shared/hooks/useTranslation";

export function CookieConsentModal() {
  const { t } = useTranslation();
  const { hasConsented, accept, decline } = useCookieConsent();

  return (
    <Dialog open={!hasConsented} onOpenChange={() => {}}>
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

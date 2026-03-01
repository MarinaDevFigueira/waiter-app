import { useCallback, useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { X } from "lucide-react";
import { Dialog } from "@/components/ui/dialog/dialog";
import { Drawer } from "@/components/ui/drawer/drawer";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { useIsMobile } from "@/shared/hooks/useMediaQuery";
import { orderSessionsService } from "@/services/order-sessions/order-sessions.service";
import { logger } from "@/lib/logger";
import type { QrCodeModalProps } from "./qr-code-modal.interface";

export function QrCodeModal({ open, onClose, sessionId }: QrCodeModalProps) {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQrCode = async () => {
      const hasNoSessionId = !sessionId;
      if (hasNoSessionId) return;

      const isNotOpen = !open;
      if (isNotOpen) return;

      setIsLoading(true);
      setError(null);

      const result = await orderSessionsService.getQrCode(sessionId);
      const hasError = "error" in result;

      if (hasError) {
        logger.error("[QrCodeModal] Erro ao buscar QR code", new Error(result.error));
        setError(result.error);
        setIsLoading(false);
        return;
      }

      setQrCodeData(JSON.stringify({ id: result.data.sessionId }));
      setIsLoading(false);
    };

    fetchQrCode();
  }, [sessionId, open]);

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      const isClosed = !isOpen;
      if (isClosed) {
        onClose();
      }
    },
    [onClose],
  );

  if (!open) return null;

  const loadingSpinner = (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      <p className="text-muted-foreground text-sm">{t("orderSession.qrCode.generating")}</p>
    </div>
  );

  const errorState = (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <p className="text-destructive text-sm">{t("orderSession.qrCode.error")}</p>
      <p className="text-muted-foreground text-xs">{error}</p>
    </div>
  );

  const qrCodeContent = (
    <div className="flex flex-col items-center justify-center py-8 gap-6">
      <div className="bg-white p-4 rounded-lg">
        <QRCodeSVG value={qrCodeData ?? ""} size={200} level="H" />
      </div>
      <p className="text-muted-foreground text-sm text-center max-w-xs">
        {t("orderSession.qrCode.description")}
      </p>
    </div>
  );

  const shouldShowLoading = isLoading;
  const shouldShowError = !isLoading && error !== null;
  const shouldShowQrCode = !isLoading && error === null && qrCodeData !== null;

  const bodyContent = (
    <div className="p-4">
      {shouldShowLoading && loadingSpinner}
      {shouldShowError && errorState}
      {shouldShowQrCode && qrCodeContent}
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={handleOpenChange}>
        <Drawer.Content className="max-h-[85vh] flex flex-col" data-testid="qr-code-modal">
          <Drawer.Header className="flex-row items-center justify-between">
            <Drawer.Title>{t("orderSession.qrCode.title")}</Drawer.Title>
          </Drawer.Header>
          {bodyContent}
        </Drawer.Content>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Dialog.Content className="max-w-md p-0 flex flex-col" data-testid="qr-code-modal">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <Dialog.Title className="text-lg font-semibold">{t("orderSession.qrCode.title")}</Dialog.Title>
          <button
            onClick={onClose}
            aria-label={t("common.buttons.cancel")}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted hover:cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {bodyContent}
      </Dialog.Content>
    </Dialog>
  );
}

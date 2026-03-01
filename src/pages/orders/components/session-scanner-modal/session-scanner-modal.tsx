import { useCallback, useMemo, useEffect } from "react";
import { X, CameraIcon } from "lucide-react";
import { Dialog } from "@/components/ui/dialog/dialog";
import { Drawer } from "@/components/ui/drawer/drawer";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { useIsMobile } from "@/shared/hooks/useMediaQuery";
import { useQrScanner } from "@/shared/hooks/useQrScanner";
import type { SessionScannerModalProps } from "./session-scanner-modal.interface";

export function SessionScannerModal({ open, onClose, onSessionScanned }: SessionScannerModalProps) {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const { isScanning, error, startScanner, reset, elementId } = useQrScanner({
    onSessionScanned,
  });

  const handleClose = useCallback(async () => {
    await reset();
    onClose();
  }, [reset, onClose]);

  const handleOpenChange = useCallback(
    async (isOpen: boolean) => {
      const isClosed = !isOpen;
      if (isClosed) {
        await handleClose();
      }
    },
    [handleClose],
  );

  useEffect(() => {
    const shouldStartScanner = open && !isScanning && error === null;
    if (shouldStartScanner) {
      startScanner();
    }
  }, [open, isScanning, error, startScanner]);

  const shouldShowScanner = error === null;
  const shouldShowError = error !== null;

  const scannerArea = useMemo(() => (
    <div className="relative w-full aspect-square max-w-[300px] mx-auto bg-muted rounded-lg overflow-hidden">
      <div id={elementId} className="w-full h-full [&>video]:object-cover [&>video]:w-full [&>video]:h-full" />
    </div>
  ), [elementId]);

  const errorState = useMemo(() => (
    <div className="flex flex-col items-center justify-center py-8 gap-4">
      <CameraIcon className="w-12 h-12 text-muted-foreground" />
      <p className="text-destructive text-sm text-center">{error}</p>
    </div>
  ), [error]);

  const bodyContent = useMemo(() => (
    <div className="p-4 space-y-4">
      <p className="text-muted-foreground text-sm text-center">
        {t("orderSession.scanner.description")}
      </p>
      {shouldShowScanner && scannerArea}
      {shouldShowError && errorState}
    </div>
  ), [t, shouldShowScanner, shouldShowError, scannerArea, errorState]);

  if (!open) return null;

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={handleOpenChange}>
        <Drawer.Content className="max-h-[85vh] flex flex-col" data-testid="session-scanner-modal">
          <Drawer.Header className="flex-row items-center justify-between">
            <Drawer.Title>{t("orderSession.scanner.title")}</Drawer.Title>
          </Drawer.Header>
          {bodyContent}
        </Drawer.Content>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Dialog.Content className="max-w-md p-0 flex flex-col" data-testid="session-scanner-modal">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <Dialog.Title className="text-lg font-semibold">{t("orderSession.scanner.title")}</Dialog.Title>
          <button
            onClick={handleClose}
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

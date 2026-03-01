import { useEffect, useState, useCallback, useRef } from "react";
import { qrScannerObservable, type QrScannerState } from "@/shared/subjects/qr-scanner.subject";
import { useTranslation } from "@/shared/hooks/useTranslation";

const SCANNER_ELEMENT_ID = "session-qr-scanner";

interface UseQrScannerOptions {
  onSessionScanned?: (sessionId: string) => void;
}

interface UseQrScannerReturn {
  isScanning: boolean;
  error: string | null;
  scannedSessionId: string | null;
  startScanner: () => Promise<void>;
  stopScanner: () => Promise<void>;
  reset: () => Promise<void>;
  elementId: string;
}

export function useQrScanner(options: UseQrScannerOptions = {}): UseQrScannerReturn {
  const { onSessionScanned } = options;
  const { t } = useTranslation();
  const [state, setState] = useState<QrScannerState>(qrScannerObservable.getValue());
  const onSessionScannedRef = useRef(onSessionScanned);

  onSessionScannedRef.current = onSessionScanned;

  useEffect(() => {
    const subscription = qrScannerObservable.subscribe(setState);

    const handleScanned = (sessionId: string): void => {
      const hasCallback = onSessionScannedRef.current !== undefined;
      if (hasCallback) {
        onSessionScannedRef.current?.(sessionId);
      }
    };

    qrScannerObservable.setOnSessionScanned(handleScanned);

    return () => {
      subscription.unsubscribe();
      qrScannerObservable.setOnSessionScanned(null);
    };
  }, []);

  const getErrorMessages = useCallback(() => ({
    permissionDenied: t("orderSession.scanner.permissionDenied"),
    generic: t("orderSession.scanner.error"),
  }), [t]);

  const startScanner = useCallback(async () => {
    await qrScannerObservable.startScanner(SCANNER_ELEMENT_ID, getErrorMessages);
  }, [getErrorMessages]);

  const stopScanner = useCallback(async () => {
    await qrScannerObservable.stopScanner();
  }, []);

  const reset = useCallback(async () => {
    await qrScannerObservable.reset();
  }, []);

  return {
    isScanning: state.isScanning,
    error: state.error,
    scannedSessionId: state.scannedSessionId,
    startScanner,
    stopScanner,
    reset,
    elementId: SCANNER_ELEMENT_ID,
  };
}

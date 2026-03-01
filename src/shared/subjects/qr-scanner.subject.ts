import { BehaviorSubject, type Subscription } from "rxjs";
import { Html5Qrcode } from "html5-qrcode";
import { logger } from "@/lib/logger";

export interface QrScannerState {
  isScanning: boolean;
  error: string | null;
  scannedSessionId: string | null;
}

const initialState: QrScannerState = {
  isScanning: false,
  error: null,
  scannedSessionId: null,
};

const scannerSubject = new BehaviorSubject<QrScannerState>(initialState);

let scannerInstance: Html5Qrcode | null = null;
let isInitializing = false;
let onSessionScannedCallback: ((sessionId: string) => void) | null = null;

const stopScanner = async (): Promise<void> => {
  const hasScanner = scannerInstance !== null;
  if (hasScanner) {
    try {
      const isRunning = scannerInstance?.isScanning;
      if (isRunning) {
        await scannerInstance?.stop();
      }
    } catch (err) {
      logger.error("[QrScannerSubject] Erro ao parar scanner", err instanceof Error ? err : null);
    }
    scannerInstance = null;
  }
  isInitializing = false;
};

const setOnSessionScanned = (callback: ((sessionId: string) => void) | null): void => {
  onSessionScannedCallback = callback;
};

const startScanner = async (
  elementId: string,
  getErrorMessages: () => { permissionDenied: string; generic: string },
): Promise<void> => {
  const alreadyInitializing = isInitializing;
  if (alreadyInitializing) {
    return;
  }

  const hasExistingScanner = scannerInstance !== null;
  if (hasExistingScanner) {
    return;
  }

  isInitializing = true;
  scannerSubject.next({ ...scannerSubject.getValue(), error: null, scannedSessionId: null });

  await new Promise((resolve) => setTimeout(resolve, 500));

  const element = document.getElementById(elementId);
  const elementNotFound = !element;
  if (elementNotFound) {
    isInitializing = false;
    return;
  }

  try {
    const scanner = new Html5Qrcode(elementId);
    scannerInstance = scanner;
    scannerSubject.next({ ...scannerSubject.getValue(), isScanning: true });

    const onScanSuccess = (decodedText: string): void => {
      try {
        const payload = JSON.parse(decodedText) as { id?: string };
        const hasValidId = typeof payload.id === "string" && payload.id.length > 0;

        if (hasValidId) {
          const sessionId = payload.id as string;
          scanner.stop().then(() => {
            scannerInstance = null;
            isInitializing = false;
            scannerSubject.next({
              isScanning: false,
              error: null,
              scannedSessionId: sessionId,
            });
            const hasCallback = onSessionScannedCallback !== null;
            if (hasCallback && onSessionScannedCallback) {
              onSessionScannedCallback(sessionId);
            }
          });
        }
      } catch (err) {
        logger.error("[QrScannerSubject] QR code inválido", err instanceof Error ? err : null);
      }
    };

    await scanner.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      onScanSuccess,
      () => {},
    );
  } catch (err) {
    logger.error("[QrScannerSubject] Erro ao iniciar câmera", err instanceof Error ? err : null);
    const errorMessage = err instanceof Error ? err.message : "";
    const isPermissionError = errorMessage.includes("Permission") || errorMessage.includes("NotAllowedError");
    const errorMessages = getErrorMessages();

    scannerSubject.next({
      isScanning: false,
      error: isPermissionError ? errorMessages.permissionDenied : errorMessages.generic,
      scannedSessionId: null,
    });
    isInitializing = false;
  }
};

const reset = async (): Promise<void> => {
  await stopScanner();
  scannerSubject.next(initialState);
};

export const qrScannerObservable = {
  subscribe: (callback: (value: QrScannerState) => void): Subscription =>
    scannerSubject.subscribe(callback),
  getValue: (): QrScannerState => scannerSubject.getValue(),
  startScanner,
  stopScanner,
  reset,
  setOnSessionScanned,
};

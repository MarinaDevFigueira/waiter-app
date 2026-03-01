export interface SessionScannerModalProps {
  open: boolean;
  onClose: () => void;
  onSessionScanned: (sessionId: string) => void;
}

export interface QrCodePayload {
  id: string;
}

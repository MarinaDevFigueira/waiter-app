export interface QrCodeModalProps {
  open: boolean;
  onClose: () => void;
  sessionId: string | null;
}

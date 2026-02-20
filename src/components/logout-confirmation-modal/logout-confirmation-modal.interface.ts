export interface LogoutConfirmationModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

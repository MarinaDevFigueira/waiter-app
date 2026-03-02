export interface EditClosedByModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderSessionIds: string[];
  onSuccess: () => void;
}

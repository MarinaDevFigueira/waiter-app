import { Dialog } from "@/components/ui/dialog/dialog";
import { Button } from "@/components/ui/button/button";
import type { ConfirmationDialogProps } from "./confirmation-dialog.interface";

function ConfirmationDialogRoot({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  variant = "default",
  isLoading = false,
}: ConfirmationDialogProps) {
  const confirmButtonVariant = variant === "destructive" ? "destructive" : "default";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Dialog.Content>
        <Dialog.Header>
          <div className="flex flex-col gap-1.5">
            <Dialog.Title>{title}</Dialog.Title>
            <Dialog.Description>{description}</Dialog.Description>
          </div>
          <Dialog.Close />
        </Dialog.Header>

        <Dialog.Footer>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button type="button" variant={confirmButtonVariant} onClick={onConfirm} disabled={isLoading}>
            {confirmLabel}
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
}

export const ConfirmationDialog = {
  Root: ConfirmationDialogRoot,
};

export { ConfirmationDialog as default };

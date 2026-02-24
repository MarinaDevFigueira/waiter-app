import { useCallback } from "react";
import { Dialog } from "@/components/ui/dialog/dialog";
import { Button } from "@/components/ui/button/button";
import { useTranslation } from "@/shared/hooks/useTranslation";
import type { UnsavedChangesDialogProps } from "./product-form-dialog.interface";

export function UnsavedChangesDialog({ open, onOpenChange, onConfirm, onCancel }: UnsavedChangesDialogProps) {
  const { t } = useTranslation();

  const handleConfirm = useCallback(() => {
    onConfirm();
  }, [onConfirm]);

  const handleCancel = useCallback(() => {
    onCancel();
  }, [onCancel]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="max-w-md">
        <Dialog.Header>
          <div className="flex flex-col gap-1.5">
            <Dialog.Title>{t("products.form.unsavedChanges.title")}</Dialog.Title>
            <Dialog.Description>
              {t("products.form.unsavedChanges.description")}
            </Dialog.Description>
          </div>
          <Dialog.Close />
        </Dialog.Header>
        <Dialog.Footer>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
          >
            {t("products.form.unsavedChanges.cancel")}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
          >
            {t("products.form.unsavedChanges.confirm")}
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
}

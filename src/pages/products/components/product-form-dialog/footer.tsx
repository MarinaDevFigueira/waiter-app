import { Dialog } from "@/components/ui/dialog/dialog";
import { Button } from "@/components/ui/button/button";
import { useTranslation } from "@/shared/hooks/useTranslation";
import type { FooterProps } from "./product-form-dialog.interface";

export function Footer({ onCancel, isPending, submitLabel }: FooterProps) {
  const { t } = useTranslation();

  return (
    <Dialog.Footer>
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isPending}
      >
        {t("common.buttons.cancel")}
      </Button>
      <Button type="submit" disabled={isPending}>
        {isPending ? t("common.buttons.saving") : submitLabel}
      </Button>
    </Dialog.Footer>
  );
}

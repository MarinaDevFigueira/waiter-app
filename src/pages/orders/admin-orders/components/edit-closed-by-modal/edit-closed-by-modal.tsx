import { useState, useEffect, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Dialog } from "@/components/ui/dialog/dialog";
import { Button } from "@/components/ui/button/button";
import { Label } from "@/components/ui/label/label";
import { UserSearchCombobox } from "@/components/ui/user-search-combobox/user-search-combobox";
import { orderSessionsService } from "@/services/order-sessions/order-sessions.service";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { useLanguage } from "@/shared/hooks/useLanguage";
import type { UserSelection } from "@/components/ui/user-search-combobox/user-search-combobox.interface";
import {
  editClosedByObservable,
  type EditClosedByState,
} from "../../observables/edit-closed-by.observable";

export function EditClosedByModal() {
  const { t } = useTranslation();
  const { addLanguagePrefix } = useLanguage();
  const queryClient = useQueryClient();

  const [state, setState] = useState<EditClosedByState | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserSelection | null>(null);

  useEffect(() => {
    const subscription = editClosedByObservable.subscribe(setState);
    return () => subscription.unsubscribe();
  }, []);

  const isOpen = state !== null && state.open;
  const orderSessionId = state?.orderSessionId ?? null;

  const updateMutation = useMutation({
    mutationFn: async (userId: string) => {
      const hasOrderSessionId = orderSessionId !== null;
      if (!hasOrderSessionId) {
        throw new Error(t("orders.admin.editClosedBy.updateError"));
      }

      const result = await orderSessionsService.updateClosedBy(orderSessionId, { closedBy: userId });
      const hasError = "error" in result;

      if (hasError) {
        throw new Error(t("orders.admin.editClosedBy.updateError"));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addLanguagePrefix("orders") });
      toast.success(t("orders.admin.editClosedBy.updateSuccess"));
      handleClose();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleClose = useCallback(() => {
    editClosedByObservable.close();
    setSelectedUser(null);
  }, []);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        handleClose();
      }
    },
    [handleClose]
  );

  const handleUserChange = useCallback((user: UserSelection | null) => {
    setSelectedUser(user);
  }, []);

  const handleConfirm = useCallback(() => {
    const hasSelectedUser = selectedUser !== null;
    if (hasSelectedUser) {
      updateMutation.mutate(selectedUser.id);
    }
  }, [selectedUser, updateMutation]);

  const isLoading = updateMutation.isPending;
  const selectedUserId = selectedUser?.id;
  const canConfirm = selectedUserId !== null && selectedUserId !== undefined;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Content className="max-w-md">
        <Dialog.Header>
          <Dialog.Title>{t("orders.admin.editClosedBy.title")}</Dialog.Title>
          <Dialog.Close />
        </Dialog.Header>

        <div className="px-6 py-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            {t("orders.admin.editClosedBy.descriptionSingle")}
          </p>

          <div className="space-y-2">
            <Label>{t("orders.admin.editClosedBy.userLabel")}</Label>
            <UserSearchCombobox
              value={selectedUser}
              onChange={handleUserChange}
              placeholder={t("orders.admin.editClosedBy.userPlaceholder")}
              searchPlaceholder={t(
                "orders.admin.editClosedBy.userSearchPlaceholder"
              )}
              emptyMessage={t("orders.admin.editClosedBy.userEmptyMessage")}
              disabled={isLoading}
            />
          </div>
        </div>

        <Dialog.Footer>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            {t("common.buttons.cancel")}
          </Button>
          <Button onClick={handleConfirm} disabled={!canConfirm || isLoading}>
            {isLoading
              ? t("common.buttons.saving")
              : t("orders.admin.editClosedBy.confirmButton")}
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
}

import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import { PlusIcon } from "@phosphor-icons/react";
import { UsersTable } from "@/pages/users/components/users-table";
import { UsersTableSkeleton } from "@/pages/users/components/users-table-skeleton";
import { UsersFilters } from "@/pages/users/components/users-filters";
import { UserFormDialog } from "@/pages/users/components/user-form-dialog/user-form-dialog";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog/confirmation-dialog";
import { Pagination } from "@/components/ui/pagination/pagination";
import { Button } from "@/components/ui/button/button";
import { useUsers } from "@/shared/hooks/useUsers";
import { usePagination } from "@/shared/hooks/usePagination";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { usePermissions } from "@/shared/hooks/usePermissions";
import { PermissionEnum } from "@/shared/enums/permission.enum";
import type { User } from "@/shared/schemas/user.schema";

export function UsersPage() {
  const {
    users,
    total,
    page,
    size,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    isLoading,
    isError,
    error,
    queryParams,
    updateSorting,
    updatePagination,
    refetch,
  } = useUsers();
  const { t } = useTranslation();
  const { hasPermissionTo } = usePermissions();
  const [formOpen, setFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);

  const canCreateUser = hasPermissionTo(PermissionEnum.CREATE_USERS);
  const canEditUser = hasPermissionTo(PermissionEnum.EDIT_USERS);
  const canDeleteUser = hasPermissionTo(PermissionEnum.DELETE_USERS);
  const [confirmDisableOpen, setConfirmDisableOpen] = useState(false);
  const [userToDisable, setUserToDisable] = useState<User | undefined>(undefined);

  const handleCreateUser = useCallback(() => {
    setSelectedUser(undefined);
    setFormOpen(true);
  }, []);

  const handleEditUser = useCallback((user: User) => {
    setSelectedUser(user);
    setFormOpen(true);
  }, []);

  const handleDisableUser = useCallback((user: User) => {
    setUserToDisable(user);
    setConfirmDisableOpen(true);
  }, []);

  const handleConfirmDisable = useCallback(() => {
    if (!userToDisable) return;

    toast.info("Funcionalidade de desabilitar usuário ainda não implementada");
    console.log("Disable user:", userToDisable.id);
    setConfirmDisableOpen(false);
    setUserToDisable(undefined);
  }, [userToDisable]);

  const pagination = usePagination({
    page,
    size,
    total,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    onPageChange: updatePagination,
  });

  const createButton = canCreateUser ? (
    <Button onClick={handleCreateUser} data-testid="create-user-button">
      <PlusIcon size={16} />
      {t("users.actions.create")}
    </Button>
  ) : null;

  const pageHeader = (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("users.pageTitle")}
        </h1>
        <p className="text-muted-foreground">
          {t("users.pageSubtitle")}
        </p>
      </div>
      {createButton}
    </div>
  );

  const hasError = isError;
  const isLoadingData = isLoading;
  const hasNoUsers = users.length === 0;
  const errorMessage = error?.message;

  const errorContent = (
    <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
      <p className="text-sm text-destructive">
        {t("users.errors.loadFailed")} {errorMessage}
      </p>
    </div>
  );

  const emptyContent = (
    <div className="rounded-lg border border-border bg-card p-8 text-center">
      <p className="text-muted-foreground">
        {t("users.emptyState")}
      </p>
    </div>
  );

  const sortingState = {
    orderBy: queryParams.orderBy,
    direction: queryParams.direction,
  };

  const showTable = !hasError && !isLoadingData && !hasNoUsers;
  const showSkeleton = !hasError && isLoadingData;
  const showEmpty = !hasError && !isLoadingData && hasNoUsers;

  const disableConfirmTitle = t("users.confirmDisable.title");
  const disableConfirmDescription = t("users.confirmDisable.description");
  const disableConfirmLabel = t("users.confirmDisable.confirm");
  const cancelLabel = t("common.buttons.cancel");

  return (
    <div className="flex flex-col h-full gap-6">
      {pageHeader}

      <UsersFilters />

      {hasError && errorContent}

      {showSkeleton && <UsersTableSkeleton />}

      {showEmpty && emptyContent}

      <UserFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        user={selectedUser}
        onSuccess={refetch}
      />

      <ConfirmationDialog.Root
        open={confirmDisableOpen}
        onOpenChange={setConfirmDisableOpen}
        onConfirm={handleConfirmDisable}
        title={disableConfirmTitle}
        description={disableConfirmDescription}
        confirmLabel={disableConfirmLabel}
        cancelLabel={cancelLabel}
        variant="destructive"
      />

      {showTable && (
        <div className="flex-1 min-h-0 flex flex-col gap-3">
          <div className="flex-1 min-h-0">
            <UsersTable
              users={users}
              sorting={sortingState}
              onSortingChange={updateSorting}
              onEdit={handleEditUser}
              onDisable={handleDisableUser}
              canEdit={canEditUser}
              canDisable={canDeleteUser}
            />
          </div>

          <Pagination>
            <div className="flex items-center gap-4">
              <Pagination.Info
                startItem={pagination.startItem}
                endItem={pagination.endItem}
                total={pagination.total}
              />
              <Pagination.SizeSelect
                size={pagination.size}
                setPageSize={pagination.setPageSize}
              />
            </div>
            <Pagination.Controls
              page={pagination.page}
              totalPages={pagination.totalPages}
              hasNextPage={pagination.hasNextPage}
              hasPreviousPage={pagination.hasPreviousPage}
              pageRange={pagination.pageRange}
              nextPage={pagination.nextPage}
              prevPage={pagination.prevPage}
              goToPage={pagination.goToPage}
            />
          </Pagination>
        </div>
      )}
    </div>
  );
}

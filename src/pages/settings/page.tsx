import { useState, useCallback, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { TrashIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card/card";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog/confirmation-dialog";
import { cacheService } from "@/services/cache/cache.service";
import { usePermissions } from "@/shared/hooks/usePermissions";
import { PermissionEnum } from "@/shared/enums/permission.enum";
import { useTranslation } from "@/shared/hooks/useTranslation";

export function SettingsPage() {
  const { t } = useTranslation();
  const { hasPermissionTo } = usePermissions();
  const hasClearCachePermission = hasPermissionTo(PermissionEnum.CLEAR_CACHE);
  const queryClient = useQueryClient();
  const [clearCacheDialogOpen, setClearCacheDialogOpen] = useState(false);

  const clearCacheMutation = useMutation({
    mutationFn: async () => {
      const result = await cacheService.clear();
      const hasError = "error" in result;
      if (hasError) {
        throw new Error(result.error);
      }
    },
    onSuccess: () => {
      queryClient.clear();
      toast.success(t("settings.cache.clearSuccess"));
      setClearCacheDialogOpen(false);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleOpenClearCacheDialog = useCallback(() => {
    setClearCacheDialogOpen(true);
  }, []);

  const handleCloseClearCacheDialog = useCallback((open: boolean) => {
    setClearCacheDialogOpen(open);
  }, []);

  const handleConfirmClearCache = useCallback(() => {
    clearCacheMutation.mutate();
  }, [clearCacheMutation]);

  const isLoading = clearCacheMutation.isPending;

  const systemSection = useMemo(() => {
    if (!hasClearCachePermission) {
      return null;
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("settings.system.title")}</CardTitle>
          <CardDescription>{t("settings.system.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">{t("settings.cache.title")}</h4>
              <p className="text-sm text-muted-foreground">
                {t("settings.cache.description")}
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={handleOpenClearCacheDialog}
              disabled={isLoading}
            >
              <TrashIcon className="size-4 mr-2" />
              {t("settings.cache.clearButton")}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }, [hasClearCachePermission, t, handleOpenClearCacheDialog, isLoading]);

  const pageContent = useMemo(() => {
    if (!hasClearCachePermission) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              {t("settings.noAccess.title")}
            </h2>
            <p className="text-muted-foreground">
              {t("settings.noAccess.description")}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-6">
        {systemSection}
      </div>
    );
  }, [hasClearCachePermission, t, systemSection]);

  return (
    <div className="flex flex-col h-full gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("settings.pageTitle")}
        </h1>
        <p className="text-muted-foreground">
          {t("settings.pageSubtitle")}
        </p>
      </div>

      {pageContent}

      <ConfirmationDialog.Root
        open={clearCacheDialogOpen}
        onOpenChange={handleCloseClearCacheDialog}
        onConfirm={handleConfirmClearCache}
        title={t("settings.cache.confirmTitle")}
        description={t("settings.cache.confirmDescription")}
        confirmLabel={t("settings.cache.confirmButton")}
        cancelLabel={t("common.buttons.cancel")}
        variant="destructive"
        isLoading={isLoading}
      />
    </div>
  );
}

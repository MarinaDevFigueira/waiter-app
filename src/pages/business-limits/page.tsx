import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { businessLimitsService } from "@/services/business-limits/business-limits.service";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { useBusiness } from "@/shared/hooks/useBusiness";
import { useAuth } from "@/shared/hooks/useAuth";
import { UserRoleEnum } from "@/shared/enums/user-role.enum";
import { logger } from "@/lib/logger";

function LimitField({ label, value }: { label: string; value: number }) {
  const displayValue = String(value);
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
      <span className="text-sm font-medium">{label}</span>
      <span className="text-2xl font-bold tabular-nums">{displayValue}</span>
    </div>
  );
}

export function BusinessLimitsPage() {
  const { t } = useTranslation();
  const { selectedBusiness } = useBusiness();
  const { profile } = useAuth();

  const rolesRequiringBusinessSelection = [UserRoleEnum.ADMIN, UserRoleEnum.SYSTEM_MANAGER];
  const needsBusinessSelection = rolesRequiringBusinessSelection.includes(profile as UserRoleEnum);
  const hasBusinessSelected = needsBusinessSelection ? selectedBusiness !== null : true;
  const businessId = selectedBusiness?.id;

  const queryKey = useMemo(() => ["business-limits", businessId], [businessId]);

  const { data: limits, isLoading, isError } = useQuery({
    queryKey,
    queryFn: async () => {
      const result = await businessLimitsService.get();
      const hasError = "error" in result;
      if (hasError) {
        const error = new Error(result.error);
        logger.error("[BusinessLimitsPage] Failed to load limits", error);
        throw error;
      }
      return result.data;
    },
    enabled: hasBusinessSelected,
  });

  const pageHeader = (
    <div>
      <h1 className="text-2xl font-bold">{t("business.limits.title")}</h1>
    </div>
  );

  const noBusinessContent = (
    <div className="rounded-lg border border-border bg-card p-8 text-center">
      <p className="text-muted-foreground">{t("business.info.noBusinessSelected")}</p>
    </div>
  );

  const errorContent = (
    <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
      <p className="text-sm text-destructive">{t("business.limits.loadError")}</p>
    </div>
  );

  const loadingContent = (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex items-center justify-between rounded-lg border border-border bg-card p-4"
        >
          <div className="h-4 w-32 bg-muted animate-pulse rounded" />
          <div className="h-8 w-12 bg-muted animate-pulse rounded" />
        </div>
      ))}
    </div>
  );

  const viewContent = useMemo(() => {
    if (!limits) return null;
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <LimitField label={t("business.limits.maxTableUsers")} value={limits.maxTableUsers} />
        <LimitField label={t("business.limits.maxWaiterUsers")} value={limits.maxWaiterUsers} />
        <LimitField label={t("business.limits.maxKitchenUsers")} value={limits.maxKitchenUsers} />
        <LimitField label={t("business.limits.maxAttendantUsers")} value={limits.maxAttendantUsers} />
      </div>
    );
  }, [limits, t]);

  const shouldShowNoBusinessContent = needsBusinessSelection && !selectedBusiness;
  const shouldShowLoading = hasBusinessSelected && isLoading;
  const shouldShowError = hasBusinessSelected && isError;
  const shouldShowViewContent = hasBusinessSelected && !isLoading && !isError;

  const bodyContent = useMemo(() => {
    if (shouldShowNoBusinessContent) return noBusinessContent;
    if (shouldShowLoading) return loadingContent;
    if (shouldShowError) return errorContent;
    if (shouldShowViewContent) return viewContent;
    return null;
  }, [
    shouldShowNoBusinessContent,
    shouldShowLoading,
    shouldShowError,
    shouldShowViewContent,
    noBusinessContent,
    loadingContent,
    errorContent,
    viewContent,
  ]);

  return (
    <div className="flex flex-col gap-6">
      {pageHeader}
      {bodyContent}
    </div>
  );
}

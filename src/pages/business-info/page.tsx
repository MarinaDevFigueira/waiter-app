import { useState, useCallback, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { PencilSimple, X, FloppyDisk } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button/button";
import { Input } from "@/components/ui/input/input";
import { Label } from "@/components/ui/label/label";
import { businessService } from "@/services/business/business.service";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { useBusiness } from "@/shared/hooks/useBusiness";
import { usePermissions } from "@/shared/hooks/usePermissions";
import { useAuth } from "@/shared/hooks/useAuth";
import { PermissionEnum } from "@/shared/enums/permission.enum";
import { UserRoleEnum } from "@/shared/enums/user-role.enum";
import { logger } from "@/lib/logger";
import type { ApiBusinessDetail } from "@/services/business/schemas/get-by-id.schema";

const businessInfoFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  street: z.string().optional(),
  number: z.string().optional(),
  complement: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  zipCode: z.string().optional(),
});

type BusinessInfoFormValues = z.infer<typeof businessInfoFormSchema>;

function buildDefaultValues(business: ApiBusinessDetail): BusinessInfoFormValues {
  return {
    name: business.name,
    street: business.street ?? "",
    number: business.number ?? "",
    complement: business.complement ?? "",
    neighborhood: business.neighborhood ?? "",
    city: business.city ?? "",
    state: business.state ?? "",
    country: business.country ?? "",
    zipCode: business.zipCode ?? "",
  };
}

function InfoField({ label, value }: { label: string; value: string | null | undefined }) {
  const displayValue = value ?? "—";
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <span className="text-sm">{displayValue}</span>
    </div>
  );
}

function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  const hasError = Boolean(error);
  const errorMessage = hasError ? (
    <span className="text-xs text-destructive">{error}</span>
  ) : null;

  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {children}
      {errorMessage}
    </div>
  );
}

export function BusinessInfoPage() {
  const { t } = useTranslation();
  const { selectedBusiness } = useBusiness();
  const { profile } = useAuth();
  const { hasPermissionTo } = usePermissions();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const businessId = selectedBusiness?.id;
  const hasBusinessSelected = businessId !== undefined;

  const isAdmin = profile === UserRoleEnum.ADMIN;
  const hasEditPermission = hasPermissionTo(PermissionEnum.EDIT_BUSINESS);
  const canEdit = isAdmin || hasEditPermission;

  const queryKey = useMemo(() => ["business-detail", businessId], [businessId]);

  const { data: business, isLoading, isError } = useQuery({
    queryKey,
    queryFn: async () => {
      const result = await businessService.getById(businessId ?? "");
      const hasError = "error" in result;
      if (hasError) {
        const error = new Error(result.error);
        logger.error("[BusinessInfoPage] Failed to load business", error);
        throw error;
      }
      return result.data;
    },
    enabled: hasBusinessSelected,
  });

  const form = useForm<BusinessInfoFormValues>({
    resolver: zodResolver(businessInfoFormSchema),
    defaultValues: {
      name: "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
    },
  });

  const handleStartEdit = useCallback(() => {
    if (business) {
      const defaultValues = buildDefaultValues(business);
      form.reset(defaultValues);
    }
    setIsEditing(true);
  }, [business, form]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    form.reset();
  }, [form]);

  const handleSubmit = useCallback(
    async (values: BusinessInfoFormValues) => {
      if (!businessId) return;

      setIsSaving(true);

      const updateData = {
        name: values.name,
        street: values.street || null,
        number: values.number || null,
        complement: values.complement || null,
        neighborhood: values.neighborhood || null,
        city: values.city || null,
        state: values.state || null,
        country: values.country || null,
        zipCode: values.zipCode || null,
      };

      const result = await businessService.update(businessId, updateData);
      setIsSaving(false);

      const hasError = "error" in result;
      if (hasError) {
        const error = new Error(result.error);
        toast.error(result.error);
        logger.error("[BusinessInfoPage] Failed to update business", error);
        return;
      }

      toast.success(t("business.info.updateSuccess"));
      queryClient.invalidateQueries({ queryKey });
      setIsEditing(false);
    },
    [businessId, queryClient, queryKey, t]
  );

  const showEditButton = canEdit && !isEditing && !isLoading && Boolean(business);
  const saveButtonLabel = isSaving ? t("business.actions.saving") : t("business.actions.save");

  const editButton = showEditButton ? (
    <Button variant="outline" size="sm" onClick={handleStartEdit}>
      <PencilSimple className="size-4" />
      {t("business.actions.edit")}
    </Button>
  ) : null;

  const pageHeader = (
    <div className="flex items-start justify-between">
      <h1 className="text-2xl font-bold">{t("business.info.title")}</h1>
      {editButton}
    </div>
  );

  const noBusinessContent = (
    <div className="rounded-lg border border-border bg-card p-8 text-center">
      <p className="text-muted-foreground">{t("business.info.noBusinessSelected")}</p>
    </div>
  );

  const errorContent = (
    <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
      <p className="text-sm text-destructive">{t("business.info.loadError")}</p>
    </div>
  );

  const loadingContent = (
    <div className="grid grid-cols-1 gap-4">
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="flex flex-col gap-1">
          <div className="h-4 w-24 bg-muted animate-pulse rounded" />
          <div className="h-4 w-48 bg-muted animate-pulse rounded" />
        </div>
      ))}
    </div>
  );

  const viewContent = useMemo(() => {
    if (!business) return null;
    return (
      <div className="grid grid-cols-1 gap-4">
        <InfoField label={t("business.info.name")} value={business.name} />
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-muted-foreground">
            {t("business.info.address")}
          </span>
          <div className="grid grid-cols-2 gap-4 mt-1">
            <InfoField label={t("business.info.street")} value={business.street} />
            <InfoField label={t("business.info.number")} value={business.number} />
            <InfoField label={t("business.info.complement")} value={business.complement} />
            <InfoField label={t("business.info.neighborhood")} value={business.neighborhood} />
            <InfoField label={t("business.info.city")} value={business.city} />
            <InfoField label={t("business.info.state")} value={business.state} />
            <InfoField label={t("business.info.country")} value={business.country} />
            <InfoField label={t("business.info.zipCode")} value={business.zipCode} />
          </div>
        </div>
      </div>
    );
  }, [business, t]);

  const nameError = form.formState.errors.name?.message;

  const editContent = useMemo(() => {
    if (!isEditing) return null;
    return (
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-4">
          <FormField label={t("business.info.name")} error={nameError}>
            <Input {...form.register("name")} />
          </FormField>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-muted-foreground">
              {t("business.info.address")}
            </span>
            <div className="grid grid-cols-2 gap-4 mt-1">
              <FormField label={t("business.info.street")}>
                <Input {...form.register("street")} />
              </FormField>
              <FormField label={t("business.info.number")}>
                <Input {...form.register("number")} />
              </FormField>
              <FormField label={t("business.info.complement")}>
                <Input {...form.register("complement")} />
              </FormField>
              <FormField label={t("business.info.neighborhood")}>
                <Input {...form.register("neighborhood")} />
              </FormField>
              <FormField label={t("business.info.city")}>
                <Input {...form.register("city")} />
              </FormField>
              <FormField label={t("business.info.state")}>
                <Input {...form.register("state")} />
              </FormField>
              <FormField label={t("business.info.country")}>
                <Input {...form.register("country")} />
              </FormField>
              <FormField label={t("business.info.zipCode")}>
                <Input {...form.register("zipCode")} />
              </FormField>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button type="submit" disabled={isSaving}>
            <FloppyDisk className="size-4" />
            {saveButtonLabel}
          </Button>
          <Button type="button" variant="outline" onClick={handleCancel} disabled={isSaving}>
            <X className="size-4" />
            {t("business.actions.cancel")}
          </Button>
        </div>
      </form>
    );
  }, [isEditing, form, handleSubmit, handleCancel, isSaving, t, nameError, saveButtonLabel]);

  const shouldShowNoBusinessContent = !hasBusinessSelected;
  const shouldShowLoading = hasBusinessSelected && isLoading;
  const shouldShowError = hasBusinessSelected && isError;
  const shouldShowEditContent = hasBusinessSelected && !isLoading && !isError && isEditing;
  const shouldShowViewContent = hasBusinessSelected && !isLoading && !isError && !isEditing;

  const bodyContent = useMemo(() => {
    if (shouldShowNoBusinessContent) return noBusinessContent;
    if (shouldShowLoading) return loadingContent;
    if (shouldShowError) return errorContent;
    if (shouldShowEditContent) return editContent;
    if (shouldShowViewContent) return viewContent;
    return null;
  }, [
    shouldShowNoBusinessContent,
    shouldShowLoading,
    shouldShowError,
    shouldShowEditContent,
    shouldShowViewContent,
    noBusinessContent,
    loadingContent,
    errorContent,
    editContent,
    viewContent,
  ]);

  return (
    <div className="flex flex-col gap-6">
      {pageHeader}
      {bodyContent}
    </div>
  );
}

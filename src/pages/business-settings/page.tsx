import { useState, useCallback, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { PencilSimple, X, FloppyDisk } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button/button";
import { Input } from "@/components/ui/input/input";
import { Label } from "@/components/ui/label/label";
import { MultiSelect } from "@/components/ui/multi-select/multi-select";
import { businessSettingsService } from "@/services/business-settings/business-settings.service";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { useBusiness } from "@/shared/hooks/useBusiness";
import { usePermissions } from "@/shared/hooks/usePermissions";
import { useRoles } from "@/shared/hooks/useRoles";
import { PermissionEnum } from "@/shared/enums/permission.enum";
import { TranslationsEnum } from "@/shared/enums/translations.enum";
import { logger } from "@/lib/logger";
import type { GetBusinessSettingsResponse } from "@/services/business-settings/interfaces/business-settings.interface";

const businessSettingsFormSchema = z.object({
  primaryColor: z.string().min(1, "Cor primária é obrigatória"),
  secondaryColor: z.string().min(1, "Cor secundária é obrigatória"),
  enabledLanguages: z.array(z.string()).min(1, "Selecione ao menos um idioma"),
});

type BusinessSettingsFormValues = z.infer<typeof businessSettingsFormSchema>;

const LANGUAGE_OPTIONS = [
  { value: TranslationsEnum.PT_BR, label: "Português (BR)" },
  { value: TranslationsEnum.EN_US, label: "English (US)" },
  { value: TranslationsEnum.ES, label: "Español" },
];

function buildDefaultValues(settings: GetBusinessSettingsResponse): BusinessSettingsFormValues {
  const enabledLanguages = Array.isArray(settings.enabledLanguages)
    ? settings.enabledLanguages
    : [];
  return {
    primaryColor: settings.primaryColor,
    secondaryColor: settings.secondaryColor,
    enabledLanguages,
  };
}

function ColorPreview({ color }: { color: string }) {
  return (
    <div
      className="size-5 rounded border border-border shrink-0"
      style={{ backgroundColor: color }}
    />
  );
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

function ColorInfoField({ label, color }: { label: string; color: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <ColorPreview color={color} />
        <span className="text-sm font-mono">{color}</span>
      </div>
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

export function BusinessSettingsPage() {
  const { t } = useTranslation();
  const { selectedBusiness } = useBusiness();
  const { requiresBusinessSelection, isAdmin } = useRoles();
  const { hasPermissionTo } = usePermissions();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const hasBusinessSelected = requiresBusinessSelection ? selectedBusiness !== null : true;

  const hasEditPermission = hasPermissionTo(PermissionEnum.EDIT_BUSINESS_SETTINGS);
  const canEdit = isAdmin || hasEditPermission;

  const queryKey = useMemo(
    () => ["business-settings", selectedBusiness?.id],
    [selectedBusiness?.id]
  );

  const { data: settings, isLoading, isError } = useQuery({
    queryKey,
    queryFn: async () => {
      const result = await businessSettingsService.get();
      const hasError = "error" in result;
      if (hasError) {
        const error = new Error(result.error);
        logger.error("[BusinessSettingsPage] Failed to load settings", error);
        throw error;
      }
      return result.data;
    },
    enabled: hasBusinessSelected,
  });

  const form = useForm<BusinessSettingsFormValues>({
    resolver: zodResolver(businessSettingsFormSchema),
    defaultValues: {
      primaryColor: "#000000",
      secondaryColor: "#000000",
      enabledLanguages: [],
    },
  });

  const handleStartEdit = useCallback(() => {
    if (settings) {
      const defaultValues = buildDefaultValues(settings);
      form.reset(defaultValues);
    }
    setIsEditing(true);
  }, [settings, form]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    form.reset();
  }, [form]);

  const handleSubmit = useCallback(
    async (values: BusinessSettingsFormValues) => {
      setIsSaving(true);

      const result = await businessSettingsService.update(values);
      setIsSaving(false);

      const hasError = "error" in result;
      if (hasError) {
        const error = new Error(result.error);
        toast.error(result.error);
        logger.error("[BusinessSettingsPage] Failed to update settings", error);
        return;
      }

      toast.success(t("business.settings.updateSuccess"));
      queryClient.invalidateQueries({ queryKey });
      setIsEditing(false);
    },
    [queryClient, queryKey, t]
  );

  const showEditButton = canEdit && !isEditing && !isLoading && Boolean(settings);
  const saveButtonLabel = isSaving ? t("business.actions.saving") : t("business.actions.save");

  const editButton = showEditButton ? (
    <Button variant="outline" size="sm" onClick={handleStartEdit}>
      <PencilSimple className="size-4" />
      {t("business.actions.edit")}
    </Button>
  ) : null;

  const pageHeader = (
    <div className="flex items-start justify-between">
      <h1 className="text-2xl font-bold">{t("business.settings.title")}</h1>
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
      <p className="text-sm text-destructive">{t("business.settings.loadError")}</p>
    </div>
  );

  const loadingContent = (
    <div className="grid grid-cols-1 gap-4">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex flex-col gap-1">
          <div className="h-4 w-24 bg-muted animate-pulse rounded" />
          <div className="h-4 w-48 bg-muted animate-pulse rounded" />
        </div>
      ))}
    </div>
  );

  const enabledLanguagesLabels = useMemo(() => {
    if (!settings) return "—";
    const languages = Array.isArray(settings.enabledLanguages) ? settings.enabledLanguages : [];
    const labels = languages
      .map((lang) => {
        const option = LANGUAGE_OPTIONS.find((o) => o.value === lang);
        return option?.label ?? lang;
      })
      .join(", ");
    return labels || "—";
  }, [settings]);

  const viewContent = useMemo(() => {
    if (!settings) return null;
    return (
      <div className="grid grid-cols-1 gap-4">
        <ColorInfoField
          label={t("business.settings.primaryColor")}
          color={settings.primaryColor}
        />
        <ColorInfoField
          label={t("business.settings.secondaryColor")}
          color={settings.secondaryColor}
        />
        <InfoField
          label={t("business.settings.enabledLanguages")}
          value={enabledLanguagesLabels}
        />
      </div>
    );
  }, [settings, t, enabledLanguagesLabels]);

  const primaryColorError = form.formState.errors.primaryColor?.message;
  const secondaryColorError = form.formState.errors.secondaryColor?.message;
  const enabledLanguagesError = form.formState.errors.enabledLanguages?.message;

  const editContent = useMemo(() => {
    if (!isEditing) return null;
    return (
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-4">
          <FormField label={t("business.settings.primaryColor")} error={primaryColorError}>
            <div className="flex items-center gap-2">
              <input
                type="color"
                {...form.register("primaryColor")}
                className="h-9 w-14 cursor-pointer rounded-md border border-input bg-transparent p-1"
              />
              <Input
                {...form.register("primaryColor")}
                className="font-mono"
                placeholder="#000000"
              />
            </div>
          </FormField>
          <FormField label={t("business.settings.secondaryColor")} error={secondaryColorError}>
            <div className="flex items-center gap-2">
              <input
                type="color"
                {...form.register("secondaryColor")}
                className="h-9 w-14 cursor-pointer rounded-md border border-input bg-transparent p-1"
              />
              <Input
                {...form.register("secondaryColor")}
                className="font-mono"
                placeholder="#000000"
              />
            </div>
          </FormField>
          <FormField
            label={t("business.settings.enabledLanguages")}
            error={enabledLanguagesError}
          >
            <Controller
              control={form.control}
              name="enabledLanguages"
              render={({ field }) => (
                <MultiSelect
                  options={LANGUAGE_OPTIONS}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </FormField>
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
  }, [
    isEditing,
    form,
    handleSubmit,
    handleCancel,
    isSaving,
    t,
    primaryColorError,
    secondaryColorError,
    enabledLanguagesError,
    saveButtonLabel,
  ]);

  const shouldShowNoBusinessContent = requiresBusinessSelection && !selectedBusiness;
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

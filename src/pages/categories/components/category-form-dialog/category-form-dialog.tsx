import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Dialog } from "@/components/ui/dialog/dialog";
import { Input } from "@/components/ui/input/input";
import { Label } from "@/components/ui/label/label";
import { categoriesService } from "@/services/categories/categories.service";
import { categoryFormSchema } from "@/shared/schemas/category.schema";
import type { CategoryForm, CategoryTranslation } from "@/shared/schemas/category.schema";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { useLanguage } from "@/shared/hooks/useLanguage";
import type { TranslationLanguage } from "@/shared/enums/translations.enum";
import { logger } from "@/lib/logger";
import type { CategoryFormDialogProps } from "./category-form-dialog.interface";
import { Fields } from "./fields";
import { Field } from "./field";
import { Footer } from "./footer";
import { LanguageSwitcher } from "./language-switcher";
import { UnsavedChangesDialog } from "./unsaved-changes-dialog";

function CategoryFormDialogRoot({ open, onOpenChange, category }: CategoryFormDialogProps) {
  const { t } = useTranslation();
  const { language, addLanguagePrefix } = useLanguage();
  const queryClient = useQueryClient();
  const isEditing = category !== undefined;

  const [allTranslations, setAllTranslations] = useState<CategoryTranslation[]>([]);
  const [editingLanguage, setEditingLanguage] = useState<TranslationLanguage>(language);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [pendingLanguage, setPendingLanguage] = useState<TranslationLanguage | null>(null);
  const hasInitializedRef = useRef(false);

  const defaultTranslation = useMemo(() => ({
    locale: language,
    name: "",
    description: "",
  }), [language]);

  const categoryId = category?.id;
  const shouldFetchTranslations = open && isEditing && Boolean(categoryId);

  const { data: translationsData, isLoading: isLoadingTranslations } = useQuery({
    queryKey: addLanguagePrefix("category-translations", categoryId),
    queryFn: async () => {
      if (!categoryId) return null;
      const result = await categoriesService.getTranslations(categoryId);
      const hasError = "error" in result;
      if (hasError) {
        toast.error(t("categories.form.translationsLoadError"));
        logger.error("Erro ao carregar traduções da categoria", new Error(result.error));
        return null;
      }
      return result.data;
    },
    enabled: shouldFetchTranslations,
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<CategoryForm>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      translations: [defaultTranslation],
      sortOrder: 0,
      active: true,
    },
  });

  const checkUnsavedChanges = useCallback(() => {
    const formValues = getValues();
    const currentName = formValues.translations[0].name;
    const currentDescription = formValues.translations[0].description;

    const existingTranslation = allTranslations.find(
      (t) => t.locale === editingLanguage
    );

    const hasExistingTranslation = Boolean(existingTranslation);
    if (!hasExistingTranslation) {
      const hasAnyContent = currentName || currentDescription;
      return hasAnyContent;
    }

    const existingName = existingTranslation!.name;
    const existingDescription = existingTranslation!.description ?? "";
    const nameChanged = currentName !== existingName;
    const descriptionChanged = currentDescription !== existingDescription;
    const hasChanges = nameChanged || descriptionChanged;

    return hasChanges;
  }, [getValues, allTranslations, editingLanguage]);

  const switchToLanguage = useCallback(
    (newLanguage: TranslationLanguage) => {
      const formValues = getValues();
      const currentName = formValues.translations[0].name;
      const currentDescription = formValues.translations[0].description;

      const currentTranslation = {
        locale: editingLanguage,
        name: currentName,
        description: currentDescription,
      };

      const updatedTranslations = allTranslations.filter(
        (t) => t.locale !== editingLanguage
      );
      updatedTranslations.push(currentTranslation);
      setAllTranslations(updatedTranslations);

      const targetTranslation = updatedTranslations.find(
        (t) => t.locale === newLanguage
      );

      const hasTargetTranslation = Boolean(targetTranslation);
      if (hasTargetTranslation) {
        const targetName = targetTranslation!.name;
        const targetDescription = targetTranslation!.description ?? "";
        setValue("translations.0.locale", newLanguage);
        setValue("translations.0.name", targetName);
        setValue("translations.0.description", targetDescription);
      } else {
        setValue("translations.0.locale", newLanguage);
        setValue("translations.0.name", "");
        setValue("translations.0.description", "");
      }

      setEditingLanguage(newLanguage);
    },
    [getValues, setValue, allTranslations, editingLanguage]
  );

  const handleLanguageChange = useCallback(
    (newLanguage: TranslationLanguage) => {
      const startTime = performance.now();

      const isSameLanguage = newLanguage === editingLanguage;
      if (isSameLanguage) return;

      const hasUnsaved = checkUnsavedChanges();
      if (hasUnsaved) {
        setPendingLanguage(newLanguage);
        setShowUnsavedDialog(true);
        return;
      }

      switchToLanguage(newLanguage);

      const endTime = performance.now();
      const duration = endTime - startTime;
      const isSlowOperation = duration > 100;
      if (isSlowOperation) {
        logger.warn(`Language switch took ${duration.toFixed(2)}ms`, {
          from: editingLanguage,
          to: newLanguage,
        });
      }
    },
    [editingLanguage, checkUnsavedChanges, switchToLanguage]
  );

  const handleConfirmLanguageSwitch = useCallback(() => {
    const hasPendingLanguage = pendingLanguage !== null;
    if (hasPendingLanguage) {
      switchToLanguage(pendingLanguage);
    }
    setShowUnsavedDialog(false);
    setPendingLanguage(null);
  }, [pendingLanguage, switchToLanguage]);

  const handleCancelLanguageSwitch = useCallback(() => {
    setShowUnsavedDialog(false);
    setPendingLanguage(null);
  }, []);

  useEffect(() => {
    const shouldResetInitFlag = !open;
    if (shouldResetInitFlag) {
      hasInitializedRef.current = false;
      return;
    }

    const isAlreadyInitialized = hasInitializedRef.current;
    if (isAlreadyInitialized) {
      return;
    }

    const shouldPopulateFormForEdit = isEditing && Boolean(category);
    if (shouldPopulateFormForEdit) {
      const hasTranslationsData = Boolean(translationsData?.translations);
      if (!hasTranslationsData || !translationsData) {
        return;
      }

      const allFetchedTranslations = translationsData.translations;
      setAllTranslations(allFetchedTranslations);

      const currentLangTranslation = allFetchedTranslations.find(
        (t) => t.locale === editingLanguage
      );

      const hasCurrentLangTranslation = Boolean(currentLangTranslation);
      const translationToUse = hasCurrentLangTranslation
        ? currentLangTranslation
        : allFetchedTranslations[0];

      const hasTranslationToUse = Boolean(translationToUse);
      if (!hasTranslationToUse) {
        return;
      }

      const translationLocale = translationToUse!.locale as TranslationLanguage;
      const translationName = translationToUse!.name;
      const translationDescription = translationToUse!.description ?? "";

      reset({
        translations: [
          {
            locale: translationLocale,
            name: translationName,
            description: translationDescription,
          },
        ],
        sortOrder: category.sortOrder,
        active: category.active,
      });

      setEditingLanguage(translationLocale);
      hasInitializedRef.current = true;
      return;
    }

    const shouldResetFormForCreate = !isEditing;
    if (shouldResetFormForCreate) {
      const initialTranslation = {
        locale: language,
        name: "",
        description: "",
      };

      setAllTranslations([initialTranslation]);
      setEditingLanguage(language);

      reset({
        translations: [initialTranslation],
        sortOrder: 0,
        active: true,
      });

      hasInitializedRef.current = true;
    }
  }, [open, isEditing, category, reset, translationsData, editingLanguage, language]);

  const createMutation = useMutation({
    mutationFn: (data: CategoryForm) => categoriesService.create(data),
    onSuccess: (result) => {
      const hasError = "error" in result;
      if (hasError) {
        toast.error(result.error);
        return;
      }
      toast.success(t("categories.form.createSuccess"));
      queryClient.invalidateQueries({ queryKey: addLanguagePrefix("categories") });
      onOpenChange(false);
    },
    onError: () => {
      toast.error(t("categories.form.createError"));
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: CategoryForm) => {
      if (!categoryId) {
        return Promise.resolve({ error: "ID da categoria não encontrado" });
      }
      return categoriesService.update(categoryId, data);
    },
    onSuccess: (result) => {
      const hasError = "error" in result;
      if (hasError) {
        toast.error(result.error);
        return;
      }
      toast.success(t("categories.form.updateSuccess"));
      queryClient.invalidateQueries({ queryKey: addLanguagePrefix("categories") });
      queryClient.invalidateQueries({
        queryKey: addLanguagePrefix("category-translations", category?.id)
      });
      onOpenChange(false);
    },
    onError: () => {
      toast.error(t("categories.form.updateError"));
    },
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  const onSubmit = useCallback(
    (data: CategoryForm) => {
      const currentName = data.translations[0].name;
      const currentDescription = data.translations[0].description;

      const currentTranslation = {
        locale: editingLanguage,
        name: currentName,
        description: currentDescription,
      };

      const otherTranslations = allTranslations.filter(
        (t) => t.locale !== editingLanguage
      );

      const allCollectedTranslations = [...otherTranslations, currentTranslation];

      const validTranslations = allCollectedTranslations.filter(
        (t) => t.name && t.name.trim().length > 0
      );

      const hasNoValidTranslations = validTranslations.length === 0;
      if (hasNoValidTranslations) {
        toast.error(t("categories.errors.noTranslations"));
        return;
      }

      const finalData = {
        ...data,
        translations: validTranslations,
      };

      if (isEditing && categoryId) {
        updateMutation.mutate(finalData);
      } else {
        createMutation.mutate(finalData);
      }
    },
    [isEditing, categoryId, createMutation, updateMutation, editingLanguage, allTranslations, t]
  );

  const translationNameError = errors.translations?.[0]?.name?.message;
  const translationDescriptionError = errors.translations?.[0]?.description?.message;

  const dialogTitle = isEditing ? t("categories.form.editTitle") : t("categories.form.createTitle");
  const submitLabel = isEditing ? t("categories.form.saveButton") : t("categories.form.createButton");

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <Dialog.Content className="max-w-md">
          <Dialog.Header>
            <div className="flex flex-col gap-1.5">
              <Dialog.Title>{dialogTitle}</Dialog.Title>
              <Dialog.Description>
                {isEditing
                  ? t("categories.form.editDescription")
                  : t("categories.form.createDescription")}
              </Dialog.Description>
            </div>
            <Dialog.Close />
          </Dialog.Header>

          <LanguageSwitcher
            editingLanguage={editingLanguage}
            onLanguageChange={handleLanguageChange}
            disabled={isPending || isLoadingTranslations}
          />

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Fields>
              <input type="hidden" {...register("translations.0.locale")} value={editingLanguage} />

            <Field
              label={t("categories.form.fields.name")}
              htmlFor="name"
              error={translationNameError}
              required
            >
              <Input
                id="name"
                {...register("translations.0.name")}
                aria-invalid={translationNameError ? true : undefined}
                placeholder={t("categories.form.placeholders.name")}
              />
            </Field>

            <Field
              label={t("categories.form.fields.description")}
              htmlFor="description"
              error={translationDescriptionError}
            >
              <textarea
                id="description"
                {...register("translations.0.description")}
                rows={3}
                placeholder={t("categories.form.placeholders.description")}
                className="flex w-full rounded-md border border-input bg-input/30 px-3 py-2 text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] resize-none"
              />
            </Field>

            <Field
              label={t("categories.form.fields.sortOrder")}
              htmlFor="sortOrder"
              error={errors.sortOrder?.message}
            >
              <Input
                id="sortOrder"
                type="number"
                min="0"
                {...register("sortOrder", { valueAsNumber: true })}
                aria-invalid={errors.sortOrder ? true : undefined}
                placeholder={t("categories.form.placeholders.sortOrder")}
              />
            </Field>

            <div className="flex items-center gap-3">
              <input
                id="active"
                type="checkbox"
                {...register("active")}
                className="size-4 rounded border-input accent-primary"
              />
              <Label htmlFor="active" className="cursor-pointer">
                {t("categories.form.fields.active")}
              </Label>
            </div>
          </Fields>

          <Footer
            onCancel={() => onOpenChange(false)}
            isPending={isPending}
            submitLabel={submitLabel}
          />
        </form>
      </Dialog.Content>
    </Dialog>

    <UnsavedChangesDialog
      open={showUnsavedDialog}
      onOpenChange={setShowUnsavedDialog}
      onConfirm={handleConfirmLanguageSwitch}
      onCancel={handleCancelLanguageSwitch}
    />
  </>
  );
}

CategoryFormDialogRoot.Fields = Fields;
CategoryFormDialogRoot.Field = Field;
CategoryFormDialogRoot.Footer = Footer;

export { CategoryFormDialogRoot as CategoryFormDialog };

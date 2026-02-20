import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Dialog } from "@/components/ui/dialog/dialog";
import { Button } from "@/components/ui/button/button";
import { Input } from "@/components/ui/input/input";
import { Label } from "@/components/ui/label/label";
import { categoriesService } from "@/services/categories/categories.service";
import { categoryFormSchema } from "@/shared/schemas/category.schema";
import type { Category, CategoryForm } from "@/shared/schemas/category.schema";
import { useTranslation } from "@/shared/hooks/useTranslation";

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category;
}

interface FieldProps {
  children: React.ReactNode;
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
}

interface FieldsProps {
  children: React.ReactNode;
}

interface FooterProps {
  onCancel: () => void;
  isPending: boolean;
  submitLabel: string;
}

function Fields({ children }: FieldsProps) {
  return (
    <div className="px-6 flex flex-col gap-4">
      {children}
    </div>
  );
}

function Field({ children, label, htmlFor, error, required }: FieldProps) {
  const hasError = Boolean(error);

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor}>
        {label}
        {required && " *"}
      </Label>
      {children}
      {hasError && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}

function Footer({ onCancel, isPending, submitLabel }: FooterProps) {
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

function CategoryFormDialogRoot({ open, onOpenChange, category }: CategoryFormDialogProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const isEditing = category !== undefined;
  const categoryId = category?.id ?? "";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryForm>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      description: "",
      sortOrder: 0,
      active: true,
    },
  });

  useEffect(() => {
    const shouldPopulateForm = open && isEditing && category;
    if (shouldPopulateForm) {
      reset({
        name: category.name,
        description: category.description ?? "",
        sortOrder: category.sortOrder,
        active: category.active,
      });
      return;
    }

    const shouldResetForm = open && !isEditing;
    if (shouldResetForm) {
      reset({
        name: "",
        description: "",
        sortOrder: 0,
        active: true,
      });
    }
  }, [open, isEditing, category, reset]);

  const createMutation = useMutation({
    mutationFn: (data: CategoryForm) => categoriesService.create(data),
    onSuccess: (result) => {
      const hasError = "error" in result;
      if (hasError) {
        toast.error(result.error);
        return;
      }
      toast.success(t("categories.form.createSuccess"));
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      onOpenChange(false);
    },
    onError: () => {
      toast.error(t("categories.form.createError"));
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: CategoryForm) => categoriesService.update(categoryId, data),
    onSuccess: (result) => {
      const hasError = "error" in result;
      if (hasError) {
        toast.error(result.error);
        return;
      }
      toast.success(t("categories.form.updateSuccess"));
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      onOpenChange(false);
    },
    onError: () => {
      toast.error(t("categories.form.updateError"));
    },
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (data: CategoryForm) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const dialogTitle = isEditing ? t("categories.form.editTitle") : t("categories.form.createTitle");
  const submitLabel = isEditing ? t("categories.form.saveButton") : t("categories.form.createButton");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="max-w-md">
        <Dialog.Header>
          <Dialog.Title>{dialogTitle}</Dialog.Title>
          <Dialog.Close />
        </Dialog.Header>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Fields>
            <Field
              label={t("categories.form.fields.name")}
              htmlFor="name"
              error={errors.name?.message}
              required
            >
              <Input
                id="name"
                {...register("name")}
                aria-invalid={errors.name ? true : undefined}
                placeholder={t("categories.form.placeholders.name")}
              />
            </Field>

            <Field
              label={t("categories.form.fields.description")}
              htmlFor="description"
              error={errors.description?.message}
            >
              <textarea
                id="description"
                {...register("description")}
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
  );
}

CategoryFormDialogRoot.Fields = Fields;
CategoryFormDialogRoot.Field = Field;
CategoryFormDialogRoot.Footer = Footer;

export { CategoryFormDialogRoot as CategoryFormDialog };

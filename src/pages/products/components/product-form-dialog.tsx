import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Dialog } from "@/components/ui/dialog/dialog";
import { Button } from "@/components/ui/button/button";
import { Input } from "@/components/ui/input/input";
import { Label } from "@/components/ui/label/label";
import { Combobox } from "@/components/ui/combobox/combobox";
import { productsService } from "@/services/products/products.service";
import { productFormSchema } from "@/shared/schemas/product.schema";
import type { Product, ProductForm } from "@/shared/schemas/product.schema";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { useCategories } from "@/shared/hooks/useCategories";

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product;
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

const UNIT_OPTIONS: { value: ProductForm["unit"]; label: string }[] = [
  { value: "un", label: "Unidade (un)" },
  { value: "kg", label: "Quilograma (kg)" },
  { value: "g", label: "Grama (g)" },
  { value: "l", label: "Litro (l)" },
  { value: "ml", label: "Mililitro (ml)" },
];

function Fields({ children }: FieldsProps) {
  return (
    <div className="px-6 flex flex-col gap-4">
      {children}
    </div>
  );
}

function Field({ children, label, htmlFor, error, required }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor}>
        {label}
        {required && " *"}
      </Label>
      {children}
      {error && (
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

function ProductFormDialogRoot({ open, onOpenChange, product }: ProductFormDialogProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const isEditing = product !== undefined;

  const { categories, isLoading: isLoadingCategories } = useCategories({ initialSize: 100 });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductForm>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      description: "",
      categoryId: "",
      price: 0,
      stock: 0,
      unit: "un",
      imageUrl: undefined,
      active: true,
    },
  });

  useEffect(() => {
    const shouldPopulateForm = open && isEditing && product;
    if (shouldPopulateForm) {
      reset({
        name: product.name,
        description: product.description ?? "",
        categoryId: product.categoryId,
        price: product.price,
        stock: product.stock,
        unit: product.unit,
        imageUrl: product.imageUrl ?? "",
        active: product.active,
      });
      return;
    }

    const shouldResetForm = open && !isEditing;
    if (shouldResetForm) {
      reset({
        name: "",
        description: "",
        categoryId: "",
        price: 0,
        stock: 0,
        unit: "un",
        imageUrl: "",
        active: true,
      });
    }
  }, [open, isEditing, product, reset]);

  const createMutation = useMutation({
    mutationFn: (data: ProductForm) => productsService.create(data),
    onSuccess: (result) => {
      const hasError = "error" in result;
      if (hasError) {
        toast.error(result.error);
        return;
      }
      toast.success(t("products.form.createSuccess"));
      queryClient.invalidateQueries({ queryKey: ["products"] });
      onOpenChange(false);
    },
    onError: () => {
      toast.error(t("products.form.createError"));
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: ProductForm) => productsService.update(product!.id, data),
    onSuccess: (result) => {
      const hasError = "error" in result;
      if (hasError) {
        toast.error(result.error);
        return;
      }
      toast.success(t("products.form.updateSuccess"));
      queryClient.invalidateQueries({ queryKey: ["products"] });
      onOpenChange(false);
    },
    onError: () => {
      toast.error(t("products.form.updateError"));
    },
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (data: ProductForm) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const dialogTitle = isEditing ? t("products.form.editTitle") : t("products.form.createTitle");
  const submitLabel = isEditing ? t("products.form.saveButton") : t("products.form.createButton");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="max-w-xl max-h-[90vh] overflow-y-auto">
        <Dialog.Header>
          <Dialog.Title>{dialogTitle}</Dialog.Title>
          <Dialog.Close />
        </Dialog.Header>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Fields>
            <Field
              label={t("products.form.fields.name")}
              htmlFor="name"
              error={errors.name?.message}
              required
            >
              <Input
                id="name"
                {...register("name")}
                aria-invalid={errors.name ? true : undefined}
                placeholder={t("products.form.placeholders.name")}
              />
            </Field>

            <Field
              label={t("products.form.fields.description")}
              htmlFor="description"
            >
              <textarea
                id="description"
                {...register("description")}
                rows={3}
                placeholder={t("products.form.placeholders.description")}
                className="flex w-full rounded-md border border-input bg-input/30 px-3 py-2 text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] resize-none"
              />
            </Field>

            <Field
              label={t("products.form.fields.category")}
              htmlFor="categoryId"
              error={errors.categoryId?.message}
              required
            >
              <Combobox
                options={categories.map((cat) => ({
                  value: cat.id,
                  label: cat.name,
                }))}
                value={watch("categoryId")}
                onChange={(value) => setValue("categoryId", value)}
                placeholder={t("products.form.placeholders.category")}
                searchPlaceholder="Buscar categoria..."
                emptyMessage="Nenhuma categoria encontrada"
                isLoading={isLoadingCategories}
                disabled={isPending}
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field
                label={t("products.form.fields.price")}
                htmlFor="price"
                error={errors.price?.message}
                required
              >
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  {...register("price", { valueAsNumber: true })}
                  aria-invalid={errors.price ? true : undefined}
                  placeholder="0,00"
                />
              </Field>

              <Field
                label={t("products.form.fields.stock")}
                htmlFor="stock"
                error={errors.stock?.message}
                required
              >
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  {...register("stock", { valueAsNumber: true })}
                  aria-invalid={errors.stock ? true : undefined}
                  placeholder="0"
                />
              </Field>
            </div>

            <Field
              label={t("products.form.fields.unit")}
              htmlFor="unit"
              required
            >
              <select
                id="unit"
                {...register("unit")}
                className="flex h-9 w-full rounded-md border border-input bg-input/30 px-3 py-1 text-sm transition-colors focus-visible:outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              >
                {UNIT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              label={t("products.form.fields.imageUrl")}
              htmlFor="imageUrl"
              error={errors.imageUrl?.message}
            >
              <Input
                id="imageUrl"
                {...register("imageUrl")}
                aria-invalid={errors.imageUrl ? true : undefined}
                placeholder="https://..."
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
                {t("products.form.fields.active")}
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

ProductFormDialogRoot.Fields = Fields;
ProductFormDialogRoot.Field = Field;
ProductFormDialogRoot.Footer = Footer;

export { ProductFormDialogRoot as ProductFormDialog };

import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { XIcon } from "@phosphor-icons/react";
import { logger } from "@/lib/logger";
import { Dialog } from "@/components/ui/dialog/dialog";
import { Button } from "@/components/ui/button/button";
import { Input } from "@/components/ui/input/input";
import { InputFile } from "@/components/ui/input-file/input-file";
import { Label } from "@/components/ui/label/label";
import { Combobox } from "@/components/ui/combobox/combobox";
import { productsService } from "@/services/products/products.service";
import { productFormSchema } from "@/shared/schemas/product.schema";
import type { Product, ProductForm, ProductImage } from "@/shared/schemas/product.schema";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { useCategories } from "@/shared/hooks/useCategories";
import { useLanguage } from "@/shared/hooks/useLanguage";

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

interface ImagePreview {
  url: string;
  name: string;
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
  const { language, addLanguagePrefix } = useLanguage();
  const queryClient = useQueryClient();
  const isEditing = product !== undefined;

  const { categories, isLoading: isLoadingCategories } = useCategories({ initialSize: 100 });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);

  const defaultTranslation = useMemo(() => ({
    locale: language,
    name: "",
    description: "",
  }), [language]);

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
      translations: [defaultTranslation],
      categoryId: "",
      price: 0,
      stock: 0,
      unit: "un",
      images: [],
      active: true,
    },
  });

  useEffect(() => {
    const shouldPopulateForm = open && isEditing && product;
    if (shouldPopulateForm) {
      reset({
        translations: [
          {
            locale: language,
            name: product.name,
            description: product.description ?? "",
          },
        ],
        categoryId: product.categoryId,
        price: product.price,
        stock: product.stock,
        unit: product.unit,
        images: product.images ?? [],
        active: product.active,
      });
      setSelectedFiles([]);
      setImagePreviews([]);
      return;
    }

    const shouldResetForm = open && !isEditing;
    if (shouldResetForm) {
      reset({
        translations: [defaultTranslation],
        categoryId: "",
        price: 0,
        stock: 0,
        unit: "un",
        images: [],
        active: true,
      });
      setSelectedFiles([]);
      setImagePreviews([]);
    }
  }, [open, isEditing, product, reset, language, defaultTranslation]);

  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => {
        URL.revokeObjectURL(preview.url);
      });
    };
  }, [imagePreviews]);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      const hasNoFiles = !files || files.length === 0;
      if (hasNoFiles) return;

      const newFiles = Array.from(files);
      setSelectedFiles((prev) => [...prev, ...newFiles]);

      const newPreviews = newFiles.map((file) => ({
        url: URL.createObjectURL(file),
        name: file.name,
      }));
      setImagePreviews((prev) => [...prev, ...newPreviews]);

      event.target.value = "";
    },
    []
  );

  const handleRemoveNewImage = useCallback(
    (index: number) => {
      setSelectedFiles((prev) => {
        const updated = [...prev];
        updated.splice(index, 1);
        return updated;
      });

      setImagePreviews((prev) => {
        const removed = prev[index];
        URL.revokeObjectURL(removed.url);
        const updated = [...prev];
        updated.splice(index, 1);
        return updated;
      });
    },
    []
  );

  const handleRemoveExistingImage = useCallback(
    async (index: number) => {
      const currentImages = watch("images") ?? [];
      const imageToRemove = currentImages[index];
      const updatedImages = currentImages.filter((_: ProductImage, i: number) => i !== index);
      setValue("images", updatedImages);

      const isEditingProduct = isEditing && product?.id;
      if (!isEditingProduct) return;

      const fileId = imageToRemove.id;

      const result = await productsService.deleteFile(product.id, fileId);
      const hasError = "error" in result;

      if (hasError) {
        setValue("images", currentImages);
        toast.error(t("products.form.imageDeleteError"));
        logger.error("Falha ao remover imagem do produto", new Error(result.error));
        return;
      }

      toast.success(t("products.form.imageDeleteSuccess"));
    },
    [watch, setValue, isEditing, product, t]
  );

  const existingImages = watch("images") ?? [];

  const createMutation = useMutation({
    mutationFn: (params: { data: ProductForm; files: File[] }) =>
      productsService.create(params.data, params.files),
    onSuccess: (result) => {
      const hasError = "error" in result;
      if (hasError) {
        toast.error(result.error);
        return;
      }
      toast.success(t("products.form.createSuccess"));
      queryClient.invalidateQueries({ queryKey: addLanguagePrefix("products") });
      onOpenChange(false);
    },
    onError: () => {
      toast.error(t("products.form.createError"));
    },
  });

  const updateMutation = useMutation({
    mutationFn: (params: { data: ProductForm; files: File[] }) =>
      productsService.update(product!.id, params.data, params.files),
    onSuccess: (result) => {
      const hasError = "error" in result;
      if (hasError) {
        toast.error(result.error);
        return;
      }
      toast.success(t("products.form.updateSuccess"));
      queryClient.invalidateQueries({ queryKey: addLanguagePrefix("products") });
      onOpenChange(false);
    },
    onError: () => {
      toast.error(t("products.form.updateError"));
    },
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  const onSubmit = useCallback(
    (data: ProductForm) => {
      const hasFiles = selectedFiles.length > 0;
      const files = hasFiles ? selectedFiles : [];

      if (isEditing) {
        updateMutation.mutate({ data, files });
      } else {
        createMutation.mutate({ data, files });
      }
    },
    [isEditing, selectedFiles, createMutation, updateMutation]
  );

  const translationNameError = errors.translations?.[0]?.name?.message;
  const translationDescriptionError = errors.translations?.[0]?.description?.message;

  const dialogTitle = isEditing ? t("products.form.editTitle") : t("products.form.createTitle");
  const submitLabel = isEditing ? t("products.form.saveButton") : t("products.form.createButton");

  const hasExistingImages = existingImages.length > 0;
  const hasNewPreviews = imagePreviews.length > 0;
  const hasAnyImages = hasExistingImages || hasNewPreviews;

  const existingImagesList = useMemo(() => {
    if (!hasExistingImages) return null;

    return existingImages.map((image: ProductImage, index: number) => {
      const imageUrl = image.url;
      const imageId = image.id;
      const altText = `${t("products.form.fields.images")} ${index + 1}`;

      return (
        <div key={imageId} className="relative group">
          <img
            src={imageUrl}
            alt={altText}
            className="w-20 h-20 object-cover rounded-md border border-border"
          />
          <button
            type="button"
            onClick={() => handleRemoveExistingImage(index)}
            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity hover:cursor-pointer"
          >
            <XIcon size={12} />
          </button>
        </div>
      );
    });
  }, [existingImages, hasExistingImages, handleRemoveExistingImage, t]);

  const newImagesList = useMemo(() => {
    if (!hasNewPreviews) return null;

    return imagePreviews.map((preview, index) => (
      <div key={preview.url} className="relative group">
        <img
          src={preview.url}
          alt={preview.name}
          className="w-20 h-20 object-cover rounded-md border border-border"
        />
        <button
          type="button"
          onClick={() => handleRemoveNewImage(index)}
          className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity hover:cursor-pointer"
        >
          <XIcon size={12} />
        </button>
      </div>
    ));
  }, [imagePreviews, hasNewPreviews, handleRemoveNewImage]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="max-w-xl max-h-[90vh] overflow-y-auto">
        <Dialog.Header>
          <div className="flex flex-col gap-1.5">
            <Dialog.Title>{dialogTitle}</Dialog.Title>
            <Dialog.Description>
              {isEditing
                ? t("products.form.editDescription")
                : t("products.form.createDescription")}
            </Dialog.Description>
          </div>
          <Dialog.Close />
        </Dialog.Header>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Fields>
            <input type="hidden" {...register("translations.0.locale")} value={language} />

            <Field
              label={t("products.form.fields.name")}
              htmlFor="name"
              error={translationNameError}
              required
            >
              <Input
                id="name"
                {...register("translations.0.name")}
                aria-invalid={translationNameError ? true : undefined}
                placeholder={t("products.form.placeholders.name")}
              />
            </Field>

            <Field
              label={t("products.form.fields.description")}
              htmlFor="description"
              error={translationDescriptionError}
            >
              <textarea
                id="description"
                {...register("translations.0.description")}
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
              label={t("products.form.fields.images")}
              htmlFor="images"
            >
              <InputFile
                id="images"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                disabled={isPending}
              />
            </Field>

            {hasAnyImages && (
              <div className="flex gap-2 flex-wrap">
                {existingImagesList}
                {newImagesList}
              </div>
            )}

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

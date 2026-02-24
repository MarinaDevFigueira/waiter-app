import type { Product, ProductForm } from "@/shared/schemas/product.schema";
import type { TranslationLanguage } from "@/shared/enums/translations.enum";

export interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product;
}

export interface FieldProps {
  children: React.ReactNode;
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
}

export interface FieldsProps {
  children: React.ReactNode;
}

export interface FooterProps {
  onCancel: () => void;
  isPending: boolean;
  submitLabel: string;
}

export interface LanguageSwitcherProps {
  editingLanguage: TranslationLanguage;
  onLanguageChange: (language: TranslationLanguage) => void;
  disabled: boolean;
}

export interface UnsavedChangesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export interface ImagePreview {
  url: string;
  name: string;
}

export const UNIT_OPTIONS: { value: ProductForm["unit"]; label: string }[] = [
  { value: "un", label: "Unidade (un)" },
  { value: "kg", label: "Quilograma (kg)" },
  { value: "g", label: "Grama (g)" },
  { value: "l", label: "Litro (l)" },
  { value: "ml", label: "Mililitro (ml)" },
];

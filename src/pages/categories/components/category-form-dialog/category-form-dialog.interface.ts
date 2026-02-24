import type { Category, CategoryTranslation } from "@/shared/schemas/category.schema";
import type { TranslationLanguage } from "@/shared/enums/translations.enum";

export interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category;
}

export interface FieldsProps {
  children: React.ReactNode;
}

export interface FieldProps {
  children: React.ReactNode;
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
}

export interface FooterProps {
  onCancel: () => void;
  isPending: boolean;
  submitLabel: string;
}

export interface LanguageSwitcherProps {
  editingLanguage: TranslationLanguage;
  onLanguageChange: (language: TranslationLanguage) => void;
  disabled?: boolean;
}

export interface UnsavedChangesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

import { useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button/button";
import { Label } from "@/components/ui/label/label";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { TranslationsEnum, type TranslationLanguage } from "@/shared/enums/translations.enum";
import type { LanguageSwitcherProps } from "./product-form-dialog.interface";

export function LanguageSwitcher({ editingLanguage, onLanguageChange, disabled }: LanguageSwitcherProps) {
  const { t } = useTranslation();

  const LANGUAGE_OPTIONS = useMemo(
    () => [
      { value: TranslationsEnum.PT_BR, label: "Português (BR)", flag: "🇧🇷" },
      { value: TranslationsEnum.EN_US, label: "English (US)", flag: "🇺🇸" },
      { value: TranslationsEnum.ES, label: "Español", flag: "🇪🇸" },
    ],
    []
  );

  const handleLanguageClick = useCallback(
    (value: TranslationLanguage) => {
      onLanguageChange(value);
    },
    [onLanguageChange]
  );

  const currentLanguageLabel = LANGUAGE_OPTIONS.find((o) => o.value === editingLanguage)?.label;

  return (
    <div className="px-6 py-4 border-b border-border">
      <div className="flex flex-col gap-2">
        <Label>{t("products.form.languageSelector.label")}</Label>
        <div className="flex gap-2">
          {LANGUAGE_OPTIONS.map((option) => {
            const isActive = editingLanguage === option.value;
            const buttonVariant = isActive ? "default" : "outline";

            return (
              <Button
                key={option.value}
                type="button"
                variant={buttonVariant}
                size="sm"
                onClick={() => handleLanguageClick(option.value)}
                disabled={disabled}
                className="flex items-center gap-2"
              >
                <span>{option.flag}</span>
                <span>{option.label}</span>
              </Button>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground">
          {t("products.form.languageSelector.editing")}: {currentLanguageLabel}
        </p>
      </div>
    </div>
  );
}

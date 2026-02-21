import { TranslateIcon, CheckIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu/dropdown-menu";
import { useLanguage } from "@/shared/hooks/useLanguage";
import { TranslationsEnum, type TranslationLanguage } from "@/shared/enums/translations.enum";
import { JSX } from "react";

interface LanguageOption {
  value: TranslationLanguage;
  label: string;
  flag: string;
}

const LANGUAGE_OPTIONS: LanguageOption[] = [
  { value: TranslationsEnum.PT_BR, label: "Português (BR)", flag: "🇧🇷" },
  { value: TranslationsEnum.EN_US, label: "English (US)", flag: "🇺🇸" },
  { value: TranslationsEnum.ES, label: "Español (ES)", flag: "🇪🇸" }
];

export function LanguageSelector(): JSX.Element {
  const { language, setLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          data-testid="language-selector"
          aria-label="Selecionar idioma"
        >
          <TranslateIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LANGUAGE_OPTIONS.map((option) => {
          const isSelected = option.value === language;
          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => setLanguage(option.value)}
              className="gap-2"
              data-testid={`language-option-${option.value}`}
            >
              <span className="text-base">{option.flag}</span>
              <span className="text-muted-foreground">-</span>
              <span className="text-sm">{option.label}</span>
              {isSelected && (
                <CheckIcon className="ml-auto" size={16} weight="bold" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

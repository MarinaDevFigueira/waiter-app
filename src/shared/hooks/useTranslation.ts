import { useLanguage } from "@/shared/hooks/useLanguage";
import { t } from "@/shared/utils/translations";
import type { TranslationLanguage } from "@/shared/enums/translations.enum";

interface UseTranslationReturn {
  t: (key: string, variables?: Record<string, string | number>) => string;
  language: TranslationLanguage;
}

export function useTranslation(): UseTranslationReturn {
  const { language } = useLanguage();

  return {
    t: (key: string, variables?: Record<string, string | number>) => t(key, variables),
    language,
  };
}

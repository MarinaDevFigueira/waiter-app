import { useLanguage } from "@/shared/hooks/useLanguage";
import { t } from "@/shared/utils/translations";

export function useTranslation() {
  const { language } = useLanguage();

  return {
    t: (key, variables) => t(key, variables),
    language,
  };
}

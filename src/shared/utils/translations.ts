import { TranslationsEnum, type TranslationLanguage } from "@/shared/enums/translations.enum";
import ptBR from "@/shared/translations/pt-BR.json";
import enUS from "@/shared/translations/en-US.json";
import es from "@/shared/translations/es.json";

type TranslationRecord = Record<string, unknown>;

const translations: Record<TranslationLanguage, TranslationRecord> = {
  [TranslationsEnum.PT_BR]: ptBR as TranslationRecord,
  [TranslationsEnum.EN_US]: enUS as TranslationRecord,
  [TranslationsEnum.ES]: es as TranslationRecord,
};

let currentLanguage: TranslationLanguage = TranslationsEnum.PT_BR;

export function setLanguage(language: TranslationLanguage): void {
  const isValidLanguage = (Object.values(TranslationsEnum) as string[]).includes(language);
  if (!isValidLanguage) {
    console.warn(`Invalid language: ${language}. Using default: ${TranslationsEnum.PT_BR}`);
    return;
  }
  currentLanguage = language;
}

export function getCurrentLanguage(): TranslationLanguage {
  return currentLanguage;
}

export function t(key: string, variables: Record<string, string | number> = {}): string {
  const keys = key.split(".");
  let value: unknown = translations[currentLanguage];

  for (const k of keys) {
    const hasKey = value !== null && typeof value === "object" && k in (value as Record<string, unknown>);
    if (!hasKey) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    value = (value as Record<string, unknown>)[k];
  }

  const isString = typeof value === "string";
  if (!isString) {
    console.warn(`Translation value is not a string: ${key}`);
    return key;
  }

  let result = value as string;
  for (const [varKey, varValue] of Object.entries(variables)) {
    result = result.replace(new RegExp(`{{${varKey}}}`, "g"), String(varValue));
  }

  return result;
}

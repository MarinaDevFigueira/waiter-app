import { TranslationsEnum } from "@/shared/enums/translations.enum";
import ptBR from "@/shared/translations/pt-BR.json";
import enUS from "@/shared/translations/en-US.json";

const translations = {
  [TranslationsEnum.PT_BR]: ptBR,
  [TranslationsEnum.EN_US]: enUS,
};

let currentLanguage = TranslationsEnum.PT_BR;

export function setLanguage(language) {
  const isValidLanguage = Object.values(TranslationsEnum).includes(language);
  if (!isValidLanguage) {
    console.warn(`Invalid language: ${language}. Using default: ${TranslationsEnum.PT_BR}`);
    return;
  }
  currentLanguage = language;
}

export function getCurrentLanguage() {
  return currentLanguage;
}

export function t(key, variables = {}) {
  const keys = key.split(".");
  let value = translations[currentLanguage];

  for (const k of keys) {
    const hasKey = value && typeof value === "object" && k in value;
    if (!hasKey) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    value = value[k];
  }

  const isString = typeof value === "string";
  if (!isString) {
    console.warn(`Translation value is not a string: ${key}`);
    return key;
  }

  let result = value;
  for (const [varKey, varValue] of Object.entries(variables)) {
    result = result.replace(new RegExp(`{{${varKey}}}`, "g"), varValue);
  }

  return result;
}

import { BehaviorSubject, type Subscription } from "rxjs";
import { StorageKeys } from "@/shared/constants/storage-keys";
import { TranslationsEnum, type TranslationLanguage } from "@/shared/enums/translations.enum";
import { setLanguage as setTranslationLanguage } from "@/shared/utils/translations";
import { cookies } from "@/lib/cookies";

const getStoredLanguage = (): TranslationLanguage | null => {
  const stored = localStorage.getItem(StorageKeys.LANGUAGE);
  const validLanguages = Object.values(TranslationsEnum) as string[];
  const isValidLanguage = stored !== null && validLanguages.includes(stored);
  if (isValidLanguage) {
    return stored as TranslationLanguage;
  }
  return null;
};

const getInitialLanguage = (): TranslationLanguage => {
  const storedLanguage = getStoredLanguage();
  const hasStoredLanguage = storedLanguage !== null;
  if (hasStoredLanguage) {
    return storedLanguage;
  }
  return TranslationsEnum.PT_BR;
};

const applyLanguage = (language: TranslationLanguage): void => {
  setTranslationLanguage(language);
  document.documentElement.lang = language;
  cookies.set("user_language", language);
};

const initialLanguage = getInitialLanguage();
applyLanguage(initialLanguage);

const languageSubject = new BehaviorSubject<TranslationLanguage>(initialLanguage);

export const languageObservable = {
  subscribe: (callback: (value: TranslationLanguage) => void): Subscription =>
    languageSubject.subscribe(callback),
  getValue: (): TranslationLanguage => languageSubject.getValue(),
  setLanguage: (language: TranslationLanguage): void => {
    const validLanguages = Object.values(TranslationsEnum) as string[];
    const isValidLanguage = validLanguages.includes(language);
    if (!isValidLanguage) {
      return;
    }
    localStorage.setItem(StorageKeys.LANGUAGE, language);
    applyLanguage(language);
    languageSubject.next(language);
  },
  toggleLanguage: (): void => {
    const currentLanguage = languageSubject.getValue();
    const newLanguage =
      currentLanguage === TranslationsEnum.PT_BR
        ? TranslationsEnum.EN_US
        : TranslationsEnum.PT_BR;
    languageObservable.setLanguage(newLanguage);
  },
};

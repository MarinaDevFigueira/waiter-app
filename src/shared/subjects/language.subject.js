import { BehaviorSubject } from "rxjs";
import { StorageKeys } from "@/shared/constants/storage-keys";
import { TranslationsEnum } from "@/shared/enums/translations.enum";
import { setLanguage as setTranslationLanguage } from "@/shared/utils/translations";

const getStoredLanguage = () => {
  const stored = localStorage.getItem(StorageKeys.LANGUAGE);
  const validLanguages = Object.values(TranslationsEnum);
  const isValidLanguage = validLanguages.includes(stored);
  if (isValidLanguage) {
    return stored;
  }
  return null;
};

const getInitialLanguage = () => {
  const storedLanguage = getStoredLanguage();
  const hasStoredLanguage = storedLanguage !== null;
  if (hasStoredLanguage) {
    return storedLanguage;
  }
  return TranslationsEnum.PT_BR;
};

const applyLanguage = (language) => {
  setTranslationLanguage(language);
  document.documentElement.lang = language;
};

const initialLanguage = getInitialLanguage();
applyLanguage(initialLanguage);

const languageSubject = new BehaviorSubject(initialLanguage);

export const languageObservable = {
  subscribe: (callback) => languageSubject.subscribe(callback),
  getValue: () => languageSubject.getValue(),
  setLanguage: (language) => {
    const validLanguages = Object.values(TranslationsEnum);
    const isValidLanguage = validLanguages.includes(language);
    if (!isValidLanguage) {
      return;
    }
    localStorage.setItem(StorageKeys.LANGUAGE, language);
    applyLanguage(language);
    languageSubject.next(language);
  },
  toggleLanguage: () => {
    const currentLanguage = languageSubject.getValue();
    const newLanguage = currentLanguage === TranslationsEnum.PT_BR
      ? TranslationsEnum.EN_US
      : TranslationsEnum.PT_BR;
    languageObservable.setLanguage(newLanguage);
  },
};

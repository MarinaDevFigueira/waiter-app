import { useEffect, useState } from "react";
import { languageObservable } from "@/shared/subjects/language.subject";
import type { TranslationLanguage } from "@/shared/enums/translations.enum";

interface UseLanguageReturn {
  language: TranslationLanguage;
  setLanguage: (language: TranslationLanguage) => void;
  toggleLanguage: () => void;
  addLanguagePrefix: (...keys: unknown[]) => unknown[];
}

export function useLanguage(): UseLanguageReturn {
  const [language, setLanguageState] = useState<TranslationLanguage>(
    languageObservable.getValue()
  );

  useEffect(() => {
    const subscription = languageObservable.subscribe(setLanguageState);
    return () => subscription.unsubscribe();
  }, []);

  const addLanguagePrefix = (...keys: unknown[]): unknown[] => {
    return [`language:${language}`, ...keys];
  };

  return {
    language,
    setLanguage: languageObservable.setLanguage,
    toggleLanguage: languageObservable.toggleLanguage,
    addLanguagePrefix,
  };
}

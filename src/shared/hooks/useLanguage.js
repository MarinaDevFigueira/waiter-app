import { useEffect, useState } from "react";
import { languageObservable } from "@/shared/subjects/language.subject";

export function useLanguage() {
  const [language, setLanguageState] = useState(languageObservable.getValue());

  useEffect(() => {
    const subscription = languageObservable.subscribe(setLanguageState);
    return () => subscription.unsubscribe();
  }, []);

  return {
    language,
    setLanguage: languageObservable.setLanguage,
    toggleLanguage: languageObservable.toggleLanguage,
  };
}

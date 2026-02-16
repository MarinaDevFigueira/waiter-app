import { useEffect, useState } from "react";
import { themeObservable } from "@/shared/subjects/theme";

export function useTheme() {
  const [theme, setThemeState] = useState(themeObservable.getValue());

  useEffect(() => {
    const subscription = themeObservable.subscribe(setThemeState);
    return () => subscription.unsubscribe();
  }, []);

  return {
    theme,
    setTheme: themeObservable.setTheme,
    toggleTheme: themeObservable.toggleTheme,
  };
}

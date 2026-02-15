import { useEffect, useState } from "react";
import { themeSubject, setTheme, toggleTheme } from "@/shared/subjects/theme";

export function useTheme() {
  const [theme, setThemeState] = useState(themeSubject.getValue());

  useEffect(() => {
    const subscription = themeSubject.subscribe(setThemeState);
    return () => subscription.unsubscribe();
  }, []);

  return {
    theme,
    setTheme,
    toggleTheme,
  };
}

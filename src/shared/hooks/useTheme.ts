import { useEffect, useState } from "react";
import { themeObservable, type Theme } from "@/shared/subjects/theme";

interface UseThemeReturn {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export function useTheme(): UseThemeReturn {
  const [theme, setThemeState] = useState<Theme>(themeObservable.getValue());

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

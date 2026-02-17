import { Moon, Sun } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button/button";
import { useTheme } from "@/shared/hooks/useTheme";

export function ThemeToggle(): JSX.Element {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={toggleTheme}
      data-testid="theme-toggle"
      aria-label={isDark ? "Mudar para tema claro" : "Mudar para tema escuro"}
    >
      {isDark ? <Sun /> : <Moon />}
    </Button>
  );
}

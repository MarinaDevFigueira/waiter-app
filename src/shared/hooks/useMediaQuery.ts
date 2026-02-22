import { useState, useEffect, useCallback } from "react";

interface UseMediaQueryReturn {
  matches: boolean;
}

export function useMediaQuery(query: string): UseMediaQueryReturn {
  const [matches, setMatches] = useState(() => {
    const hasMatchMedia = typeof window !== "undefined" && typeof window.matchMedia === "function";
    if (!hasMatchMedia) {
      const defaultMatches = false;
      return defaultMatches;
    }

    const mediaQuery = window.matchMedia(query);
    const initialMatches = mediaQuery.matches;
    return initialMatches;
  });

  const handleChange = useCallback((event: MediaQueryListEvent) => {
    const newMatches = event.matches;
    setMatches(newMatches);
  }, []);

  useEffect(() => {
    const hasMatchMedia = typeof window !== "undefined" && typeof window.matchMedia === "function";
    if (!hasMatchMedia) return;

    const mediaQuery = window.matchMedia(query);
    const currentMatches = mediaQuery.matches;
    setMatches(currentMatches);

    mediaQuery.addEventListener("change", handleChange);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [query, handleChange]);

  return { matches };
}

export function useIsMobile(): boolean {
  const mdBreakpoint = "(min-width: 768px)";
  const { matches } = useMediaQuery(mdBreakpoint);
  const isMobile = !matches;
  return isMobile;
}

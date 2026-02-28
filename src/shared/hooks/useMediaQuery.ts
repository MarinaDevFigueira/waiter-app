import { useState, useEffect } from "react";
import { mediaQueryObservable } from "@/shared/subjects/media-query.subject";

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(mediaQueryObservable.getValue());

  useEffect(() => {
    const subscription = mediaQueryObservable.subscribe(setIsMobile);
    return () => subscription.unsubscribe();
  }, []);

  return isMobile;
}

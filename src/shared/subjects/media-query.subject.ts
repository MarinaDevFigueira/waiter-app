import { BehaviorSubject, type Subscription } from "rxjs";

const MD_BREAKPOINT = 768;

const getIsMobile = (): boolean => {
  const hasWindow = typeof window !== "undefined";
  if (!hasWindow) {
    return false;
  }
  const windowWidth = window.innerWidth;
  const isMobile = windowWidth < MD_BREAKPOINT;
  return isMobile;
};

const initialIsMobile = getIsMobile();

const isMobileSubject = new BehaviorSubject<boolean>(initialIsMobile);

const setupResizeListener = (): void => {
  const hasWindow = typeof window !== "undefined";
  if (!hasWindow) return;

  const handleResize = (): void => {
    const newIsMobile = getIsMobile();
    const currentValue = isMobileSubject.getValue();
    const hasChanged = newIsMobile !== currentValue;
    if (hasChanged) {
      isMobileSubject.next(newIsMobile);
    }
  };

  window.addEventListener("resize", handleResize);
};

setupResizeListener();

export const mediaQueryObservable = {
  subscribe: (callback: (value: boolean) => void): Subscription =>
    isMobileSubject.subscribe(callback),
  getValue: (): boolean => isMobileSubject.getValue(),
};

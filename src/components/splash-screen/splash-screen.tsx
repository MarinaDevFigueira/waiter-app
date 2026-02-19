import { useState, useEffect } from "react";
import { SPLASH_STORAGE_KEY } from "@/shared/constants/splash";
import FeedbackScreen from "@/components/ui/feedback-screen/feedback-screen";

const SPLASH_DURATION_MS = 1500;

function getInitialVisibility(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(SPLASH_STORAGE_KEY) !== "false";
}

interface SplashScreenProps {
  onDismiss?: () => void;
}

export function SplashScreen({ onDismiss }: SplashScreenProps): JSX.Element | null {
  const [isVisible, setIsVisible] = useState<boolean>(getInitialVisibility);

  const handleDismiss = () => {
    sessionStorage.setItem(SPLASH_STORAGE_KEY, "false");
    setIsVisible(false);
    onDismiss?.();
  };

  useEffect(() => {
    const shouldAutoDismiss = isVisible;
    if (!shouldAutoDismiss) return;

    const timer = setTimeout(handleDismiss, SPLASH_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      data-testid="splash-screen"
      className="fixed inset-0 z-50 bg-primary"
      onClick={handleDismiss}
    >
      <FeedbackScreen
        variant="success"
        size="full"
        illustration={
          <img
            src="/splash-screen/waiters.svg"
            alt="Waiters illustration"
            className="w-64 h-auto"
          />
        }
        title={
          <span className="font-title text-4xl tracking-wide">
            <span className="text-white font-bold">WAITER</span>
            <span className="text-white/70">APP</span>
          </span>
        }
        description="O App do Garçom"
      >
        <div className="mt-6">
          <svg
            className="animate-spin h-8 w-8 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      </FeedbackScreen>
    </div>
  );
}

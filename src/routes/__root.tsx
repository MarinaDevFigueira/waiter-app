import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { SplashScreen } from "@/components/splash-screen/splash-screen";
import { CookieConsentModal } from "@/components/cookie-consent-modal/cookie-consent-modal";
import { useCookieConsent } from "@/shared/hooks/useCookieConsent";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const { isAccepted } = useCookieConsent();
  const appContent = isAccepted ? <Outlet /> : null;

  return (
    <React.Fragment>
      <SplashScreen />
      <CookieConsentModal />
      {appContent}
    </React.Fragment>
  );
}

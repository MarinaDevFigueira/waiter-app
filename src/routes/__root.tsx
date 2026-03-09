import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { SplashScreen } from "@/components/splash-screen/splash-screen";
import { CookieConsentModal } from "@/components/cookie-consent-modal/cookie-consent-modal";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <React.Fragment>
      <SplashScreen />
      <CookieConsentModal />
      <Outlet />
    </React.Fragment>
  );
}

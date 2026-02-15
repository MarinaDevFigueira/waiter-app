import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { SplashScreen } from "@/components/splash-screen/splash-screen";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <React.Fragment>
      <SplashScreen />
      <Outlet />
    </React.Fragment>
  );
}

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
      <div className="w-dvw h-dvh max-w-[393px] p-3 flex flex-col items-center justify-start">
        <Outlet />
      </div>
    </React.Fragment>
  );
}

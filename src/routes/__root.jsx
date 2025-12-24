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
      <div className="w-screen h-screen flex flex-col items-center justify-start bg-background">
        <header className="w-full bg-background shadow-sm sticky top-0 z-50">
          <div className="flex items-center justify-start px-4 sm:px-6 md:px-8 py-3 sm:py-4">
            <h1 className="text-lg sm:text-xl font-bold font-title uppercase">
              <span className="text-primary">Waiter</span>
              <span className="font-extralight">App</span>
            </h1>
          </div>
        </header>
        <main className="w-full flex-1 overflow-y-auto flex justify-center">
          <div className="w-full md:max-w-2xl lg:max-w-4xl px-2 md:px-0 py-4">
            <Outlet />
          </div>
        </main>
      </div>
    </React.Fragment>
  );
}

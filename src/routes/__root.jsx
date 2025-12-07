import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <React.Fragment>
      {/* <div>Hello "__root"!</div>
      Hello world from the root route! */}
      <div className="w-dvw h-dvh p-3 flex flex-col items-center justify-start">
        <Outlet />
      </div>
    </React.Fragment>
  );
}

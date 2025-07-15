import React from 'react';

import { WuToast } from '@npm-questionpro/wick-ui-lib';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

// eslint-disable-next-line react-refresh/only-export-components
export const rootRoute = createRootRoute({
  component: RootComponent,
  errorComponent: ErrorRootComponent,
});

// Export Route for compatibility with routeTree.gen.ts
export const Route = rootRoute;

function RootComponent() {
  return (
    <React.Fragment>
      <Outlet />
      <WuToast />
      <TanStackRouterDevtools position={'bottom-right'} />
    </React.Fragment>
  );
}

function ErrorRootComponent({ error }: { error: unknown }) {
  return (
    <div>
      <h1>Something went wrong</h1>
      <p>{String(error)}</p>
    </div>
  );
}

import { RouterProvider, createRouter } from '@tanstack/react-router';
import ReactDOM from 'react-dom/client';


import '@npm-questionpro/wick-ui-icon/dist/wu-icon.css';
import '@npm-questionpro/wick-ui-lib/dist/style.css';
import 'react-loading-skeleton/dist/skeleton.css';
import '@/Assets/styles/global.css';
import './i18n';
import ReactQueryProvider from '@/Providers/react-query-provider.tsx';
import { routeTree } from '@/routeTree.gen.ts';

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <>
      <ReactQueryProvider>
        <RouterProvider router={router} />
      </ReactQueryProvider>
    </>,
  );
}

import { RouterProvider, createRouter } from '@tanstack/react-router';

import '@/Assets/styles/base.scss';
import '@npm-questionpro/wick-ui-icon/dist/wu-icon.css';
import '@npm-questionpro/wick-ui-lib/dist/style.css';
import 'react-loading-skeleton/dist/skeleton.css';
import ReactQueryProvider from '@/Providers/react-query-provider.tsx';
import { routeTree } from '@/routeTree.gen.ts';

// Create a new router instance
const router = createRouter({ routeTree });

export default function App() {
  return (
    <>
      <ReactQueryProvider>
        <RouterProvider router={router} />
      </ReactQueryProvider>
    </>
  );
}

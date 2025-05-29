import { RouterProvider, createRouter } from '@tanstack/react-router';

import '@assets/styles/base.scss';
import '@npm-questionpro/wick-ui-icon/dist/wu-icon.css';
import '@npm-questionpro/wick-ui-lib/dist/style.css';
import ReactQueryProvider from '@/providers/react-query-provider.tsx';
import ThemProvider from '@/providers/them-provider.tsx';
import { routeTree } from '@/routeTree.gen.ts';

// Create a new router instance
const router = createRouter({ routeTree });

export default function App() {
  return (
    <>
      <ReactQueryProvider>
        <ThemProvider>
          <RouterProvider router={router} />
        </ThemProvider>
      </ReactQueryProvider>
    </>
  );
}

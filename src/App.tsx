import { RouterProvider, createRouter } from "@tanstack/react-router";
import "@assets/styles/base.scss";
import "@npm-questionpro/wick-ui-icon/dist/wu-icon.css";
import "@npm-questionpro/wick-ui-lib/dist/style.css";

import { routeTree } from "./routeTree.gen";

import ReactQueryProvider from "@/providers/react-query-provider.tsx";

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

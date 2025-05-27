import { QueryCache, QueryClient } from '@tanstack/react-query';

const gqlGlobalOptions = {
  queryCache: new QueryCache({}),
  useErrorBoundary: true,
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      onError: async (error: any) => {
        console.error(error);
      },
    },
    mutations: {
      onError: async (error: any) => {
        console.error(error);
      },
    },
  },
};

const queryClient = new QueryClient(gqlGlobalOptions);

export { gqlGlobalOptions, queryClient };

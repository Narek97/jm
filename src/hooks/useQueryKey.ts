import { useQueryClient } from "@tanstack/react-query";

export const useGetQueryDataByKey = (mayKey: string): any => {
  const queryClient = useQueryClient();
  const allKeys = queryClient.getQueryCache().getAll();
  const query = allKeys.find((key) => key.queryKey[0] === mayKey);
  return queryClient.getQueryData(query?.queryKey || [mayKey]);
};

type DataOptions = {
  key: string;
  value: unknown;
  input?: string;
};

export const useSetQueryDataByKey = (
  mayKey: string,
  data?: DataOptions,
): any => {
  const queryClient = useQueryClient();
  return (callback: (data: any) => any) => {
    const allKeys = queryClient.getQueryCache().getAll();
    const query = allKeys.find((key) => {
      if (key.queryKey[0] !== mayKey) return false;

      if (data && data.input) {
        const queryData = key.queryKey[1] as Record<string, any> | undefined;
        const currentValue = data.input
          ? queryData?.[data.input]?.[data.key]
          : queryData?.[data.key];

        return JSON.stringify(currentValue) === JSON.stringify(data.value);
      }

      return (
        !data ||
        (key.queryKey[1] as Record<string, unknown>)?.[data.key] === data.value
      );
    });

    queryClient.setQueryData(query?.queryKey || [mayKey], callback);
  };
};

export const useRemoveQueriesByKey = (mayKey: string, data: DataOptions) => {
  const queryClient = useQueryClient();
  return () => {
    queryClient.removeQueries({
      queryKey: [mayKey],
      predicate: (query) => {
        // Keep page 1, remove all other pages
        return data.input
          ? (query.queryKey[1] as any)[data.input][data.key] !== data.value
          : (query.queryKey[1] as any)[data.key] !== data.value;
      },
    });
  };
};

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

import { useQueryClient } from '@tanstack/react-query';

export const useGetQueryDataByKey = (mayKey: string): any => {
  const queryClient = useQueryClient();
  const allKeys = queryClient.getQueryCache().getAll();
  const query = allKeys.find(key => key.queryKey[0] === mayKey);
  return queryClient.getQueryData(query?.queryKey || [mayKey]);
};

type DataOptions = {
  key: string;
  value: unknown;
  input?: string;
  deleteUpcoming?: boolean;
};

export const useSetQueryDataByKey = (mayKey: string, data?: DataOptions): any => {
  const queryClient = useQueryClient();
  return (callback: (data: any) => any) => {
    const allKeys = queryClient.getQueryCache().getAll();
    const query = allKeys.find(key => {
      if (key.queryKey[0] !== mayKey) return false;

      if (data && data.input) {
        const queryData = key.queryKey[1] as Record<string, any> | undefined;
        const currentValue = data.input
          ? queryData?.[data.input]?.[data.key]
          : queryData?.[data.key];

        return JSON.stringify(currentValue) === JSON.stringify(data.value);
      }

      return !data || (key.queryKey[1] as Record<string, unknown>)?.[data.key] === data.value;
    });

    queryClient.setQueryData(query?.queryKey || [mayKey], callback);
  };
};

export const useSetAllQueryDataByKey = (mayKey: string) => {
  const queryClient = useQueryClient();

  return (callback: (data: any) => any): any[] => {
    const allQueries = queryClient.getQueryCache().getAll();

    const matchingQueries = allQueries.filter(query => query.queryKey.includes(mayKey));

    console.log(matchingQueries, 'matchingQueries');

    return matchingQueries.map(query => {
      const newData = callback(queryClient.getQueryData(query.queryKey));
      queryClient.setQueryData(query.queryKey, newData);
      return newData;
    });
  };
};

export const useSetQueryDataByKeyAdvanced = () => {
  const queryClient = useQueryClient();

  return (mayKey: string, data: DataOptions, callback: (oldData: any) => any) => {
    const allQueries = queryClient.getQueryCache().getAll();

    const query = allQueries.find(q => {
      if (q.queryKey[0] !== mayKey) return false;

      const queryData = q.queryKey[1] as Record<string, any> | undefined;

      if (!queryData) return false;

      const getValue = () => {
        if (data.input) {
          return queryData[data.input]?.[data.key];
        }
        return queryData[data.key];
      };

      const currentValue = getValue();

      if (data.deleteUpcoming && typeof data.value === 'number') {
        return currentValue >= data.value;
      }

      return JSON.stringify(currentValue) === JSON.stringify(data.value);
    });

    if (query) {
      queryClient.setQueryData(query.queryKey, callback);
    }
  };
};

export const useRemoveQueriesByKey = () => {
  const queryClient = useQueryClient();
  return (mayKey: string, data: DataOptions) => {
    queryClient.removeQueries({
      queryKey: [mayKey],
      predicate: query => {
        if (data.deleteUpcoming && typeof data.value === 'number') {
          return data.input
            ? (query.queryKey[1] as any)[data.input][data.key] >= data.value
            : (query.queryKey[1] as any)[data.key] >= data.value;
        } else {
          return data.input
            ? (query.queryKey[1] as any)[data.input][data.key] !== data.value
            : (query.queryKey[1] as any)[data.key] !== data.value;
        }
      },
    });
  };
};

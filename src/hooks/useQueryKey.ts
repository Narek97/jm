import { useQueryClient } from '@tanstack/react-query';

export const useGetQueryDataByKey = (mayKey: string): any => {
  const queryClient = useQueryClient();
  const allKeys = queryClient.getQueryCache().getAll();
  const query = allKeys.find(key => key.queryKey[0] === mayKey);
  return queryClient.getQueryData(query?.queryKey || [mayKey]);
};

type DataOptions = {
  key: string | string[];
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
          ? queryData?.[data.input]?.[data.key as string]
          : queryData?.[data.key as string];

        return JSON.stringify(currentValue) === JSON.stringify(data.value);
      }

      return !data || (key.queryKey[1] as Record<string, unknown>)?.[data.key as string] === data.value;
    });

    queryClient.setQueryData(query?.queryKey || [mayKey], callback);
  };
};

export const useSetAllQueryDataByKey = (mayKey: string) => {
  const queryClient = useQueryClient();

  return (callback: (data: any) => any): any[] => {
    const allQueries = queryClient.getQueryCache().getAll();

    const matchingQueries = allQueries.filter(query => query.queryKey.includes(mayKey));
    return matchingQueries.map(query => {
      const newData = callback(queryClient.getQueryData(query.queryKey));
      queryClient.setQueryData(query.queryKey, newData);
      return newData;
    });
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
            ? (query.queryKey[1] as any)[data.input][data.key as string] >= data.value
            : (query.queryKey[1] as any)[data.key as string] >= data.value;
        } else {
          return data.input
            ? (query.queryKey[1] as any)[data.input][data.key as string] !== data.value
            : (query.queryKey[1] as any)[data.key as string] !== data.value;
        }
      },
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
          return queryData[data.input]?.[data.key as string];
        }
        return queryData[data.key as string];
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

export const useSetQueryDataByKeys = (
  mayKey: string,
  conditions: DataOptions[],
): ((callback: (newData: any) => any) => void) => {
  const queryClient = useQueryClient();

  return (callback: (newData: any) => any) => {
    const allQueries = queryClient.getQueryCache().getAll();

    const match = allQueries.find(({ queryKey }) => {
      if (queryKey[0] !== mayKey) return false;
      const queryParams = queryKey[1] as Record<string, any> | undefined;

      return conditions.every(cond => {
        const { key, value, input } = cond;
        const inputData = input ? (queryParams?.[input] ?? {}) : (queryParams ?? {});

        if (Array.isArray(key) && Array.isArray(value)) {
          const currentValues = key.map(k => inputData[k]);
          return JSON.stringify(currentValues) === JSON.stringify(value);
        }

        if (!Array.isArray(key)) {
          return inputData?.[key] === value;
        }

        return false;
      });
    });

    queryClient.setQueryData(match?.queryKey || [mayKey], callback);
  };
};

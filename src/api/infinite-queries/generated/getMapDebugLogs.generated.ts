import * as Types from '../../types';

import {
  useQuery,
  useInfiniteQuery,
  UseQueryOptions,
  UseInfiniteQueryOptions,
  InfiniteData,
} from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type GetMapDebugLogsQueryVariables = Types.Exact<{
  getMapDebugLogsInput: Types.GetMapDebugLogsInput;
}>;

export type GetMapDebugLogsQuery = {
  __typename?: 'Query';
  getMapDebugLogs?: {
    __typename?: 'GetJourneyMapDebugLogsModel';
    limit: number;
    count?: number | null;
    mapDebugLogs: Array<{
      __typename?: 'MapDebugLogs';
      id: number;
      mapId: number;
      userId: number;
      frontJsonHash: string;
      backJsonHash: string;
    }>;
  } | null;
};

export const GetMapDebugLogsDocument = `
    query GetMapDebugLogs($getMapDebugLogsInput: GetMapDebugLogsInput!) {
  getMapDebugLogs(getMapDebugLogsInput: $getMapDebugLogsInput) {
    limit
    count
    mapDebugLogs {
      id
      mapId
      userId
      frontJsonHash
      backJsonHash
      id
    }
  }
}
    `;

export const useGetMapDebugLogsQuery = <TData = GetMapDebugLogsQuery, TError = unknown>(
  variables: GetMapDebugLogsQueryVariables,
  options?: Omit<UseQueryOptions<GetMapDebugLogsQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseQueryOptions<GetMapDebugLogsQuery, TError, TData>['queryKey'];
  },
) => {
  return useQuery<GetMapDebugLogsQuery, TError, TData>({
    queryKey: ['GetMapDebugLogs', variables],
    queryFn: axiosRequest<GetMapDebugLogsQuery, GetMapDebugLogsQueryVariables>(
      GetMapDebugLogsDocument,
    ).bind(null, variables),
    ...options,
  });
};

useGetMapDebugLogsQuery.getKey = (variables: GetMapDebugLogsQueryVariables) => [
  'GetMapDebugLogs',
  variables,
];

export const useInfiniteGetMapDebugLogsQuery = <
  TData = InfiniteData<GetMapDebugLogsQuery>,
  TError = unknown,
>(
  variables: GetMapDebugLogsQueryVariables,
  options: Omit<UseInfiniteQueryOptions<GetMapDebugLogsQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseInfiniteQueryOptions<GetMapDebugLogsQuery, TError, TData>['queryKey'];
  },
) => {
  const query = axiosRequest<GetMapDebugLogsQuery, GetMapDebugLogsQueryVariables>(
    GetMapDebugLogsDocument,
  );
  return useInfiniteQuery<GetMapDebugLogsQuery, TError, TData>(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? ['GetMapDebugLogs.infinite', variables],
        queryFn: metaData => query({ ...variables, ...(metaData.pageParam ?? {}) }),
        ...restOptions,
      };
    })(),
  );
};

useInfiniteGetMapDebugLogsQuery.getKey = (variables: GetMapDebugLogsQueryVariables) => [
  'GetMapDebugLogs.infinite',
  variables,
];

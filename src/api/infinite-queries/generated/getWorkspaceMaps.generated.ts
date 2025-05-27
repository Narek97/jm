import * as Types from '../../types';

import {
  useQuery,
  useInfiniteQuery,
  UseQueryOptions,
  UseInfiniteQueryOptions,
  InfiniteData,
} from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type GetWorkspaceMapsQueryVariables = Types.Exact<{
  getWorkspaceMapsInput: Types.GetWorkspaceMapsInput;
}>;

export type GetWorkspaceMapsQuery = {
  __typename?: 'Query';
  getWorkspaceMaps: {
    __typename?: 'GetWorkspaceMapsModel';
    count?: number | null;
    maps: Array<{
      __typename?: 'MapForOutcome';
      id: number;
      title?: string | null;
    }>;
  };
};

export const GetWorkspaceMapsDocument = `
    query GetWorkspaceMaps($getWorkspaceMapsInput: GetWorkspaceMapsInput!) {
  getWorkspaceMaps(getWorkspaceMapsInput: $getWorkspaceMapsInput) {
    count
    maps {
      id
      title
    }
  }
}
    `;

export const useGetWorkspaceMapsQuery = <TData = GetWorkspaceMapsQuery, TError = unknown>(
  variables: GetWorkspaceMapsQueryVariables,
  options?: Omit<UseQueryOptions<GetWorkspaceMapsQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseQueryOptions<GetWorkspaceMapsQuery, TError, TData>['queryKey'];
  },
) => {
  return useQuery<GetWorkspaceMapsQuery, TError, TData>({
    queryKey: ['GetWorkspaceMaps', variables],
    queryFn: axiosRequest<GetWorkspaceMapsQuery, GetWorkspaceMapsQueryVariables>(
      GetWorkspaceMapsDocument,
    ).bind(null, variables),
    ...options,
  });
};

useGetWorkspaceMapsQuery.getKey = (variables: GetWorkspaceMapsQueryVariables) => [
  'GetWorkspaceMaps',
  variables,
];

export const useInfiniteGetWorkspaceMapsQuery = <
  TData = InfiniteData<GetWorkspaceMapsQuery>,
  TError = unknown,
>(
  variables: GetWorkspaceMapsQueryVariables,
  options: Omit<UseInfiniteQueryOptions<GetWorkspaceMapsQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseInfiniteQueryOptions<GetWorkspaceMapsQuery, TError, TData>['queryKey'];
  },
) => {
  const query = axiosRequest<GetWorkspaceMapsQuery, GetWorkspaceMapsQueryVariables>(
    GetWorkspaceMapsDocument,
  );
  return useInfiniteQuery<GetWorkspaceMapsQuery, TError, TData>(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? ['GetWorkspaceMaps.infinite', variables],
        queryFn: metaData => query({ ...variables, ...(metaData.pageParam ?? {}) }),
        ...restOptions,
      };
    })(),
  );
};

useInfiniteGetWorkspaceMapsQuery.getKey = (variables: GetWorkspaceMapsQueryVariables) => [
  'GetWorkspaceMaps.infinite',
  variables,
];

import * as Types from '../../types';

import {
  useQuery,
  useInfiniteQuery,
  UseQueryOptions,
  UseInfiniteQueryOptions,
  InfiniteData,
} from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type GetMapVersionsQueryVariables = Types.Exact<{
  getMapVersionsInput: Types.GetMapVersionsInput;
}>;

export type GetMapVersionsQuery = {
  __typename?: 'Query';
  getMapVersions: {
    __typename?: 'GetMapVersionsModel';
    count?: number | null;
    mapVersions: Array<{
      __typename?: 'MapVersion';
      id: number;
      mapId: number;
      versionName: string;
      s3ObjectUrl: string;
      createdAt: any;
      updatedAt: any;
    }>;
  };
};

export const GetMapVersionsDocument = `
    query GetMapVersions($getMapVersionsInput: GetMapVersionsInput!) {
  getMapVersions(getMapVersionsInput: $getMapVersionsInput) {
    count
    mapVersions {
      id
      mapId
      versionName
      s3ObjectUrl
      createdAt
      updatedAt
    }
  }
}
    `;

export const useGetMapVersionsQuery = <TData = GetMapVersionsQuery, TError = unknown>(
  variables: GetMapVersionsQueryVariables,
  options?: Omit<UseQueryOptions<GetMapVersionsQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseQueryOptions<GetMapVersionsQuery, TError, TData>['queryKey'];
  },
) => {
  return useQuery<GetMapVersionsQuery, TError, TData>({
    queryKey: ['GetMapVersions', variables],
    queryFn: axiosRequest<GetMapVersionsQuery, GetMapVersionsQueryVariables>(
      GetMapVersionsDocument,
    ).bind(null, variables),
    ...options,
  });
};

useGetMapVersionsQuery.getKey = (variables: GetMapVersionsQueryVariables) => [
  'GetMapVersions',
  variables,
];

export const useInfiniteGetMapVersionsQuery = <
  TData = InfiniteData<GetMapVersionsQuery>,
  TError = unknown,
>(
  variables: GetMapVersionsQueryVariables,
  options: Omit<UseInfiniteQueryOptions<GetMapVersionsQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseInfiniteQueryOptions<GetMapVersionsQuery, TError, TData>['queryKey'];
  },
) => {
  const query = axiosRequest<GetMapVersionsQuery, GetMapVersionsQueryVariables>(
    GetMapVersionsDocument,
  );
  return useInfiniteQuery<GetMapVersionsQuery, TError, TData>(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? ['GetMapVersions.infinite', variables],
        queryFn: metaData => query({ ...variables, ...(metaData.pageParam ?? {}) }),
        ...restOptions,
      };
    })(),
  );
};

useInfiniteGetMapVersionsQuery.getKey = (variables: GetMapVersionsQueryVariables) => [
  'GetMapVersions.infinite',
  variables,
];

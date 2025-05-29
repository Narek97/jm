import * as Types from '../../types';

import {
  useQuery,
  useInfiniteQuery,
  UseQueryOptions,
  UseInfiniteQueryOptions,
  InfiniteData,
} from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type GetLinkMapsByBoardQueryVariables = Types.Exact<{
  getMapsInput: Types.GetMapsInput;
}>;

export type GetLinkMapsByBoardQuery = {
  __typename?: 'Query';
  getLinkMapsByBoard: {
    __typename?: 'GetLinkMapsModel';
    count?: number | null;
    maps: Array<{ __typename?: 'LinkMapResponse'; mapId: number; title?: string | null }>;
  };
};

export const GetLinkMapsByBoardDocument = `
    query GetLinkMapsByBoard($getMapsInput: GetMapsInput!) {
  getLinkMapsByBoard(getMapsInput: $getMapsInput) {
    count
    maps {
      mapId
      title
    }
  }
}
    `;

export const useGetLinkMapsByBoardQuery = <TData = GetLinkMapsByBoardQuery, TError = unknown>(
  variables: GetLinkMapsByBoardQueryVariables,
  options?: Omit<UseQueryOptions<GetLinkMapsByBoardQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseQueryOptions<GetLinkMapsByBoardQuery, TError, TData>['queryKey'];
  },
) => {
  return useQuery<GetLinkMapsByBoardQuery, TError, TData>({
    queryKey: ['GetLinkMapsByBoard', variables],
    queryFn: axiosRequest<GetLinkMapsByBoardQuery, GetLinkMapsByBoardQueryVariables>(
      GetLinkMapsByBoardDocument,
    ).bind(null, variables),
    ...options,
  });
};

useGetLinkMapsByBoardQuery.getKey = (variables: GetLinkMapsByBoardQueryVariables) => [
  'GetLinkMapsByBoard',
  variables,
];

export const useInfiniteGetLinkMapsByBoardQuery = <
  TData = InfiniteData<GetLinkMapsByBoardQuery>,
  TError = unknown,
>(
  variables: GetLinkMapsByBoardQueryVariables,
  options: Omit<UseInfiniteQueryOptions<GetLinkMapsByBoardQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseInfiniteQueryOptions<GetLinkMapsByBoardQuery, TError, TData>['queryKey'];
  },
) => {
  const query = axiosRequest<GetLinkMapsByBoardQuery, GetLinkMapsByBoardQueryVariables>(
    GetLinkMapsByBoardDocument,
  );
  return useInfiniteQuery<GetLinkMapsByBoardQuery, TError, TData>(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? ['GetLinkMapsByBoard.infinite', variables],
        queryFn: metaData => query({ ...variables, ...(metaData.pageParam ?? {}) }),
        ...restOptions,
      };
    })(),
  );
};

useInfiniteGetLinkMapsByBoardQuery.getKey = (variables: GetLinkMapsByBoardQueryVariables) => [
  'GetLinkMapsByBoard.infinite',
  variables,
];

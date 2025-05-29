import * as Types from '../../types';

import {
  useQuery,
  useInfiniteQuery,
  UseQueryOptions,
  UseInfiniteQueryOptions,
  InfiniteData,
} from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type GetBoardTagsQueryVariables = Types.Exact<{
  getBoardTagsInput: Types.GetBoardTagsInput;
}>;

export type GetBoardTagsQuery = {
  __typename?: 'Query';
  getBoardTags: {
    __typename?: 'GetBoardsTagsModel';
    count?: number | null;
    tags: Array<{
      __typename?: 'GetCardAttachedTagsModel';
      color: string;
      id: number;
      name: string;
    }>;
  };
};

export const GetBoardTagsDocument = `
    query GetBoardTags($getBoardTagsInput: GetBoardTagsInput!) {
  getBoardTags(getBoardTagsInput: $getBoardTagsInput) {
    count
    tags {
      color
      id
      name
    }
  }
}
    `;

export const useGetBoardTagsQuery = <TData = GetBoardTagsQuery, TError = unknown>(
  variables: GetBoardTagsQueryVariables,
  options?: Omit<UseQueryOptions<GetBoardTagsQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseQueryOptions<GetBoardTagsQuery, TError, TData>['queryKey'];
  },
) => {
  return useQuery<GetBoardTagsQuery, TError, TData>({
    queryKey: ['GetBoardTags', variables],
    queryFn: axiosRequest<GetBoardTagsQuery, GetBoardTagsQueryVariables>(GetBoardTagsDocument).bind(
      null,
      variables,
    ),
    ...options,
  });
};

useGetBoardTagsQuery.getKey = (variables: GetBoardTagsQueryVariables) => [
  'GetBoardTags',
  variables,
];

export const useInfiniteGetBoardTagsQuery = <
  TData = InfiniteData<GetBoardTagsQuery>,
  TError = unknown,
>(
  variables: GetBoardTagsQueryVariables,
  options: Omit<UseInfiniteQueryOptions<GetBoardTagsQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseInfiniteQueryOptions<GetBoardTagsQuery, TError, TData>['queryKey'];
  },
) => {
  const query = axiosRequest<GetBoardTagsQuery, GetBoardTagsQueryVariables>(GetBoardTagsDocument);
  return useInfiniteQuery<GetBoardTagsQuery, TError, TData>(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? ['GetBoardTags.infinite', variables],
        queryFn: metaData => query({ ...variables, ...(metaData.pageParam ?? {}) }),
        ...restOptions,
      };
    })(),
  );
};

useInfiniteGetBoardTagsQuery.getKey = (variables: GetBoardTagsQueryVariables) => [
  'GetBoardTags.infinite',
  variables,
];

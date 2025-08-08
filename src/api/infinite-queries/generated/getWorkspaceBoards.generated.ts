import * as Types from '../../types';

import {
  useQuery,
  useInfiniteQuery,
  UseQueryOptions,
  UseInfiniteQueryOptions,
  InfiniteData,
} from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type GetWorkspaceBoardsQueryVariables = Types.Exact<{
  getWorkspaceBoardsInput: Types.GetWorkspaceBoardsInput;
}>;

export type GetWorkspaceBoardsQuery = {
  __typename?: 'Query';
  getWorkspaceBoards: {
    __typename?: 'GetWorkspaceBoardsModel';
    count?: number | null;
    boards: Array<{ __typename?: 'WorkspaceBoardResponse'; id: number; name: string }>;
  };
};

export const GetWorkspaceBoardsDocument = `
    query GetWorkspaceBoards($getWorkspaceBoardsInput: GetWorkspaceBoardsInput!) {
  getWorkspaceBoards(getWorkspaceBoardsInput: $getWorkspaceBoardsInput) {
    boards {
      id
      name
    }
    count
  }
}
    `;

export const useGetWorkspaceBoardsQuery = <TData = GetWorkspaceBoardsQuery, TError = unknown>(
  variables: GetWorkspaceBoardsQueryVariables,
  options?: Omit<UseQueryOptions<GetWorkspaceBoardsQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseQueryOptions<GetWorkspaceBoardsQuery, TError, TData>['queryKey'];
  },
) => {
  return useQuery<GetWorkspaceBoardsQuery, TError, TData>({
    queryKey: ['GetWorkspaceBoards', variables],
    queryFn: axiosRequest<GetWorkspaceBoardsQuery, GetWorkspaceBoardsQueryVariables>(
      GetWorkspaceBoardsDocument,
    ).bind(null, variables),
    ...options,
  });
};

useGetWorkspaceBoardsQuery.getKey = (variables: GetWorkspaceBoardsQueryVariables) => [
  'GetWorkspaceBoards',
  variables,
];

export const useInfiniteGetWorkspaceBoardsQuery = <
  TData = InfiniteData<GetWorkspaceBoardsQuery>,
  TError = unknown,
>(
  variables: GetWorkspaceBoardsQueryVariables,
  options: Omit<UseInfiniteQueryOptions<GetWorkspaceBoardsQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseInfiniteQueryOptions<GetWorkspaceBoardsQuery, TError, TData>['queryKey'];
  },
) => {
  const query = axiosRequest<GetWorkspaceBoardsQuery, GetWorkspaceBoardsQueryVariables>(
    GetWorkspaceBoardsDocument,
  );
  return useInfiniteQuery<GetWorkspaceBoardsQuery, TError, TData>(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? ['GetWorkspaceBoards.infinite', variables],
        queryFn: metaData => query({ ...variables, ...(metaData.pageParam ?? {}) }),
        ...restOptions,
      };
    })(),
  );
};

useInfiniteGetWorkspaceBoardsQuery.getKey = (variables: GetWorkspaceBoardsQueryVariables) => [
  'GetWorkspaceBoards.infinite',
  variables,
];

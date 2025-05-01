import * as Types from '../../types';

import { useQuery, useInfiniteQuery, UseQueryOptions, UseInfiniteQueryOptions, InfiniteData } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type GetBoardsForOutcomeGroupQueryVariables = Types.Exact<{
  getBoardsFourOutcomeGroupInput: Types.GetBoardsFourOutcomeGroupInput;
}>;


export type GetBoardsForOutcomeGroupQuery = { __typename?: 'Query', getBoardsForOutcomeGroup: { __typename?: 'GetOutcomeBoardsModel', limit: number, offset: number, count?: number | null, boards: Array<{ __typename?: 'GetBoardsOutcomeGroupModel', id: number, name: string, isPinned?: boolean | null }> } };



export const GetBoardsForOutcomeGroupDocument = `
    query GetBoardsForOutcomeGroup($getBoardsFourOutcomeGroupInput: GetBoardsFourOutcomeGroupInput!) {
  getBoardsForOutcomeGroup(
    getBoardsFourOutcomeGroupInput: $getBoardsFourOutcomeGroupInput
  ) {
    limit
    offset
    count
    boards {
      id
      name
      isPinned
    }
  }
}
    `;

export const useGetBoardsForOutcomeGroupQuery = <
      TData = GetBoardsForOutcomeGroupQuery,
      TError = unknown
    >(
      variables: GetBoardsForOutcomeGroupQueryVariables,
      options?: Omit<UseQueryOptions<GetBoardsForOutcomeGroupQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetBoardsForOutcomeGroupQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetBoardsForOutcomeGroupQuery, TError, TData>(
      {
    queryKey: ['GetBoardsForOutcomeGroup', variables],
    queryFn: axiosRequest<GetBoardsForOutcomeGroupQuery, GetBoardsForOutcomeGroupQueryVariables>(GetBoardsForOutcomeGroupDocument).bind(null, variables),
    ...options
  }
    )};

useGetBoardsForOutcomeGroupQuery.getKey = (variables: GetBoardsForOutcomeGroupQueryVariables) => ['GetBoardsForOutcomeGroup', variables];

export const useInfiniteGetBoardsForOutcomeGroupQuery = <
      TData = InfiniteData<GetBoardsForOutcomeGroupQuery>,
      TError = unknown
    >(
      variables: GetBoardsForOutcomeGroupQueryVariables,
      options: Omit<UseInfiniteQueryOptions<GetBoardsForOutcomeGroupQuery, TError, TData>, 'queryKey'> & { queryKey?: UseInfiniteQueryOptions<GetBoardsForOutcomeGroupQuery, TError, TData>['queryKey'] }
    ) => {
    const query = axiosRequest<GetBoardsForOutcomeGroupQuery, GetBoardsForOutcomeGroupQueryVariables>(GetBoardsForOutcomeGroupDocument)
    return useInfiniteQuery<GetBoardsForOutcomeGroupQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['GetBoardsForOutcomeGroup.infinite', variables],
      queryFn: (metaData) => query({...variables, ...(metaData.pageParam ?? {})}),
      ...restOptions
    }
  })()
    )};

useInfiniteGetBoardsForOutcomeGroupQuery.getKey = (variables: GetBoardsForOutcomeGroupQueryVariables) => ['GetBoardsForOutcomeGroup.infinite', variables];

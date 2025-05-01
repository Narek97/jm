import * as Types from '../../types';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type GetBoardOutcomesStatQueryVariables = Types.Exact<{
  boardId: Types.Scalars['Int']['input'];
  limit?: Types.InputMaybe<Types.Scalars['Int']['input']>;
}>;


export type GetBoardOutcomesStatQuery = { __typename?: 'Query', getBoardOutcomesStat: { __typename?: 'BoardStats', journeysCount: number, personasCount: number, outcomeStats: Array<{ __typename?: 'OutcomeGroupWithOutcomeCounts', count: number, icon: string, id: number, name?: string | null }> } };



export const GetBoardOutcomesStatDocument = `
    query GetBoardOutcomesStat($boardId: Int!, $limit: Int) {
  getBoardOutcomesStat(boardId: $boardId, limit: $limit) {
    journeysCount
    personasCount
    outcomeStats {
      count
      icon
      id
      name
    }
  }
}
    `;

export const useGetBoardOutcomesStatQuery = <
      TData = GetBoardOutcomesStatQuery,
      TError = unknown
    >(
      variables: GetBoardOutcomesStatQueryVariables,
      options?: Omit<UseQueryOptions<GetBoardOutcomesStatQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetBoardOutcomesStatQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetBoardOutcomesStatQuery, TError, TData>(
      {
    queryKey: ['GetBoardOutcomesStat', variables],
    queryFn: axiosRequest<GetBoardOutcomesStatQuery, GetBoardOutcomesStatQueryVariables>(GetBoardOutcomesStatDocument).bind(null, variables),
    ...options
  }
    )};

useGetBoardOutcomesStatQuery.getKey = (variables: GetBoardOutcomesStatQueryVariables) => ['GetBoardOutcomesStat', variables];

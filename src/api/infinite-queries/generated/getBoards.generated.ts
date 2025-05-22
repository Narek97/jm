import * as Types from '../../types';

import { useQuery, useInfiniteQuery, UseQueryOptions, UseInfiniteQueryOptions, InfiniteData } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type GetMyBoardsQueryVariables = Types.Exact<{
  getMyBoardsInput: Types.GetMyBoardsInput;
}>;


export type GetMyBoardsQuery = { __typename?: 'Query', getMyBoards: { __typename?: 'GetUserBoardsModel', limit: number, offset: number, count?: number | null, workspace: { __typename?: 'Workspace', id: number, name: string }, boards: Array<{ __typename?: 'BoardResponse', id: number, name: string, workspaceId: number, createdAt: any, updatedAt: any, defaultMapId?: number | null, journeyMapCount: number, personasCount: number, pinnedOutcomeGroupCount: number, outcomeGroupWithOutcomeCounts: Array<{ __typename?: 'OutcomeGroupWithOutcomeCounts', count: number, icon: string, id: number }>, maps: Array<{ __typename?: 'Map', title?: string | null, id: number, type: Types.MapTypeEnum, createdAt: any, updatedAt: any, selectedPersonas: Array<{ __typename?: 'personas', type: string, name: string, color?: string | null, id: number, croppedArea?: { __typename?: 'Position', width?: number | null, height?: number | null, x?: number | null, y?: number | null } | null, attachment?: { __typename?: 'Attachment', url: string, key: string, croppedArea?: { __typename?: 'Position', width?: number | null, height?: number | null, x?: number | null, y?: number | null } | null } | null }> }> }> } };



export const GetMyBoardsDocument = `
    query getMyBoards($getMyBoardsInput: GetMyBoardsInput!) {
  getMyBoards(getMyBoardsInput: $getMyBoardsInput) {
    limit
    offset
    count
    workspace {
      id
      name
    }
    boards {
      id
      name
      workspaceId
      createdAt
      updatedAt
      defaultMapId
      journeyMapCount
      personasCount
      pinnedOutcomeGroupCount
      outcomeGroupWithOutcomeCounts {
        count
        icon
        id
      }
      maps {
        title
        id
        type
        createdAt
        updatedAt
        selectedPersonas {
          croppedArea {
            width
            height
            x
            y
          }
          attachment {
            url
            key
            croppedArea {
              width
              height
              x
              y
            }
          }
          type
          name
          color
          id
        }
      }
    }
  }
}
    `;

export const useGetMyBoardsQuery = <
      TData = GetMyBoardsQuery,
      TError = unknown
    >(
      variables: GetMyBoardsQueryVariables,
      options?: Omit<UseQueryOptions<GetMyBoardsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetMyBoardsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetMyBoardsQuery, TError, TData>(
      {
    queryKey: ['getMyBoards', variables],
    queryFn: axiosRequest<GetMyBoardsQuery, GetMyBoardsQueryVariables>(GetMyBoardsDocument).bind(null, variables),
    ...options
  }
    )};

useGetMyBoardsQuery.getKey = (variables: GetMyBoardsQueryVariables) => ['getMyBoards', variables];

export const useInfiniteGetMyBoardsQuery = <
      TData = InfiniteData<GetMyBoardsQuery>,
      TError = unknown
    >(
      variables: GetMyBoardsQueryVariables,
      options: Omit<UseInfiniteQueryOptions<GetMyBoardsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseInfiniteQueryOptions<GetMyBoardsQuery, TError, TData>['queryKey'] }
    ) => {
    const query = axiosRequest<GetMyBoardsQuery, GetMyBoardsQueryVariables>(GetMyBoardsDocument)
    return useInfiniteQuery<GetMyBoardsQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['getMyBoards.infinite', variables],
      queryFn: (metaData) => query({...variables, ...(metaData.pageParam ?? {})}),
      ...restOptions
    }
  })()
    )};

useInfiniteGetMyBoardsQuery.getKey = (variables: GetMyBoardsQueryVariables) => ['getMyBoards.infinite', variables];

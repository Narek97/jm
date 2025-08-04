import * as Types from '../../types';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type GetWorkspaceByIdForAtlasQueryVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
}>;


export type GetWorkspaceByIdForAtlasQuery = { __typename?: 'Query', getWorkspaceById: { __typename?: 'GetWorkspaceWithStat', id: number, feedbackId: number, name: string, defaultFolder: { __typename?: 'Folder', id: number, name: string, ownerId: number, workspaceId: number, whiteboardCount: number } } };

export type GetWorkspaceByIdQueryVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
}>;


export type GetWorkspaceByIdQuery = { __typename?: 'Query', getWorkspaceById: { __typename?: 'GetWorkspaceWithStat', id: number, feedbackId: number, name: string } };



export const GetWorkspaceByIdForAtlasDocument = `
    query GetWorkspaceByIdForAtlas($id: Int!) {
  getWorkspaceById(id: $id) {
    id
    feedbackId
    name
    defaultFolder {
      id
      name
      ownerId
      workspaceId
      whiteboardCount
    }
  }
}
    `;

export const useGetWorkspaceByIdForAtlasQuery = <
      TData = GetWorkspaceByIdForAtlasQuery,
      TError = unknown
    >(
      variables: GetWorkspaceByIdForAtlasQueryVariables,
      options?: Omit<UseQueryOptions<GetWorkspaceByIdForAtlasQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetWorkspaceByIdForAtlasQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetWorkspaceByIdForAtlasQuery, TError, TData>(
      {
    queryKey: ['GetWorkspaceByIdForAtlas', variables],
    queryFn: axiosRequest<GetWorkspaceByIdForAtlasQuery, GetWorkspaceByIdForAtlasQueryVariables>(GetWorkspaceByIdForAtlasDocument).bind(null, variables),
    ...options
  }
    )};

useGetWorkspaceByIdForAtlasQuery.getKey = (variables: GetWorkspaceByIdForAtlasQueryVariables) => ['GetWorkspaceByIdForAtlas', variables];

export const GetWorkspaceByIdDocument = `
    query GetWorkspaceById($id: Int!) {
  getWorkspaceById(id: $id) {
    id
    feedbackId
    name
  }
}
    `;

export const useGetWorkspaceByIdQuery = <
      TData = GetWorkspaceByIdQuery,
      TError = unknown
    >(
      variables: GetWorkspaceByIdQueryVariables,
      options?: Omit<UseQueryOptions<GetWorkspaceByIdQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetWorkspaceByIdQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetWorkspaceByIdQuery, TError, TData>(
      {
    queryKey: ['GetWorkspaceById', variables],
    queryFn: axiosRequest<GetWorkspaceByIdQuery, GetWorkspaceByIdQueryVariables>(GetWorkspaceByIdDocument).bind(null, variables),
    ...options
  }
    )};

useGetWorkspaceByIdQuery.getKey = (variables: GetWorkspaceByIdQueryVariables) => ['GetWorkspaceById', variables];

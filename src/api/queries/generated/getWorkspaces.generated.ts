import * as Types from '../../types';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type GetWorkspacesByOrganizationIdQueryVariables = Types.Exact<{
  getWorkspacesInput: Types.GetWorkspacesInput;
}>;


export type GetWorkspacesByOrganizationIdQuery = { __typename?: 'Query', getWorkspacesByOrganizationId: { __typename?: 'GetUserWorkspacesModel', limit: number, offset: number, count?: number | null, workspaces: Array<{ __typename?: 'GetWorkspaceWithStat', id: number, name: string, description?: string | null, boardsCount?: number | null, journeyMapCount: number, personasCount: number, createdAt: any }> } };



export const GetWorkspacesByOrganizationIdDocument = `
    query GetWorkspacesByOrganizationId($getWorkspacesInput: GetWorkspacesInput!) {
  getWorkspacesByOrganizationId(getWorkspacesInput: $getWorkspacesInput) {
    limit
    offset
    count
    workspaces {
      id
      name
      description
      boardsCount
      journeyMapCount
      personasCount
      personasCount
      createdAt
    }
  }
}
    `;

export const useGetWorkspacesByOrganizationIdQuery = <
      TData = GetWorkspacesByOrganizationIdQuery,
      TError = unknown
    >(
      variables: GetWorkspacesByOrganizationIdQueryVariables,
      options?: Omit<UseQueryOptions<GetWorkspacesByOrganizationIdQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetWorkspacesByOrganizationIdQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetWorkspacesByOrganizationIdQuery, TError, TData>(
      {
    queryKey: ['GetWorkspacesByOrganizationId', variables],
    queryFn: axiosRequest<GetWorkspacesByOrganizationIdQuery, GetWorkspacesByOrganizationIdQueryVariables>(GetWorkspacesByOrganizationIdDocument).bind(null, variables),
    ...options
  }
    )};

useGetWorkspacesByOrganizationIdQuery.getKey = (variables: GetWorkspacesByOrganizationIdQueryVariables) => ['GetWorkspacesByOrganizationId', variables];

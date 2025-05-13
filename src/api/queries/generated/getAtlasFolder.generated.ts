import * as Types from '../../types';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type GetFoldersQueryVariables = Types.Exact<{
  getFoldersInput: Types.GetFoldersInput;
}>;


export type GetFoldersQuery = { __typename?: 'Query', getFolders: { __typename?: 'GetFoldersModel', count?: number | null, folders: Array<{ __typename?: 'Folder', id: number, name: string, ownerId: number, workspaceId: number, whiteboardCount: number }> } };



export const GetFoldersDocument = `
    query GetFolders($getFoldersInput: GetFoldersInput!) {
  getFolders(getFoldersInput: $getFoldersInput) {
    count
    folders {
      id
      name
      ownerId
      workspaceId
      whiteboardCount
    }
  }
}
    `;

export const useGetFoldersQuery = <
      TData = GetFoldersQuery,
      TError = unknown
    >(
      variables: GetFoldersQueryVariables,
      options?: Omit<UseQueryOptions<GetFoldersQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetFoldersQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetFoldersQuery, TError, TData>(
      {
    queryKey: ['GetFolders', variables],
    queryFn: axiosRequest<GetFoldersQuery, GetFoldersQueryVariables>(GetFoldersDocument).bind(null, variables),
    ...options
  }
    )};

useGetFoldersQuery.getKey = (variables: GetFoldersQueryVariables) => ['GetFolders', variables];

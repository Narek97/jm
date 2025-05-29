import * as Types from '../../types';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type GetWorkspacesForPastQueryVariables = Types.Exact<{
  orgId: Types.Scalars['Int']['input'];
}>;

export type GetWorkspacesForPastQuery = {
  __typename?: 'Query';
  getWorkspaces: Array<{
    __typename?: 'WorkspaceResponseModel';
    id: number;
    name: string;
  }>;
};

export const GetWorkspacesForPastDocument = `
    query GetWorkspacesForPast($orgId: Int!) {
  getWorkspaces(orgId: $orgId) {
    id
    name
  }
}
    `;

export const useGetWorkspacesForPastQuery = <TData = GetWorkspacesForPastQuery, TError = unknown>(
  variables: GetWorkspacesForPastQueryVariables,
  options?: Omit<UseQueryOptions<GetWorkspacesForPastQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseQueryOptions<GetWorkspacesForPastQuery, TError, TData>['queryKey'];
  },
) => {
  return useQuery<GetWorkspacesForPastQuery, TError, TData>({
    queryKey: ['GetWorkspacesForPast', variables],
    queryFn: axiosRequest<GetWorkspacesForPastQuery, GetWorkspacesForPastQueryVariables>(
      GetWorkspacesForPastDocument,
    ).bind(null, variables),
    ...options,
  });
};

useGetWorkspacesForPastQuery.getKey = (variables: GetWorkspacesForPastQueryVariables) => [
  'GetWorkspacesForPast',
  variables,
];

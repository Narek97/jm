import * as Types from '../../types';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type GetUserSessionQueryVariables = Types.Exact<{
  getUserSessionInput: Types.GetUserSessionInput;
}>;


export type GetUserSessionQuery = { __typename?: 'Query', getUserSession?: { __typename?: 'GetUserSessionModel', count?: number | null, session: Array<{ __typename?: 'GetUserSessionModelUserModel', id: number, userId: number, sessionCount?: number | null, createdAt?: any | null, member?: { __typename?: 'GetUserSessionMemberModel', id: number, emailAddress?: string | null, orgId?: number | null } | null }> } | null };



export const GetUserSessionDocument = `
    query GetUserSession($getUserSessionInput: GetUserSessionInput!) {
  getUserSession(getUserSessionInput: $getUserSessionInput) {
    count
    session {
      id
      userId
      sessionCount
      createdAt
      member {
        id
        emailAddress
        orgId
      }
    }
  }
}
    `;

export const useGetUserSessionQuery = <
      TData = GetUserSessionQuery,
      TError = unknown
    >(
      variables: GetUserSessionQueryVariables,
      options?: Omit<UseQueryOptions<GetUserSessionQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetUserSessionQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetUserSessionQuery, TError, TData>(
      {
    queryKey: ['GetUserSession', variables],
    queryFn: axiosRequest<GetUserSessionQuery, GetUserSessionQueryVariables>(GetUserSessionDocument).bind(null, variables),
    ...options
  }
    )};

useGetUserSessionQuery.getKey = (variables: GetUserSessionQueryVariables) => ['GetUserSession', variables];

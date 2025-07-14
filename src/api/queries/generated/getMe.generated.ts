import * as Types from '../../types';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type GetMeQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetMeQuery = { __typename?: 'Query', getMe: { __typename?: 'User', emailAddress: string, firstName: string, lastName: string, userID: number, orgID: number, isAdmin: boolean, primaryUserAPIKey: string, orgLanguage: Types.LanguagesEnum, apiToken: string, userAPIKey: string, debugMode?: boolean | null, superAdmin: boolean, businessType?: Array<{ __typename?: 'KeyValue', value: string }> | null } };



export const GetMeDocument = `
    query GetMe {
  getMe {
    emailAddress
    firstName
    lastName
    userID
    orgID
    isAdmin
    primaryUserAPIKey
    orgLanguage
    apiToken
    userAPIKey
    businessType {
      value
    }
    debugMode
    superAdmin
  }
}
    `;

export const useGetMeQuery = <
      TData = GetMeQuery,
      TError = unknown
    >(
      variables?: GetMeQueryVariables,
      options?: Omit<UseQueryOptions<GetMeQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetMeQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetMeQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['GetMe'] : ['GetMe', variables],
    queryFn: axiosRequest<GetMeQuery, GetMeQueryVariables>(GetMeDocument).bind(null, variables),
    ...options
  }
    )};

useGetMeQuery.getKey = (variables?: GetMeQueryVariables) => variables === undefined ? ['GetMe'] : ['GetMe', variables];

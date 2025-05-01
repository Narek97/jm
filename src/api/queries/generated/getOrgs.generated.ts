import * as Types from '../../types';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type GetOrgsQueryVariables = Types.Exact<{
  getOrgsInput?: Types.InputMaybe<Types.GetOrgsInput>;
}>;


export type GetOrgsQuery = { __typename?: 'Query', getOrgs: Array<{ __typename?: 'OrgSettings', id: number, businessTypeId?: number | null, orgId: number, name?: string | null }> };



export const GetOrgsDocument = `
    query GetOrgs($getOrgsInput: GetOrgsInput) {
  getOrgs(getOrgsInput: $getOrgsInput) {
    id
    businessTypeId
    orgId
    name
  }
}
    `;

export const useGetOrgsQuery = <
      TData = GetOrgsQuery,
      TError = unknown
    >(
      variables?: GetOrgsQueryVariables,
      options?: Omit<UseQueryOptions<GetOrgsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetOrgsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetOrgsQuery, TError, TData>(
      {
    queryKey: variables === undefined ? ['GetOrgs'] : ['GetOrgs', variables],
    queryFn: axiosRequest<GetOrgsQuery, GetOrgsQueryVariables>(GetOrgsDocument).bind(null, variables),
    ...options
  }
    )};

useGetOrgsQuery.getKey = (variables?: GetOrgsQueryVariables) => variables === undefined ? ['GetOrgs'] : ['GetOrgs', variables];

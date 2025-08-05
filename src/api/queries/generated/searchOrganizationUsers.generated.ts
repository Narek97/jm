import * as Types from '../../types';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type SearchOrganizationUsersQueryVariables = Types.Exact<{
  searchOrganizationUserInput: Types.SearchOrganizationUserInput;
}>;

export type SearchOrganizationUsersQuery = {
  __typename?: 'Query';
  searchOrganizationUsers: Array<{
    __typename?: 'Member';
    id: number;
    userId: number;
    firstName: string;
    lastName: string;
    emailAddress: string;
    superAdmin: boolean;
  }>;
};

export const SearchOrganizationUsersDocument = `
    query SearchOrganizationUsers($searchOrganizationUserInput: SearchOrganizationUserInput!) {
  searchOrganizationUsers(
    searchOrganizationUserInput: $searchOrganizationUserInput
  ) {
    id
    userId
    firstName
    lastName
    emailAddress
    superAdmin
  }
}
    `;

export const useSearchOrganizationUsersQuery = <
  TData = SearchOrganizationUsersQuery,
  TError = unknown,
>(
  variables: SearchOrganizationUsersQueryVariables,
  options?: Omit<UseQueryOptions<SearchOrganizationUsersQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseQueryOptions<SearchOrganizationUsersQuery, TError, TData>['queryKey'];
  },
) => {
  return useQuery<SearchOrganizationUsersQuery, TError, TData>({
    queryKey: ['SearchOrganizationUsers', variables],
    queryFn: axiosRequest<SearchOrganizationUsersQuery, SearchOrganizationUsersQueryVariables>(
      SearchOrganizationUsersDocument,
    ).bind(null, variables),
    ...options,
  });
};

useSearchOrganizationUsersQuery.getKey = (variables: SearchOrganizationUsersQueryVariables) => [
  'SearchOrganizationUsers',
  variables,
];

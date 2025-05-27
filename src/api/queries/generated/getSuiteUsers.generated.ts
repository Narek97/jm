import * as Types from '../../types';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type GetSuiteUsersQueryVariables = Types.Exact<{
  orgId: Types.Scalars['Int']['input'];
}>;

export type GetSuiteUsersQuery = {
  __typename?: 'Query';
  getSuiteUsers: {
    __typename?: 'GetUsersModel';
    orgName: string;
    users: Array<{
      __typename?: 'SuiteUserModel';
      user_id: number;
      user_fname: string;
      user_email: string;
      user_date_added?: any | null;
      user_status?: string | null;
    }>;
  };
};

export const GetSuiteUsersDocument = `
    query getSuiteUsers($orgId: Int!) {
  getSuiteUsers(orgId: $orgId) {
    orgName
    users {
      user_id
      user_fname
      user_email
      user_date_added
      user_status
    }
  }
}
    `;

export const useGetSuiteUsersQuery = <TData = GetSuiteUsersQuery, TError = unknown>(
  variables: GetSuiteUsersQueryVariables,
  options?: Omit<UseQueryOptions<GetSuiteUsersQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseQueryOptions<GetSuiteUsersQuery, TError, TData>['queryKey'];
  },
) => {
  return useQuery<GetSuiteUsersQuery, TError, TData>({
    queryKey: ['getSuiteUsers', variables],
    queryFn: axiosRequest<GetSuiteUsersQuery, GetSuiteUsersQueryVariables>(
      GetSuiteUsersDocument,
    ).bind(null, variables),
    ...options,
  });
};

useGetSuiteUsersQuery.getKey = (variables: GetSuiteUsersQueryVariables) => [
  'getSuiteUsers',
  variables,
];

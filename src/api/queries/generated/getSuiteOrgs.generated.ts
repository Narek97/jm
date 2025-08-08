import * as Types from '../../types';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type GetSuiteOrgsQueryVariables = Types.Exact<{
  getSuiteOrgsInput: Types.GetSuiteOrgsInput;
}>;

export type GetSuiteOrgsQuery = {
  __typename?: 'Query';
  getSuiteOrgs: Array<{
    __typename?: 'SuiteOrgModel';
    acc_id: number;
    acc_date_added?: any | null;
    acc_name: string;
    qp_org_id?: number | null;
    acc_status: string;
  }>;
};

export const GetSuiteOrgsDocument = `
    query GetSuiteOrgs($getSuiteOrgsInput: GetSuiteOrgsInput!) {
  getSuiteOrgs(getSuiteOrgsInput: $getSuiteOrgsInput) {
    acc_id
    acc_date_added
    acc_name
    qp_org_id
    acc_status
  }
}
    `;

export const useGetSuiteOrgsQuery = <TData = GetSuiteOrgsQuery, TError = unknown>(
  variables: GetSuiteOrgsQueryVariables,
  options?: Omit<UseQueryOptions<GetSuiteOrgsQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseQueryOptions<GetSuiteOrgsQuery, TError, TData>['queryKey'];
  },
) => {
  return useQuery<GetSuiteOrgsQuery, TError, TData>({
    queryKey: ['GetSuiteOrgs', variables],
    queryFn: axiosRequest<GetSuiteOrgsQuery, GetSuiteOrgsQueryVariables>(GetSuiteOrgsDocument).bind(
      null,
      variables,
    ),
    ...options,
  });
};

useGetSuiteOrgsQuery.getKey = (variables: GetSuiteOrgsQueryVariables) => [
  'GetSuiteOrgs',
  variables,
];

import * as Types from '../../types';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type GetProjectsQueryVariables = Types.Exact<{
  orgId: Types.Scalars['Int']['input'];
}>;


export type GetProjectsQuery = { __typename?: 'Query', getProjects: Array<{ __typename?: 'SuiteProjectModel', pro_project_id: number, pro_acc_id: number, pro_add_date?: any | null, pro_mod_date?: any | null, pro_project_name: string, pro_project_desc?: string | null }> };



export const GetProjectsDocument = `
    query GetProjects($orgId: Int!) {
  getProjects(orgId: $orgId) {
    pro_project_id
    pro_acc_id
    pro_add_date
    pro_mod_date
    pro_project_name
    pro_project_desc
    pro_project_id
  }
}
    `;

export const useGetProjectsQuery = <
      TData = GetProjectsQuery,
      TError = unknown
    >(
      variables: GetProjectsQueryVariables,
      options?: Omit<UseQueryOptions<GetProjectsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetProjectsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetProjectsQuery, TError, TData>(
      {
    queryKey: ['GetProjects', variables],
    queryFn: axiosRequest<GetProjectsQuery, GetProjectsQueryVariables>(GetProjectsDocument).bind(null, variables),
    ...options
  }
    )};

useGetProjectsQuery.getKey = (variables: GetProjectsQueryVariables) => ['GetProjects', variables];

import * as Types from '../../types';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type GetProjectMapsQueryVariables = Types.Exact<{
  projectId: Types.Scalars['Int']['input'];
}>;

export type GetProjectMapsQuery = {
  __typename?: 'Query';
  getProjectMaps: Array<{
    __typename?: 'SuiteMapModel';
    c_id: number;
    cs_name: string;
    cs_project_id: number;
    cs_added_date?: any | null;
  }>;
};

export const GetProjectMapsDocument = `
    query GetProjectMaps($projectId: Int!) {
  getProjectMaps(projectId: $projectId) {
    c_id
    cs_name
    cs_project_id
    cs_added_date
  }
}
    `;

export const useGetProjectMapsQuery = <TData = GetProjectMapsQuery, TError = unknown>(
  variables: GetProjectMapsQueryVariables,
  options?: Omit<UseQueryOptions<GetProjectMapsQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseQueryOptions<GetProjectMapsQuery, TError, TData>['queryKey'];
  },
) => {
  return useQuery<GetProjectMapsQuery, TError, TData>({
    queryKey: ['GetProjectMaps', variables],
    queryFn: axiosRequest<GetProjectMapsQuery, GetProjectMapsQueryVariables>(
      GetProjectMapsDocument,
    ).bind(null, variables),
    ...options,
  });
};

useGetProjectMapsQuery.getKey = (variables: GetProjectMapsQueryVariables) => [
  'GetProjectMaps',
  variables,
];

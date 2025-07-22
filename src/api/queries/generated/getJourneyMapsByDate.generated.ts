import * as Types from '../../types';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type GetJourneyMapsByDateQueryVariables = Types.Exact<{
  getJourneyMapsByDateInput: Types.GetJourneyMapsByDateInput;
}>;

export type GetJourneyMapsByDateQuery = {
  __typename?: 'Query';
  getJourneyMapsByDate?: {
    __typename?: 'GetJourneyMapsByDateModel';
    count?: number | null;
    maps: Array<{
      __typename?: 'GetJourneyMapsByDateMapsModel';
      id: number;
      updatedAt?: any | null;
      createdAt?: any | null;
      title?: string | null;
      owner?: {
        __typename?: 'GetJourneyMapsByDateOwnerModel';
        orgId?: number | null;
        id: number;
        emailAddress?: string | null;
      } | null;
    }>;
  } | null;
};

export const GetJourneyMapsByDateDocument = `
    query GetJourneyMapsByDate($getJourneyMapsByDateInput: GetJourneyMapsByDateInput!) {
  getJourneyMapsByDate(getJourneyMapsByDateInput: $getJourneyMapsByDateInput) {
    count
    maps {
      id
      updatedAt
      createdAt
      title
      owner {
        orgId
        id
        emailAddress
      }
    }
  }
}
    `;

export const useGetJourneyMapsByDateQuery = <TData = GetJourneyMapsByDateQuery, TError = unknown>(
  variables: GetJourneyMapsByDateQueryVariables,
  options?: Omit<UseQueryOptions<GetJourneyMapsByDateQuery, TError, TData>, 'queryKey'> & {
    queryKey?: UseQueryOptions<GetJourneyMapsByDateQuery, TError, TData>['queryKey'];
  },
) => {
  return useQuery<GetJourneyMapsByDateQuery, TError, TData>({
    queryKey: ['GetJourneyMapsByDate', variables],
    queryFn: axiosRequest<GetJourneyMapsByDateQuery, GetJourneyMapsByDateQueryVariables>(
      GetJourneyMapsByDateDocument,
    ).bind(null, variables),
    ...options,
  });
};

useGetJourneyMapsByDateQuery.getKey = (variables: GetJourneyMapsByDateQueryVariables) => [
  'GetJourneyMapsByDate',
  variables,
];

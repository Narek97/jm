import * as Types from '../../types';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type GetJourneyMapRowsAndColumnsQueryVariables = Types.Exact<{
  getJourneyMapRowsAndColumnsInput: Types.GetJourneyMapRowsAndColumnsInput;
}>;


export type GetJourneyMapRowsAndColumnsQuery = { __typename?: 'Query', getJourneyMapRowsAndColumns: { __typename?: 'GetJourneyMapRowsAndColumnResponse', columns: Array<{ __typename?: 'MergedColumnResponse', id: number, label: string, mergedIds: Array<number> }>, rows: Array<{ __typename?: 'IdLabelResponse', id: number, label: string }> } };



export const GetJourneyMapRowsAndColumnsDocument = `
    query GetJourneyMapRowsAndColumns($getJourneyMapRowsAndColumnsInput: GetJourneyMapRowsAndColumnsInput!) {
  getJourneyMapRowsAndColumns(
    getJourneyMapRowsAndColumnsInput: $getJourneyMapRowsAndColumnsInput
  ) {
    columns {
      id
      label
      mergedIds
    }
    rows {
      id
      label
    }
  }
}
    `;

export const useGetJourneyMapRowsAndColumnsQuery = <
      TData = GetJourneyMapRowsAndColumnsQuery,
      TError = unknown
    >(
      variables: GetJourneyMapRowsAndColumnsQueryVariables,
      options?: Omit<UseQueryOptions<GetJourneyMapRowsAndColumnsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetJourneyMapRowsAndColumnsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetJourneyMapRowsAndColumnsQuery, TError, TData>(
      {
    queryKey: ['GetJourneyMapRowsAndColumns', variables],
    queryFn: axiosRequest<GetJourneyMapRowsAndColumnsQuery, GetJourneyMapRowsAndColumnsQueryVariables>(GetJourneyMapRowsAndColumnsDocument).bind(null, variables),
    ...options
  }
    )};

useGetJourneyMapRowsAndColumnsQuery.getKey = (variables: GetJourneyMapRowsAndColumnsQueryVariables) => ['GetJourneyMapRowsAndColumns', variables];

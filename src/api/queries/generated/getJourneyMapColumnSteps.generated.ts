import * as Types from '../../types';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type GetJourneyMapColumnStepsQueryVariables = Types.Exact<{
  getJourneyMapColumnStepsInput: Types.GetJourneyMapColumnStepsInput;
}>;


export type GetJourneyMapColumnStepsQuery = { __typename?: 'Query', getJourneyMapColumnSteps: { __typename?: 'GetJourneyMapColumnStepsResponse', stepsByColumnId: any } };



export const GetJourneyMapColumnStepsDocument = `
    query GetJourneyMapColumnSteps($getJourneyMapColumnStepsInput: GetJourneyMapColumnStepsInput!) {
  getJourneyMapColumnSteps(
    getJourneyMapColumnStepsInput: $getJourneyMapColumnStepsInput
  ) {
    stepsByColumnId
  }
}
    `;

export const useGetJourneyMapColumnStepsQuery = <
      TData = GetJourneyMapColumnStepsQuery,
      TError = unknown
    >(
      variables: GetJourneyMapColumnStepsQueryVariables,
      options?: Omit<UseQueryOptions<GetJourneyMapColumnStepsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<GetJourneyMapColumnStepsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<GetJourneyMapColumnStepsQuery, TError, TData>(
      {
    queryKey: ['GetJourneyMapColumnSteps', variables],
    queryFn: axiosRequest<GetJourneyMapColumnStepsQuery, GetJourneyMapColumnStepsQueryVariables>(GetJourneyMapColumnStepsDocument).bind(null, variables),
    ...options
  }
    )};

useGetJourneyMapColumnStepsQuery.getKey = (variables: GetJourneyMapColumnStepsQueryVariables) => ['GetJourneyMapColumnSteps', variables];

import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type CompareJourneyMapJsonMutationVariables = Types.Exact<{
  compareJourneyMapJsonInput: Types.CompareJourneyMapJsonInput;
}>;


export type CompareJourneyMapJsonMutation = { __typename?: 'Mutation', compareJourneyMapJson?: { __typename?: 'MapDebugLogs', id: number } | null };



export const CompareJourneyMapJsonDocument = `
    mutation CompareJourneyMapJson($compareJourneyMapJsonInput: CompareJourneyMapJsonInput!) {
  compareJourneyMapJson(compareJourneyMapJsonInput: $compareJourneyMapJsonInput) {
    id
  }
}
    `;

export const useCompareJourneyMapJsonMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CompareJourneyMapJsonMutation, TError, CompareJourneyMapJsonMutationVariables, TContext>) => {
    
    return useMutation<CompareJourneyMapJsonMutation, TError, CompareJourneyMapJsonMutationVariables, TContext>(
      {
    mutationKey: ['CompareJourneyMapJson'],
    mutationFn: axiosRequest<CompareJourneyMapJsonMutation, CompareJourneyMapJsonMutationVariables>(CompareJourneyMapJsonDocument),
    ...options
  }
    )};

useCompareJourneyMapJsonMutation.getKey = () => ['CompareJourneyMapJson'];

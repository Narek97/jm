import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type UpdateJourneyMapRowMutationVariables = Types.Exact<{
  updateRowInput: Types.UpdateRowInput;
}>;


export type UpdateJourneyMapRowMutation = { __typename?: 'Mutation', updateJourneyMapRow: number };



export const UpdateJourneyMapRowDocument = `
    mutation UpdateJourneyMapRow($updateRowInput: UpdateRowInput!) {
  updateJourneyMapRow(updateRowInput: $updateRowInput)
}
    `;

export const useUpdateJourneyMapRowMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateJourneyMapRowMutation, TError, UpdateJourneyMapRowMutationVariables, TContext>) => {
    
    return useMutation<UpdateJourneyMapRowMutation, TError, UpdateJourneyMapRowMutationVariables, TContext>(
      {
    mutationKey: ['UpdateJourneyMapRow'],
    mutationFn: axiosRequest<UpdateJourneyMapRowMutation, UpdateJourneyMapRowMutationVariables>(UpdateJourneyMapRowDocument),
    ...options
  }
    )};

useUpdateJourneyMapRowMutation.getKey = () => ['UpdateJourneyMapRow'];

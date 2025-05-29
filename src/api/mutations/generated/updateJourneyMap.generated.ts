import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type UpdateJourneyMapMutationVariables = Types.Exact<{
  updateJourneyMapInput: Types.UpdateJourneyMapInput;
}>;

export type UpdateJourneyMapMutation = {
  __typename?: 'Mutation';
  updateJourneyMap: number;
};

export const UpdateJourneyMapDocument = `
    mutation UpdateJourneyMap($updateJourneyMapInput: UpdateJourneyMapInput!) {
  updateJourneyMap(updateJourneyMapInput: $updateJourneyMapInput)
}
    `;

export const useUpdateJourneyMapMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    UpdateJourneyMapMutation,
    TError,
    UpdateJourneyMapMutationVariables,
    TContext
  >,
) => {
  return useMutation<UpdateJourneyMapMutation, TError, UpdateJourneyMapMutationVariables, TContext>(
    {
      mutationKey: ['UpdateJourneyMap'],
      mutationFn: axiosRequest<UpdateJourneyMapMutation, UpdateJourneyMapMutationVariables>(
        UpdateJourneyMapDocument,
      ),
      ...options,
    },
  );
};

useUpdateJourneyMapMutation.getKey = () => ['UpdateJourneyMap'];

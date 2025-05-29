import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type UpdateAiJourneyModelMutationVariables = Types.Exact<{
  updateAiJourneyInput: Types.UpdateAiJourneyInput;
}>;

export type UpdateAiJourneyModelMutation = {
  __typename?: 'Mutation';
  updateAiJourneyModel: {
    __typename?: 'AiJourneyModelResponse';
    id: number;
    attachmentUrl?: string | null;
    name?: string | null;
    prompt: string;
    universal: boolean;
    selectedOrgIds: Array<number>;
    transcriptPlace: number;
  };
};

export const UpdateAiJourneyModelDocument = `
    mutation UpdateAiJourneyModel($updateAiJourneyInput: UpdateAiJourneyInput!) {
  updateAiJourneyModel(updateAiJourneyInput: $updateAiJourneyInput) {
    id
    attachmentUrl
    name
    prompt
    universal
    selectedOrgIds
    transcriptPlace
  }
}
    `;

export const useUpdateAiJourneyModelMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    UpdateAiJourneyModelMutation,
    TError,
    UpdateAiJourneyModelMutationVariables,
    TContext
  >,
) => {
  return useMutation<
    UpdateAiJourneyModelMutation,
    TError,
    UpdateAiJourneyModelMutationVariables,
    TContext
  >({
    mutationKey: ['UpdateAiJourneyModel'],
    mutationFn: axiosRequest<UpdateAiJourneyModelMutation, UpdateAiJourneyModelMutationVariables>(
      UpdateAiJourneyModelDocument,
    ),
    ...options,
  });
};

useUpdateAiJourneyModelMutation.getKey = () => ['UpdateAiJourneyModel'];

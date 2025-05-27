import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type PinPersonaSectionMutationVariables = Types.Exact<{
  pinSectionInput: Types.PinInput;
}>;

export type PinPersonaSectionMutation = {
  __typename?: 'Mutation';
  pinPersonaSection: number;
};

export const PinPersonaSectionDocument = `
    mutation PinPersonaSection($pinSectionInput: PinInput!) {
  pinPersonaSection(pinSectionInput: $pinSectionInput)
}
    `;

export const usePinPersonaSectionMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    PinPersonaSectionMutation,
    TError,
    PinPersonaSectionMutationVariables,
    TContext
  >,
) => {
  return useMutation<
    PinPersonaSectionMutation,
    TError,
    PinPersonaSectionMutationVariables,
    TContext
  >({
    mutationKey: ['PinPersonaSection'],
    mutationFn: axiosRequest<PinPersonaSectionMutation, PinPersonaSectionMutationVariables>(
      PinPersonaSectionDocument,
    ),
    ...options,
  });
};

usePinPersonaSectionMutation.getKey = () => ['PinPersonaSection'];

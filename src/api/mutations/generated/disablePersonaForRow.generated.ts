import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type DisablePersonaForRowMutationVariables = Types.Exact<{
  disablePersonaInput: Types.DisablePersonaInput;
}>;


export type DisablePersonaForRowMutation = { __typename?: 'Mutation', disablePersonaForRow: number };



export const DisablePersonaForRowDocument = `
    mutation disablePersonaForRow($disablePersonaInput: DisablePersonaInput!) {
  disablePersonaForRow(disablePersonaInput: $disablePersonaInput)
}
    `;

export const useDisablePersonaForRowMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DisablePersonaForRowMutation, TError, DisablePersonaForRowMutationVariables, TContext>) => {
    
    return useMutation<DisablePersonaForRowMutation, TError, DisablePersonaForRowMutationVariables, TContext>(
      {
    mutationKey: ['disablePersonaForRow'],
    mutationFn: axiosRequest<DisablePersonaForRowMutation, DisablePersonaForRowMutationVariables>(DisablePersonaForRowDocument),
    ...options
  }
    )};

useDisablePersonaForRowMutation.getKey = () => ['disablePersonaForRow'];

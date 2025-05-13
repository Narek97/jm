import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type ToggleDebugModeMutationVariables = Types.Exact<{
  debugMode: Types.Scalars['Boolean']['input'];
}>;


export type ToggleDebugModeMutation = { __typename?: 'Mutation', toggleDebugMode: { __typename?: 'Member', id: number } };



export const ToggleDebugModeDocument = `
    mutation ToggleDebugMode($debugMode: Boolean!) {
  toggleDebugMode(debugMode: $debugMode) {
    id
  }
}
    `;

export const useToggleDebugModeMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<ToggleDebugModeMutation, TError, ToggleDebugModeMutationVariables, TContext>) => {
    
    return useMutation<ToggleDebugModeMutation, TError, ToggleDebugModeMutationVariables, TContext>(
      {
    mutationKey: ['ToggleDebugMode'],
    mutationFn: axiosRequest<ToggleDebugModeMutation, ToggleDebugModeMutationVariables>(ToggleDebugModeDocument),
    ...options
  }
    )};

useToggleDebugModeMutation.getKey = () => ['ToggleDebugMode'];

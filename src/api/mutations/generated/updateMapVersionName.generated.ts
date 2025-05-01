import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type UpdateMapVersionNameMutationVariables = Types.Exact<{
  updateMapVersionInput: Types.UpdateMapVersionInput;
}>;


export type UpdateMapVersionNameMutation = { __typename?: 'Mutation', updateMapVersionName: { __typename?: 'MapVersion', id: number } };



export const UpdateMapVersionNameDocument = `
    mutation UpdateMapVersionName($updateMapVersionInput: UpdateMapVersionInput!) {
  updateMapVersionName(updateMapVersionInput: $updateMapVersionInput) {
    id
  }
}
    `;

export const useUpdateMapVersionNameMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateMapVersionNameMutation, TError, UpdateMapVersionNameMutationVariables, TContext>) => {
    
    return useMutation<UpdateMapVersionNameMutation, TError, UpdateMapVersionNameMutationVariables, TContext>(
      {
    mutationKey: ['UpdateMapVersionName'],
    mutationFn: axiosRequest<UpdateMapVersionNameMutation, UpdateMapVersionNameMutationVariables>(UpdateMapVersionNameDocument),
    ...options
  }
    )};

useUpdateMapVersionNameMutation.getKey = () => ['UpdateMapVersionName'];

import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type UpdateLayerMutationVariables = Types.Exact<{
  updateLayerInput: Types.UpdateLayerInput;
}>;


export type UpdateLayerMutation = { __typename?: 'Mutation', updateLayer: { __typename?: 'Layer', id: number, columnIds?: Array<number> | null, rowIds?: Array<number> | null, tagIds?: Array<number> | null, columnSelectedStepIds: any } };



export const UpdateLayerDocument = `
    mutation UpdateLayer($updateLayerInput: UpdateLayerInput!) {
  updateLayer(updateLayerInput: $updateLayerInput) {
    id
    columnIds
    rowIds
    tagIds
    columnSelectedStepIds
  }
}
    `;

export const useUpdateLayerMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateLayerMutation, TError, UpdateLayerMutationVariables, TContext>) => {
    
    return useMutation<UpdateLayerMutation, TError, UpdateLayerMutationVariables, TContext>(
      {
    mutationKey: ['UpdateLayer'],
    mutationFn: axiosRequest<UpdateLayerMutation, UpdateLayerMutationVariables>(UpdateLayerDocument),
    ...options
  }
    )};

useUpdateLayerMutation.getKey = () => ['UpdateLayer'];

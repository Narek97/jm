import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type UpdateAttachmentNameMutationVariables = Types.Exact<{
  updateAttachmentNameInput: Types.UpdateAttachmentNameInput;
}>;


export type UpdateAttachmentNameMutation = { __typename?: 'Mutation', updateAttachmentName: string };



export const UpdateAttachmentNameDocument = `
    mutation UpdateAttachmentName($updateAttachmentNameInput: UpdateAttachmentNameInput!) {
  updateAttachmentName(updateAttachmentNameInput: $updateAttachmentNameInput)
}
    `;

export const useUpdateAttachmentNameMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateAttachmentNameMutation, TError, UpdateAttachmentNameMutationVariables, TContext>) => {
    
    return useMutation<UpdateAttachmentNameMutation, TError, UpdateAttachmentNameMutationVariables, TContext>(
      {
    mutationKey: ['UpdateAttachmentName'],
    mutationFn: axiosRequest<UpdateAttachmentNameMutation, UpdateAttachmentNameMutationVariables>(UpdateAttachmentNameDocument),
    ...options
  }
    )};

useUpdateAttachmentNameMutation.getKey = () => ['UpdateAttachmentName'];

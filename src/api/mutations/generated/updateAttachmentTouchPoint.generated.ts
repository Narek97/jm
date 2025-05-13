import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type UpdateAttachmentTouchPointMutationVariables = Types.Exact<{
  updateAttachmentTouchPointInput: Types.UpdateAttachmentTouchPointInput;
}>;


export type UpdateAttachmentTouchPointMutation = { __typename?: 'Mutation', updateAttachmentTouchPoint: string };



export const UpdateAttachmentTouchPointDocument = `
    mutation UpdateAttachmentTouchPoint($updateAttachmentTouchPointInput: UpdateAttachmentTouchPointInput!) {
  updateAttachmentTouchPoint(
    updateAttachmentTouchPointInput: $updateAttachmentTouchPointInput
  )
}
    `;

export const useUpdateAttachmentTouchPointMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateAttachmentTouchPointMutation, TError, UpdateAttachmentTouchPointMutationVariables, TContext>) => {
    
    return useMutation<UpdateAttachmentTouchPointMutation, TError, UpdateAttachmentTouchPointMutationVariables, TContext>(
      {
    mutationKey: ['UpdateAttachmentTouchPoint'],
    mutationFn: axiosRequest<UpdateAttachmentTouchPointMutation, UpdateAttachmentTouchPointMutationVariables>(UpdateAttachmentTouchPointDocument),
    ...options
  }
    )};

useUpdateAttachmentTouchPointMutation.getKey = () => ['UpdateAttachmentTouchPoint'];

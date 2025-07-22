import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type UpdateAttachmentCroppedAreaMutationVariables = Types.Exact<{
  updateAttachmentCroppedAreaInput: Types.UpdateAttachmentCroppedAreaInput;
}>;

export type UpdateAttachmentCroppedAreaMutation = {
  __typename?: 'Mutation';
  updateAttachmentCroppedArea: { __typename?: 'GetPresignedUrlObject'; key: string };
};

export const UpdateAttachmentCroppedAreaDocument = `
    mutation UpdateAttachmentCroppedArea($updateAttachmentCroppedAreaInput: UpdateAttachmentCroppedAreaInput!) {
  updateAttachmentCroppedArea(
    updateAttachmentCroppedAreaInput: $updateAttachmentCroppedAreaInput
  ) {
    key
  }
}
    `;

export const useUpdateAttachmentCroppedAreaMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    UpdateAttachmentCroppedAreaMutation,
    TError,
    UpdateAttachmentCroppedAreaMutationVariables,
    TContext
  >,
) => {
  return useMutation<
    UpdateAttachmentCroppedAreaMutation,
    TError,
    UpdateAttachmentCroppedAreaMutationVariables,
    TContext
  >({
    mutationKey: ['UpdateAttachmentCroppedArea'],
    mutationFn: axiosRequest<
      UpdateAttachmentCroppedAreaMutation,
      UpdateAttachmentCroppedAreaMutationVariables
    >(UpdateAttachmentCroppedAreaDocument),
    ...options,
  });
};

useUpdateAttachmentCroppedAreaMutation.getKey = () => ['UpdateAttachmentCroppedArea'];

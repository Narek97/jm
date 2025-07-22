import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type UpdateAttachmentScaleTypeMutationVariables = Types.Exact<{
  updateAttachmentScaleTypeInput: Types.UpdateAttachmentScaleTypeInput;
}>;

export type UpdateAttachmentScaleTypeMutation = {
  __typename?: 'Mutation';
  updateAttachmentScaleType: { __typename?: 'GetPresignedUrlObject'; key: string };
};

export const UpdateAttachmentScaleTypeDocument = `
    mutation UpdateAttachmentScaleType($updateAttachmentScaleTypeInput: UpdateAttachmentScaleTypeInput!) {
  updateAttachmentScaleType(
    updateAttachmentScaleTypeInput: $updateAttachmentScaleTypeInput
  ) {
    key
  }
}
    `;

export const useUpdateAttachmentScaleTypeMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    UpdateAttachmentScaleTypeMutation,
    TError,
    UpdateAttachmentScaleTypeMutationVariables,
    TContext
  >,
) => {
  return useMutation<
    UpdateAttachmentScaleTypeMutation,
    TError,
    UpdateAttachmentScaleTypeMutationVariables,
    TContext
  >({
    mutationKey: ['UpdateAttachmentScaleType'],
    mutationFn: axiosRequest<
      UpdateAttachmentScaleTypeMutation,
      UpdateAttachmentScaleTypeMutationVariables
    >(UpdateAttachmentScaleTypeDocument),
    ...options,
  });
};

useUpdateAttachmentScaleTypeMutation.getKey = () => ['UpdateAttachmentScaleType'];

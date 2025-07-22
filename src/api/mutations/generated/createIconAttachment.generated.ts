import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type CreateIconAttachmentMutationVariables = Types.Exact<{
  createIconInput: Types.CreateIconInput;
}>;

export type CreateIconAttachmentMutation = {
  __typename?: 'Mutation';
  createIconAttachment: number;
};

export const CreateIconAttachmentDocument = `
    mutation CreateIconAttachment($createIconInput: CreateIconInput!) {
  createIconAttachment(createIconInput: $createIconInput)
}
    `;

export const useCreateIconAttachmentMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    CreateIconAttachmentMutation,
    TError,
    CreateIconAttachmentMutationVariables,
    TContext
  >,
) => {
  return useMutation<
    CreateIconAttachmentMutation,
    TError,
    CreateIconAttachmentMutationVariables,
    TContext
  >({
    mutationKey: ['CreateIconAttachment'],
    mutationFn: axiosRequest<CreateIconAttachmentMutation, CreateIconAttachmentMutationVariables>(
      CreateIconAttachmentDocument,
    ),
    ...options,
  });
};

useCreateIconAttachmentMutation.getKey = () => ['CreateIconAttachment'];

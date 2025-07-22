import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type AttachTagMutationVariables = Types.Exact<{
  attachTagInput: Types.AttachTagInput;
}>;

export type AttachTagMutation = {
  __typename?: 'Mutation';
  attachTag: { __typename?: 'Tags'; id: number };
};

export const AttachTagDocument = `
    mutation AttachTag($attachTagInput: AttachTagInput!) {
  attachTag(attachTagInput: $attachTagInput) {
    id
  }
}
    `;

export const useAttachTagMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<AttachTagMutation, TError, AttachTagMutationVariables, TContext>,
) => {
  return useMutation<AttachTagMutation, TError, AttachTagMutationVariables, TContext>({
    mutationKey: ['AttachTag'],
    mutationFn: axiosRequest<AttachTagMutation, AttachTagMutationVariables>(AttachTagDocument),
    ...options,
  });
};

useAttachTagMutation.getKey = () => ['AttachTag'];

import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type UnAttachTagMutationVariables = Types.Exact<{
  unAttachTagInput: Types.UnAttachTagInput;
}>;


export type UnAttachTagMutation = { __typename?: 'Mutation', unAttachTag: { __typename?: 'Tags', id: number } };



export const UnAttachTagDocument = `
    mutation UnAttachTag($unAttachTagInput: UnAttachTagInput!) {
  unAttachTag(unAttachTagInput: $unAttachTagInput) {
    id
  }
}
    `;

export const useUnAttachTagMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UnAttachTagMutation, TError, UnAttachTagMutationVariables, TContext>) => {
    
    return useMutation<UnAttachTagMutation, TError, UnAttachTagMutationVariables, TContext>(
      {
    mutationKey: ['UnAttachTag'],
    mutationFn: axiosRequest<UnAttachTagMutation, UnAttachTagMutationVariables>(UnAttachTagDocument),
    ...options
  }
    )};

useUnAttachTagMutation.getKey = () => ['UnAttachTag'];

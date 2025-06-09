import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type UpdateItemFlippedTextMutationVariables = Types.Exact<{
  updateItemFlippedTextInput: Types.UpdateItemFlippedTextInput;
}>;


export type UpdateItemFlippedTextMutation = { __typename?: 'Mutation', updateItemFlippedText: string };



export const UpdateItemFlippedTextDocument = `
    mutation UpdateItemFlippedText($updateItemFlippedTextInput: UpdateItemFlippedTextInput!) {
  updateItemFlippedText(updateItemFlippedTextInput: $updateItemFlippedTextInput)
}
    `;

export const useUpdateItemFlippedTextMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateItemFlippedTextMutation, TError, UpdateItemFlippedTextMutationVariables, TContext>) => {
    
    return useMutation<UpdateItemFlippedTextMutation, TError, UpdateItemFlippedTextMutationVariables, TContext>(
      {
    mutationKey: ['UpdateItemFlippedText'],
    mutationFn: axiosRequest<UpdateItemFlippedTextMutation, UpdateItemFlippedTextMutationVariables>(UpdateItemFlippedTextDocument),
    ...options
  }
    )};

useUpdateItemFlippedTextMutation.getKey = () => ['UpdateItemFlippedText'];

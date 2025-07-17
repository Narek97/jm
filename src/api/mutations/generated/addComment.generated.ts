import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type AddCommentMutationVariables = Types.Exact<{
  addCommentInput: Types.AddCommentInput;
}>;


export type AddCommentMutation = { __typename?: 'Mutation', addComment: { __typename?: 'Comment', id: number, itemId: number, text: string, updatedAt: any, owner: { __typename?: 'Member', userId: number, color: string, emailAddress: string, firstName: string, lastName: string }, replies: Array<{ __typename?: 'Comment', text: string, itemId: number, id: number, updatedAt: any, owner: { __typename?: 'Member', id: number, userId: number, color: string, emailAddress: string, firstName: string, lastName: string } }> } };



export const AddCommentDocument = `
    mutation AddComment($addCommentInput: AddCommentInput!) {
  addComment(addCommentInput: $addCommentInput) {
    id
    itemId
    text
    owner {
      userId
      color
      emailAddress
      firstName
      lastName
    }
    replies {
      text
      owner {
        id
        userId
        color
        emailAddress
        firstName
        lastName
      }
      itemId
      id
      updatedAt
    }
    updatedAt
  }
}
    `;

export const useAddCommentMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<AddCommentMutation, TError, AddCommentMutationVariables, TContext>) => {
    
    return useMutation<AddCommentMutation, TError, AddCommentMutationVariables, TContext>(
      {
    mutationKey: ['AddComment'],
    mutationFn: axiosRequest<AddCommentMutation, AddCommentMutationVariables>(AddCommentDocument),
    ...options
  }
    )};

useAddCommentMutation.getKey = () => ['AddComment'];

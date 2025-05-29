import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type DeleteTouchPointMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
}>;


export type DeleteTouchPointMutation = { __typename?: 'Mutation', deleteTouchPoint: { __typename?: 'RemoveTouchpointResponseModel', rowId: number, columnId: number, index: number } };



export const DeleteTouchPointDocument = `
    mutation DeleteTouchPoint($id: Int!) {
  deleteTouchPoint(id: $id) {
    rowId
    columnId
    index
  }
}
    `;

export const useDeleteTouchPointMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DeleteTouchPointMutation, TError, DeleteTouchPointMutationVariables, TContext>) => {
    
    return useMutation<DeleteTouchPointMutation, TError, DeleteTouchPointMutationVariables, TContext>(
      {
    mutationKey: ['DeleteTouchPoint'],
    mutationFn: axiosRequest<DeleteTouchPointMutation, DeleteTouchPointMutationVariables>(DeleteTouchPointDocument),
    ...options
  }
    )};

useDeleteTouchPointMutation.getKey = () => ['DeleteTouchPoint'];

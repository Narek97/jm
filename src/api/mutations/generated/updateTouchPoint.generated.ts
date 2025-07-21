import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type UpdateTouchPointMutationVariables = Types.Exact<{
  updateTouchPointInput: Types.UpdateTouchPointInput;
}>;

export type UpdateTouchPointMutation = {
  __typename?: 'Mutation';
  updateTouchPoint: { __typename?: 'TouchPoint'; id: number; index: number };
};

export const UpdateTouchPointDocument = `
    mutation UpdateTouchPoint($updateTouchPointInput: UpdateTouchPointInput!) {
  updateTouchPoint(updateTouchPointInput: $updateTouchPointInput) {
    id
    index
  }
}
    `;

export const useUpdateTouchPointMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    UpdateTouchPointMutation,
    TError,
    UpdateTouchPointMutationVariables,
    TContext
  >,
) => {
  return useMutation<UpdateTouchPointMutation, TError, UpdateTouchPointMutationVariables, TContext>(
    {
      mutationKey: ['UpdateTouchPoint'],
      mutationFn: axiosRequest<UpdateTouchPointMutation, UpdateTouchPointMutationVariables>(
        UpdateTouchPointDocument,
      ),
      ...options,
    },
  );
};

useUpdateTouchPointMutation.getKey = () => ['UpdateTouchPoint'];

import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type RemoveBoxElementMutationVariables = Types.Exact<{
  removeBoxElementInput: Types.RemoveBoxElementInput;
}>;

export type RemoveBoxElementMutation = {
  __typename?: 'Mutation';
  removeBoxElement: {
    __typename?: 'BoxElementResponseModel';
    id: number;
    columnId: number;
    rowId: number;
    text?: string | null;
    stepId: number;
  };
};

export const RemoveBoxElementDocument = `
    mutation RemoveBoxElement($removeBoxElementInput: RemoveBoxElementInput!) {
  removeBoxElement(removeBoxElementInput: $removeBoxElementInput) {
    id
    columnId
    rowId
    text
    stepId
  }
}
    `;

export const useRemoveBoxElementMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    RemoveBoxElementMutation,
    TError,
    RemoveBoxElementMutationVariables,
    TContext
  >,
) => {
  return useMutation<RemoveBoxElementMutation, TError, RemoveBoxElementMutationVariables, TContext>(
    {
      mutationKey: ['RemoveBoxElement'],
      mutationFn: axiosRequest<RemoveBoxElementMutation, RemoveBoxElementMutationVariables>(
        RemoveBoxElementDocument,
      ),
      ...options,
    },
  );
};

useRemoveBoxElementMutation.getKey = () => ['RemoveBoxElement'];

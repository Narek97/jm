import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type AddOrUpdateColumnStepMutationVariables = Types.Exact<{
  addOrUpdateColumnStepInput: Types.AddOrUpdateColumnStepInput;
}>;

export type AddOrUpdateColumnStepMutation = {
  __typename?: 'Mutation';
  addOrUpdateColumnStep: {
    __typename?: 'CreateUpdateStepModel';
    columnStep: {
      __typename?: 'ColumnStep';
      id: number;
      columnId: number;
      index: number;
    };
    createdColumnStep?: {
      __typename?: 'ColumnStep';
      id: number;
      columnId: number;
      index: number;
    } | null;
  };
};

export const AddOrUpdateColumnStepDocument = `
    mutation AddOrUpdateColumnStep($addOrUpdateColumnStepInput: AddOrUpdateColumnStepInput!) {
  addOrUpdateColumnStep(addOrUpdateColumnStepInput: $addOrUpdateColumnStepInput) {
    columnStep {
      id
      columnId
      index
    }
    createdColumnStep {
      id
      columnId
      index
    }
  }
}
    `;

export const useAddOrUpdateColumnStepMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    AddOrUpdateColumnStepMutation,
    TError,
    AddOrUpdateColumnStepMutationVariables,
    TContext
  >,
) => {
  return useMutation<
    AddOrUpdateColumnStepMutation,
    TError,
    AddOrUpdateColumnStepMutationVariables,
    TContext
  >({
    mutationKey: ['AddOrUpdateColumnStep'],
    mutationFn: axiosRequest<AddOrUpdateColumnStepMutation, AddOrUpdateColumnStepMutationVariables>(
      AddOrUpdateColumnStepDocument,
    ),
    ...options,
  });
};

useAddOrUpdateColumnStepMutation.getKey = () => ['AddOrUpdateColumnStep'];

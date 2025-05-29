import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type DeleteColumnStepMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
}>;

export type DeleteColumnStepMutation = {
  __typename?: 'Mutation';
  removeColumnStep: number;
};

export const DeleteColumnStepDocument = `
    mutation DeleteColumnStep($id: Int!) {
  removeColumnStep(id: $id)
}
    `;

export const useDeleteColumnStepMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    DeleteColumnStepMutation,
    TError,
    DeleteColumnStepMutationVariables,
    TContext
  >,
) => {
  return useMutation<DeleteColumnStepMutation, TError, DeleteColumnStepMutationVariables, TContext>(
    {
      mutationKey: ['DeleteColumnStep'],
      mutationFn: axiosRequest<DeleteColumnStepMutation, DeleteColumnStepMutationVariables>(
        DeleteColumnStepDocument,
      ),
      ...options,
    },
  );
};

useDeleteColumnStepMutation.getKey = () => ['DeleteColumnStep'];

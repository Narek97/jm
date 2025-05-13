import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type RetrieveColumnStepMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
}>;


export type RetrieveColumnStepMutation = { __typename?: 'Mutation', retrieveColumnStep: { __typename?: 'ColumnStep', id: number } };



export const RetrieveColumnStepDocument = `
    mutation RetrieveColumnStep($id: Int!) {
  retrieveColumnStep(id: $id) {
    id
  }
}
    `;

export const useRetrieveColumnStepMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<RetrieveColumnStepMutation, TError, RetrieveColumnStepMutationVariables, TContext>) => {
    
    return useMutation<RetrieveColumnStepMutation, TError, RetrieveColumnStepMutationVariables, TContext>(
      {
    mutationKey: ['RetrieveColumnStep'],
    mutationFn: axiosRequest<RetrieveColumnStepMutation, RetrieveColumnStepMutationVariables>(RetrieveColumnStepDocument),
    ...options
  }
    )};

useRetrieveColumnStepMutation.getKey = () => ['RetrieveColumnStep'];

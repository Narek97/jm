import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type DeleteAiJourneyModelMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
}>;


export type DeleteAiJourneyModelMutation = { __typename?: 'Mutation', deleteAiJourneyModel: number };



export const DeleteAiJourneyModelDocument = `
    mutation DeleteAiJourneyModel($id: Int!) {
  deleteAiJourneyModel(id: $id)
}
    `;

export const useDeleteAiJourneyModelMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DeleteAiJourneyModelMutation, TError, DeleteAiJourneyModelMutationVariables, TContext>) => {
    
    return useMutation<DeleteAiJourneyModelMutation, TError, DeleteAiJourneyModelMutationVariables, TContext>(
      {
    mutationKey: ['DeleteAiJourneyModel'],
    mutationFn: axiosRequest<DeleteAiJourneyModelMutation, DeleteAiJourneyModelMutationVariables>(DeleteAiJourneyModelDocument),
    ...options
  }
    )};

useDeleteAiJourneyModelMutation.getKey = () => ['DeleteAiJourneyModel'];

import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type DeleteAllDemographicInfoFieldsMutationVariables = Types.Exact<{
  personaId: Types.Scalars['Int']['input'];
}>;


export type DeleteAllDemographicInfoFieldsMutation = { __typename?: 'Mutation', deleteAllDemographicInfoFields: number };



export const DeleteAllDemographicInfoFieldsDocument = `
    mutation DeleteAllDemographicInfoFields($personaId: Int!) {
  deleteAllDemographicInfoFields(personaId: $personaId)
}
    `;

export const useDeleteAllDemographicInfoFieldsMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DeleteAllDemographicInfoFieldsMutation, TError, DeleteAllDemographicInfoFieldsMutationVariables, TContext>) => {
    
    return useMutation<DeleteAllDemographicInfoFieldsMutation, TError, DeleteAllDemographicInfoFieldsMutationVariables, TContext>(
      {
    mutationKey: ['DeleteAllDemographicInfoFields'],
    mutationFn: axiosRequest<DeleteAllDemographicInfoFieldsMutation, DeleteAllDemographicInfoFieldsMutationVariables>(DeleteAllDemographicInfoFieldsDocument),
    ...options
  }
    )};

useDeleteAllDemographicInfoFieldsMutation.getKey = () => ['DeleteAllDemographicInfoFields'];

import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type DeleteDemographicInfoMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
}>;


export type DeleteDemographicInfoMutation = { __typename?: 'Mutation', deleteDemographicInfo: number };



export const DeleteDemographicInfoDocument = `
    mutation DeleteDemographicInfo($id: Int!) {
  deleteDemographicInfo(id: $id)
}
    `;

export const useDeleteDemographicInfoMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DeleteDemographicInfoMutation, TError, DeleteDemographicInfoMutationVariables, TContext>) => {
    
    return useMutation<DeleteDemographicInfoMutation, TError, DeleteDemographicInfoMutationVariables, TContext>(
      {
    mutationKey: ['DeleteDemographicInfo'],
    mutationFn: axiosRequest<DeleteDemographicInfoMutation, DeleteDemographicInfoMutationVariables>(DeleteDemographicInfoDocument),
    ...options
  }
    )};

useDeleteDemographicInfoMutation.getKey = () => ['DeleteDemographicInfo'];

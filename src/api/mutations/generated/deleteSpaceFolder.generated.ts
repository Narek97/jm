import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type DeleteFolderMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
}>;


export type DeleteFolderMutation = { __typename?: 'Mutation', deleteFolder: boolean };



export const DeleteFolderDocument = `
    mutation DeleteFolder($id: Int!) {
  deleteFolder(id: $id)
}
    `;

export const useDeleteFolderMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DeleteFolderMutation, TError, DeleteFolderMutationVariables, TContext>) => {
    
    return useMutation<DeleteFolderMutation, TError, DeleteFolderMutationVariables, TContext>(
      {
    mutationKey: ['DeleteFolder'],
    mutationFn: axiosRequest<DeleteFolderMutation, DeleteFolderMutationVariables>(DeleteFolderDocument),
    ...options
  }
    )};

useDeleteFolderMutation.getKey = () => ['DeleteFolder'];

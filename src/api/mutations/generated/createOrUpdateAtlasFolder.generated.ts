import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type CreateOrUpdateFolderMutationVariables = Types.Exact<{
  folderInput: Types.FolderInput;
}>;


export type CreateOrUpdateFolderMutation = { __typename?: 'Mutation', createOrUpdateFolder: { __typename?: 'Folder', id: number, name: string, workspaceId: number, whiteboardCount: number } };



export const CreateOrUpdateFolderDocument = `
    mutation CreateOrUpdateFolder($folderInput: FolderInput!) {
  createOrUpdateFolder(folderInput: $folderInput) {
    id
    name
    workspaceId
    whiteboardCount
  }
}
    `;

export const useCreateOrUpdateFolderMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateOrUpdateFolderMutation, TError, CreateOrUpdateFolderMutationVariables, TContext>) => {
    
    return useMutation<CreateOrUpdateFolderMutation, TError, CreateOrUpdateFolderMutationVariables, TContext>(
      {
    mutationKey: ['CreateOrUpdateFolder'],
    mutationFn: axiosRequest<CreateOrUpdateFolderMutation, CreateOrUpdateFolderMutationVariables>(CreateOrUpdateFolderDocument),
    ...options
  }
    )};

useCreateOrUpdateFolderMutation.getKey = () => ['CreateOrUpdateFolder'];

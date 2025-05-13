import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type CreateWhiteboardMutationVariables = Types.Exact<{
  createWhiteboardInput: Types.CreateWhiteboardInput;
}>;


export type CreateWhiteboardMutation = { __typename?: 'Mutation', createWhiteboard: { __typename?: 'Whiteboard', id: number, name: string, ownerId: number, canvasId?: number | null, isLocked: boolean, sharingPolicy: Types.SharingPolicyEnum, type: Types.WhiteboardTypeEnum, helpLink?: string | null, folderId: number } };



export const CreateWhiteboardDocument = `
    mutation CreateWhiteboard($createWhiteboardInput: CreateWhiteboardInput!) {
  createWhiteboard(createWhiteboardInput: $createWhiteboardInput) {
    id
    name
    ownerId
    canvasId
    isLocked
    sharingPolicy
    type
    helpLink
    folderId
  }
}
    `;

export const useCreateWhiteboardMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateWhiteboardMutation, TError, CreateWhiteboardMutationVariables, TContext>) => {
    
    return useMutation<CreateWhiteboardMutation, TError, CreateWhiteboardMutationVariables, TContext>(
      {
    mutationKey: ['CreateWhiteboard'],
    mutationFn: axiosRequest<CreateWhiteboardMutation, CreateWhiteboardMutationVariables>(CreateWhiteboardDocument),
    ...options
  }
    )};

useCreateWhiteboardMutation.getKey = () => ['CreateWhiteboard'];

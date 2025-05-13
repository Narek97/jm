import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type CreateBoardMutationVariables = Types.Exact<{
  createBoardInput: Types.CreateBoardInput;
}>;


export type CreateBoardMutation = { __typename?: 'Mutation', createBoard: { __typename?: 'Board', id: number, name: string, defaultMapId?: number | null, createdAt: any, updatedAt: any } };



export const CreateBoardDocument = `
    mutation CreateBoard($createBoardInput: CreateBoardInput!) {
  createBoard(createBoardInput: $createBoardInput) {
    id
    name
    defaultMapId
    createdAt
    updatedAt
  }
}
    `;

export const useCreateBoardMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateBoardMutation, TError, CreateBoardMutationVariables, TContext>) => {
    
    return useMutation<CreateBoardMutation, TError, CreateBoardMutationVariables, TContext>(
      {
    mutationKey: ['CreateBoard'],
    mutationFn: axiosRequest<CreateBoardMutation, CreateBoardMutationVariables>(CreateBoardDocument),
    ...options
  }
    )};

useCreateBoardMutation.getKey = () => ['CreateBoard'];

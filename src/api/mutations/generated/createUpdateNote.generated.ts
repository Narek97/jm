import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type CreateOrUpdateNoteMutationVariables = Types.Exact<{
  createOrUpdateNoteInput: Types.CreateOrUpdateNoteInput;
}>;

export type CreateOrUpdateNoteMutation = {
  __typename?: 'Mutation';
  createOrUpdateNote: {
    __typename?: 'Note';
    id: number;
    itemId: number;
    updatedAt: any;
    text: string;
    owner: {
      __typename?: 'Member';
      color: string;
      firstName: string;
      lastName: string;
      emailAddress: string;
    };
  };
};

export const CreateOrUpdateNoteDocument = `
    mutation CreateOrUpdateNote($createOrUpdateNoteInput: CreateOrUpdateNoteInput!) {
  createOrUpdateNote(createOrUpdateNoteInput: $createOrUpdateNoteInput) {
    id
    itemId
    updatedAt
    text
    owner {
      color
      firstName
      lastName
      emailAddress
    }
  }
}
    `;

export const useCreateOrUpdateNoteMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    CreateOrUpdateNoteMutation,
    TError,
    CreateOrUpdateNoteMutationVariables,
    TContext
  >,
) => {
  return useMutation<
    CreateOrUpdateNoteMutation,
    TError,
    CreateOrUpdateNoteMutationVariables,
    TContext
  >({
    mutationKey: ['CreateOrUpdateNote'],
    mutationFn: axiosRequest<CreateOrUpdateNoteMutation, CreateOrUpdateNoteMutationVariables>(
      CreateOrUpdateNoteDocument,
    ),
    ...options,
  });
};

useCreateOrUpdateNoteMutation.getKey = () => ['CreateOrUpdateNote'];

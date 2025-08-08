import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type CreateUpdateOutcomeMutationVariables = Types.Exact<{
  createUpdateOutcomeInput: Types.CreateUpdateOutcomeInput;
}>;

export type CreateUpdateOutcomeMutation = {
  __typename?: 'Mutation';
  createUpdateOutcome: {
    __typename?: 'Outcome';
    id: number;
    title: string;
    description?: string | null;
    createdAt: any;
    status: Types.OutcomeStatusEnum;
    rowId?: number | null;
    columnId?: number | null;
    stepId?: number | null;
    personaId?: number | null;
    commentsCount: number;
    flippedText?: string | null;
    outcomeGroupId: number;
    icon?: string | null;
    column?: { __typename?: 'MapColumn'; label?: string | null } | null;
    map?: { __typename?: 'Map'; id: number; title?: string | null } | null;
    user?: { __typename?: 'Member'; firstName: string; lastName: string } | null;
    persona?: {
      __typename?: 'personas';
      id: number;
      name: string;
      type: string;
      attachment?: { __typename?: 'Attachment'; url: string; key: string } | null;
    } | null;
  };
};

export const CreateUpdateOutcomeDocument = `
    mutation CreateUpdateOutcome($createUpdateOutcomeInput: CreateUpdateOutcomeInput!) {
  createUpdateOutcome(createUpdateOutcomeInput: $createUpdateOutcomeInput) {
    id
    title
    description
    createdAt
    status
    rowId
    columnId
    stepId
    personaId
    commentsCount
    flippedText
    outcomeGroupId
    icon
    column {
      label
    }
    map {
      id
      title
    }
    user {
      firstName
      lastName
    }
    persona {
      id
      name
      type
      attachment {
        url
        key
      }
    }
  }
}
    `;

export const useCreateUpdateOutcomeMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    CreateUpdateOutcomeMutation,
    TError,
    CreateUpdateOutcomeMutationVariables,
    TContext
  >,
) => {
  return useMutation<
    CreateUpdateOutcomeMutation,
    TError,
    CreateUpdateOutcomeMutationVariables,
    TContext
  >({
    mutationKey: ['CreateUpdateOutcome'],
    mutationFn: axiosRequest<CreateUpdateOutcomeMutation, CreateUpdateOutcomeMutationVariables>(
      CreateUpdateOutcomeDocument,
    ),
    ...options,
  });
};

useCreateUpdateOutcomeMutation.getKey = () => ['CreateUpdateOutcome'];

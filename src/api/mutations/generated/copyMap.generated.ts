import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type CopyMapMutationVariables = Types.Exact<{
  copyMapInput: Types.CopyMapInput;
}>;

export type CopyMapMutation = {
  __typename?: 'Mutation';
  copyMap: {
    __typename?: 'Map';
    title?: string | null;
    id: number;
    type: Types.MapTypeEnum;
    createdAt: any;
    updatedAt: any;
    boardId: number;
    owner: { __typename?: 'Member'; firstName: string; lastName: string; emailAddress: string };
  };
};

export const CopyMapDocument = `
    mutation CopyMap($copyMapInput: CopyMapInput!) {
  copyMap(copyMapInput: $copyMapInput) {
    title
    id
    type
    createdAt
    updatedAt
    boardId
    owner {
      firstName
      lastName
      emailAddress
    }
  }
}
    `;

export const useCopyMapMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<CopyMapMutation, TError, CopyMapMutationVariables, TContext>,
) => {
  return useMutation<CopyMapMutation, TError, CopyMapMutationVariables, TContext>({
    mutationKey: ['CopyMap'],
    mutationFn: axiosRequest<CopyMapMutation, CopyMapMutationVariables>(CopyMapDocument),
    ...options,
  });
};

useCopyMapMutation.getKey = () => ['CopyMap'];

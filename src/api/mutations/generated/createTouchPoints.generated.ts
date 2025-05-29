import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type CreateTouchPointsMutationVariables = Types.Exact<{
  createTouchPointInput: Types.CreateTouchPointInput;
}>;

export type CreateTouchPointsMutation = {
  __typename?: 'Mutation';
  createTouchPoints: {
    __typename?: 'CreateTouchpointResponseModel';
    deletedAttachments: Array<number>;
    createdTouchpoints: Array<{
      __typename?: 'TouchPoint';
      id: number;
      iconUrl: string;
      title?: string | null;
      boxId?: number | null;
      rowId: number;
      columnId: number;
      bgColor?: string | null;
      commentsCount: number;
      flippedText?: string | null;
      persona?: { __typename?: 'personas'; id: number } | null;
    }>;
  };
};

export const CreateTouchPointsDocument = `
    mutation CreateTouchPoints($createTouchPointInput: CreateTouchPointInput!) {
  createTouchPoints(createTouchPointInput: $createTouchPointInput) {
    deletedAttachments
    createdTouchpoints {
      id
      iconUrl
      title
      boxId
      rowId
      columnId
      bgColor
      commentsCount
      flippedText
      persona {
        id
      }
    }
  }
}
    `;

export const useCreateTouchPointsMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    CreateTouchPointsMutation,
    TError,
    CreateTouchPointsMutationVariables,
    TContext
  >,
) => {
  return useMutation<
    CreateTouchPointsMutation,
    TError,
    CreateTouchPointsMutationVariables,
    TContext
  >({
    mutationKey: ['CreateTouchPoints'],
    mutationFn: axiosRequest<CreateTouchPointsMutation, CreateTouchPointsMutationVariables>(
      CreateTouchPointsDocument,
    ),
    ...options,
  });
};

useCreateTouchPointsMutation.getKey = () => ['CreateTouchPoints'];

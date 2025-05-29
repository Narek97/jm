import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type UpdateLinkBgColorMutationVariables = Types.Exact<{
  updateLinkBGColor: Types.UpdateLinkBgColor;
}>;

export type UpdateLinkBgColorMutation = {
  __typename?: 'Mutation';
  updateLinkBGColor: { __typename?: 'LinkResponse'; id: number; bgColor?: string | null };
};

export const UpdateLinkBgColorDocument = `
    mutation UpdateLinkBGColor($updateLinkBGColor: UpdateLinkBGColor!) {
  updateLinkBGColor(updateLinkBGColor: $updateLinkBGColor) {
    id
    bgColor
  }
}
    `;

export const useUpdateLinkBgColorMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    UpdateLinkBgColorMutation,
    TError,
    UpdateLinkBgColorMutationVariables,
    TContext
  >,
) => {
  return useMutation<
    UpdateLinkBgColorMutation,
    TError,
    UpdateLinkBgColorMutationVariables,
    TContext
  >({
    mutationKey: ['UpdateLinkBGColor'],
    mutationFn: axiosRequest<UpdateLinkBgColorMutation, UpdateLinkBgColorMutationVariables>(
      UpdateLinkBgColorDocument,
    ),
    ...options,
  });
};

useUpdateLinkBgColorMutation.getKey = () => ['UpdateLinkBGColor'];

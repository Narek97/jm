import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type DeleteTagMutationVariables = Types.Exact<{
  id: Types.Scalars['Int']['input'];
}>;

export type DeleteTagMutation = { __typename?: 'Mutation'; deleteTag: number };

export const DeleteTagDocument = `
    mutation DeleteTag($id: Int!) {
  deleteTag(id: $id)
}
    `;

export const useDeleteTagMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<DeleteTagMutation, TError, DeleteTagMutationVariables, TContext>,
) => {
  return useMutation<DeleteTagMutation, TError, DeleteTagMutationVariables, TContext>({
    mutationKey: ['DeleteTag'],
    mutationFn: axiosRequest<DeleteTagMutation, DeleteTagMutationVariables>(DeleteTagDocument),
    ...options,
  });
};

useDeleteTagMutation.getKey = () => ['DeleteTag'];

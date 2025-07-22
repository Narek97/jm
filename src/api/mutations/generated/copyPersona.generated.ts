import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type CopyPersonaMutationVariables = Types.Exact<{
  copyPersonaInput: Types.CopyPersonaInput;
}>;

export type CopyPersonaMutation = { __typename?: 'Mutation'; copyPersona: number };

export const CopyPersonaDocument = `
    mutation CopyPersona($copyPersonaInput: CopyPersonaInput!) {
  copyPersona(copyPersonaInput: $copyPersonaInput)
}
    `;

export const useCopyPersonaMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<CopyPersonaMutation, TError, CopyPersonaMutationVariables, TContext>,
) => {
  return useMutation<CopyPersonaMutation, TError, CopyPersonaMutationVariables, TContext>({
    mutationKey: ['CopyPersona'],
    mutationFn: axiosRequest<CopyPersonaMutation, CopyPersonaMutationVariables>(
      CopyPersonaDocument,
    ),
    ...options,
  });
};

useCopyPersonaMutation.getKey = () => ['CopyPersona'];

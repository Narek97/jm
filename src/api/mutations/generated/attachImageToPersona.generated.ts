import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type AttachImageToPersonaMutationVariables = Types.Exact<{
  attachImageInput: Types.AttachImageInput;
}>;


export type AttachImageToPersonaMutation = { __typename?: 'Mutation', attachImageToPersona: string };



export const AttachImageToPersonaDocument = `
    mutation AttachImageToPersona($attachImageInput: AttachImageInput!) {
  attachImageToPersona(attachImageInput: $attachImageInput)
}
    `;

export const useAttachImageToPersonaMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<AttachImageToPersonaMutation, TError, AttachImageToPersonaMutationVariables, TContext>) => {
    
    return useMutation<AttachImageToPersonaMutation, TError, AttachImageToPersonaMutationVariables, TContext>(
      {
    mutationKey: ['AttachImageToPersona'],
    mutationFn: axiosRequest<AttachImageToPersonaMutation, AttachImageToPersonaMutationVariables>(AttachImageToPersonaDocument),
    ...options
  }
    )};

useAttachImageToPersonaMutation.getKey = () => ['AttachImageToPersona'];

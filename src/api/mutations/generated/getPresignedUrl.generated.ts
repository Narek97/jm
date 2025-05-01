import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type GetPreSignedUrlMutationVariables = Types.Exact<{
  getPreSignedUrlInput: Types.GetPreSignedUrlInput;
}>;


export type GetPreSignedUrlMutation = { __typename?: 'Mutation', getPreSignedUrl: { __typename?: 'GetPresignedUrlObject', key: string } };



export const GetPreSignedUrlDocument = `
    mutation GetPreSignedUrl($getPreSignedUrlInput: GetPreSignedUrlInput!) {
  getPreSignedUrl(getPreSignedUrlInput: $getPreSignedUrlInput) {
    key
  }
}
    `;

export const useGetPreSignedUrlMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<GetPreSignedUrlMutation, TError, GetPreSignedUrlMutationVariables, TContext>) => {
    
    return useMutation<GetPreSignedUrlMutation, TError, GetPreSignedUrlMutationVariables, TContext>(
      {
    mutationKey: ['GetPreSignedUrl'],
    mutationFn: axiosRequest<GetPreSignedUrlMutation, GetPreSignedUrlMutationVariables>(GetPreSignedUrlDocument),
    ...options
  }
    )};

useGetPreSignedUrlMutation.getKey = () => ['GetPreSignedUrl'];

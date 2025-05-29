import * as Types from '../../types';

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { axiosRequest } from '../../axios';
export type CreateMultipartMutationVariables = Types.Exact<{
  createMultipartInput: Types.CreateMultipartInput;
}>;


export type CreateMultipartMutation = { __typename?: 'Mutation', createMultipart: { __typename?: 'MultipartUploadResponse', key: string, createMultipartData: { __typename?: 'GetMultipartObject', ServerSideEncryption: string, Bucket: string, Key: string, UploadId: string } } };



export const CreateMultipartDocument = `
    mutation CreateMultipart($createMultipartInput: CreateMultipartInput!) {
  createMultipart(createMultipartInput: $createMultipartInput) {
    createMultipartData {
      ServerSideEncryption
      Bucket
      Key
      UploadId
    }
    key
  }
}
    `;

export const useCreateMultipartMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateMultipartMutation, TError, CreateMultipartMutationVariables, TContext>) => {
    
    return useMutation<CreateMultipartMutation, TError, CreateMultipartMutationVariables, TContext>(
      {
    mutationKey: ['CreateMultipart'],
    mutationFn: axiosRequest<CreateMultipartMutation, CreateMultipartMutationVariables>(CreateMultipartDocument),
    ...options
  }
    )};

useCreateMultipartMutation.getKey = () => ['CreateMultipart'];

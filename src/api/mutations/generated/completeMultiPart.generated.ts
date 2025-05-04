import * as Types from "../../types";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { axiosRequest } from "../../axios";
export type CompleteMultiPartMutationVariables = Types.Exact<{
  completeMultiPartInput: Types.CompleteMultiPartInput;
}>;

export type CompleteMultiPartMutation = {
  __typename?: "Mutation";
  completeMultiPart: {
    __typename?: "GetCompleteMultipartResponse";
    id: number;
    key: string;
    name?: string | null;
  };
};

export const CompleteMultiPartDocument = `
    mutation CompleteMultiPart($completeMultiPartInput: CompleteMultiPartInput!) {
  completeMultiPart(completeMultiPartInput: $completeMultiPartInput) {
    id
    key
    name
  }
}
    `;

export const useCompleteMultiPartMutation = <
  TError = unknown,
  TContext = unknown,
>(
  options?: UseMutationOptions<
    CompleteMultiPartMutation,
    TError,
    CompleteMultiPartMutationVariables,
    TContext
  >,
) => {
  return useMutation<
    CompleteMultiPartMutation,
    TError,
    CompleteMultiPartMutationVariables,
    TContext
  >({
    mutationKey: ["CompleteMultiPart"],
    mutationFn: axiosRequest<
      CompleteMultiPartMutation,
      CompleteMultiPartMutationVariables
    >(CompleteMultiPartDocument),
    ...options,
  });
};

useCompleteMultiPartMutation.getKey = () => ["CompleteMultiPart"];

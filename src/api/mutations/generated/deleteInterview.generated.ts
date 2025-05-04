import * as Types from "../../types";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { axiosRequest } from "../../axios";
export type DeleteInterviewMutationVariables = Types.Exact<{
  id: Types.Scalars["Int"]["input"];
}>;

export type DeleteInterviewMutation = {
  __typename?: "Mutation";
  deleteInterview: number;
};

export const DeleteInterviewDocument = `
    mutation DeleteInterview($id: Int!) {
  deleteInterview(id: $id)
}
    `;

export const useDeleteInterviewMutation = <
  TError = unknown,
  TContext = unknown,
>(
  options?: UseMutationOptions<
    DeleteInterviewMutation,
    TError,
    DeleteInterviewMutationVariables,
    TContext
  >,
) => {
  return useMutation<
    DeleteInterviewMutation,
    TError,
    DeleteInterviewMutationVariables,
    TContext
  >({
    mutationKey: ["DeleteInterview"],
    mutationFn: axiosRequest<
      DeleteInterviewMutation,
      DeleteInterviewMutationVariables
    >(DeleteInterviewDocument),
    ...options,
  });
};

useDeleteInterviewMutation.getKey = () => ["DeleteInterview"];

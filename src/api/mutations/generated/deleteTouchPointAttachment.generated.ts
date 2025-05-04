import * as Types from "../../types";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { axiosRequest } from "../../axios";
export type DeleteTouchPointAttachmentMutationVariables = Types.Exact<{
  deleteTouchPointAttachmentTypeInput: Types.DeleteTouchPointAttachmentTypeInput;
}>;

export type DeleteTouchPointAttachmentMutation = {
  __typename?: "Mutation";
  deleteTouchPointAttachment: number;
};

export const DeleteTouchPointAttachmentDocument = `
    mutation DeleteTouchPointAttachment($deleteTouchPointAttachmentTypeInput: DeleteTouchPointAttachmentTypeInput!) {
  deleteTouchPointAttachment(
    deleteTouchPointAttachmentTypeInput: $deleteTouchPointAttachmentTypeInput
  )
}
    `;

export const useDeleteTouchPointAttachmentMutation = <
  TError = unknown,
  TContext = unknown,
>(
  options?: UseMutationOptions<
    DeleteTouchPointAttachmentMutation,
    TError,
    DeleteTouchPointAttachmentMutationVariables,
    TContext
  >,
) => {
  return useMutation<
    DeleteTouchPointAttachmentMutation,
    TError,
    DeleteTouchPointAttachmentMutationVariables,
    TContext
  >({
    mutationKey: ["DeleteTouchPointAttachment"],
    mutationFn: axiosRequest<
      DeleteTouchPointAttachmentMutation,
      DeleteTouchPointAttachmentMutationVariables
    >(DeleteTouchPointAttachmentDocument),
    ...options,
  });
};

useDeleteTouchPointAttachmentMutation.getKey = () => [
  "DeleteTouchPointAttachment",
];

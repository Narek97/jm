import * as Types from "../../types";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { axiosRequest } from "../../axios";
export type DeletePersonaMutationVariables = Types.Exact<{
  id: Types.Scalars["Int"]["input"];
}>;

export type DeletePersonaMutation = {
  __typename?: "Mutation";
  deletePersona: number;
};

export const DeletePersonaDocument = `
    mutation DeletePersona($id: Int!) {
  deletePersona(id: $id)
}
    `;

export const useDeletePersonaMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    DeletePersonaMutation,
    TError,
    DeletePersonaMutationVariables,
    TContext
  >,
) => {
  return useMutation<
    DeletePersonaMutation,
    TError,
    DeletePersonaMutationVariables,
    TContext
  >({
    mutationKey: ["DeletePersona"],
    mutationFn: axiosRequest<
      DeletePersonaMutation,
      DeletePersonaMutationVariables
    >(DeletePersonaDocument),
    ...options,
  });
};

useDeletePersonaMutation.getKey = () => ["DeletePersona"];

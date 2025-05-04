import * as Types from "../../types";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { axiosRequest } from "../../axios";
export type CreatePersonaMutationVariables = Types.Exact<{
  createPersonaInput: Types.CreatePersonaInput;
}>;

export type CreatePersonaMutation = {
  __typename?: "Mutation";
  createPersona: { __typename?: "personas"; id: number };
};

export const CreatePersonaDocument = `
    mutation CreatePersona($createPersonaInput: CreatePersonaInput!) {
  createPersona(createPersonaInput: $createPersonaInput) {
    id
  }
}
    `;

export const useCreatePersonaMutation = <TError = unknown, TContext = unknown>(
  options?: UseMutationOptions<
    CreatePersonaMutation,
    TError,
    CreatePersonaMutationVariables,
    TContext
  >,
) => {
  return useMutation<
    CreatePersonaMutation,
    TError,
    CreatePersonaMutationVariables,
    TContext
  >({
    mutationKey: ["CreatePersona"],
    mutationFn: axiosRequest<
      CreatePersonaMutation,
      CreatePersonaMutationVariables
    >(CreatePersonaDocument),
    ...options,
  });
};

useCreatePersonaMutation.getKey = () => ["CreatePersona"];

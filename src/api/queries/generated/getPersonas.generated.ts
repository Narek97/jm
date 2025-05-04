import * as Types from "../../types";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { axiosRequest } from "../../axios";
export type GetPersonasQueryVariables = Types.Exact<{
  getPersonasInput: Types.GetPersonasInput;
}>;

export type GetPersonasQuery = {
  __typename?: "Query";
  getPersonas: {
    __typename?: "GetPersonasModel";
    count?: number | null;
    workspace?: {
      __typename?: "PartialWorkspace";
      id: number;
      name: string;
    } | null;
    personaGroup?: {
      __typename?: "PartialPersonaGroup";
      id: number;
      name: string;
    } | null;
    personas: Array<{
      __typename?: "personas";
      id: number;
      name: string;
      color?: string | null;
      type: string;
      journeys: number;
      croppedArea?: {
        __typename?: "Position";
        width?: number | null;
        height?: number | null;
        x?: number | null;
        y?: number | null;
      } | null;
      attachment?: {
        __typename?: "Attachment";
        id: number;
        url: string;
        key: string;
        hasResizedVersions?: boolean | null;
        croppedArea?: {
          __typename?: "Position";
          width?: number | null;
          height?: number | null;
          x?: number | null;
          y?: number | null;
        } | null;
      } | null;
    }>;
  };
};

export const GetPersonasDocument = `
    query GetPersonas($getPersonasInput: GetPersonasInput!) {
  getPersonas(getPersonasInput: $getPersonasInput) {
    count
    workspace {
      id
      name
    }
    personaGroup {
      id
      name
    }
    personas {
      id
      name
      color
      type
      journeys
      croppedArea {
        width
        height
        x
        y
      }
      attachment {
        id
        url
        key
        hasResizedVersions
        croppedArea {
          width
          height
          x
          y
        }
      }
    }
  }
}
    `;

export const useGetPersonasQuery = <TData = GetPersonasQuery, TError = unknown>(
  variables: GetPersonasQueryVariables,
  options?: Omit<
    UseQueryOptions<GetPersonasQuery, TError, TData>,
    "queryKey"
  > & {
    queryKey?: UseQueryOptions<GetPersonasQuery, TError, TData>["queryKey"];
  },
) => {
  return useQuery<GetPersonasQuery, TError, TData>({
    queryKey: ["GetPersonas", variables],
    queryFn: axiosRequest<GetPersonasQuery, GetPersonasQueryVariables>(
      GetPersonasDocument,
    ).bind(null, variables),
    ...options,
  });
};

useGetPersonasQuery.getKey = (variables: GetPersonasQueryVariables) => [
  "GetPersonas",
  variables,
];

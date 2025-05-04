import * as Types from "../../types";

import {
  useQuery,
  useInfiniteQuery,
  UseQueryOptions,
  UseInfiniteQueryOptions,
  InfiniteData,
} from "@tanstack/react-query";
import { axiosRequest } from "../../axios";
export type GetPersonasInfiniteQueryVariables = Types.Exact<{
  getPersonasInput: Types.GetPersonasInput;
}>;

export type GetPersonasInfiniteQuery = {
  __typename?: "Query";
  getPersonas: {
    __typename?: "GetPersonasModel";
    count?: number | null;
    personas: Array<{
      __typename?: "personas";
      id: number;
      type: string;
      name: string;
      color?: string | null;
      isSelected: boolean;
      journeys: number;
      personaGroupId: number;
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

export const GetPersonasInfiniteDocument = `
    query GetPersonasInfinite($getPersonasInput: GetPersonasInput!) {
  getPersonas(getPersonasInput: $getPersonasInput) {
    count
    personas {
      id
      type
      name
      color
      isSelected
      journeys
      personaGroupId
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

export const useGetPersonasInfiniteQuery = <
  TData = GetPersonasInfiniteQuery,
  TError = unknown,
>(
  variables: GetPersonasInfiniteQueryVariables,
  options?: Omit<
    UseQueryOptions<GetPersonasInfiniteQuery, TError, TData>,
    "queryKey"
  > & {
    queryKey?: UseQueryOptions<
      GetPersonasInfiniteQuery,
      TError,
      TData
    >["queryKey"];
  },
) => {
  return useQuery<GetPersonasInfiniteQuery, TError, TData>({
    queryKey: ["GetPersonasInfinite", variables],
    queryFn: axiosRequest<
      GetPersonasInfiniteQuery,
      GetPersonasInfiniteQueryVariables
    >(GetPersonasInfiniteDocument).bind(null, variables),
    ...options,
  });
};

useGetPersonasInfiniteQuery.getKey = (
  variables: GetPersonasInfiniteQueryVariables,
) => ["GetPersonasInfinite", variables];

export const useInfiniteGetPersonasInfiniteQuery = <
  TData = InfiniteData<GetPersonasInfiniteQuery>,
  TError = unknown,
>(
  variables: GetPersonasInfiniteQueryVariables,
  options: Omit<
    UseInfiniteQueryOptions<GetPersonasInfiniteQuery, TError, TData>,
    "queryKey"
  > & {
    queryKey?: UseInfiniteQueryOptions<
      GetPersonasInfiniteQuery,
      TError,
      TData
    >["queryKey"];
  },
) => {
  const query = axiosRequest<
    GetPersonasInfiniteQuery,
    GetPersonasInfiniteQueryVariables
  >(GetPersonasInfiniteDocument);
  return useInfiniteQuery<GetPersonasInfiniteQuery, TError, TData>(
    (() => {
      const { queryKey: optionsQueryKey, ...restOptions } = options;
      return {
        queryKey: optionsQueryKey ?? [
          "GetPersonasInfinite.infinite",
          variables,
        ],
        queryFn: (metaData) =>
          query({ ...variables, ...(metaData.pageParam ?? {}) }),
        ...restOptions,
      };
    })(),
  );
};

useInfiniteGetPersonasInfiniteQuery.getKey = (
  variables: GetPersonasInfiniteQueryVariables,
) => ["GetPersonasInfinite.infinite", variables];

import * as Types from "../../types";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { axiosRequest } from "../../axios";
export type GetTouchPointIconsQueryVariables = Types.Exact<{
  getTouchpointIconsInput: Types.GetTouchpointIconsInput;
}>;

export type GetTouchPointIconsQuery = {
  __typename?: "Query";
  getTouchPointIcons: {
    __typename?: "GetTouchPointIconsModel";
    count?: number | null;
    attachments: Array<{
      __typename?: "Attachment";
      id: number;
      url: string;
      key: string;
      name?: string | null;
      type: Types.AttachmentsEnum;
    }>;
  };
};

export const GetTouchPointIconsDocument = `
    query GetTouchPointIcons($getTouchpointIconsInput: GetTouchpointIconsInput!) {
  getTouchPointIcons(getTouchpointIconsInput: $getTouchpointIconsInput) {
    count
    attachments {
      id
      url
      key
      name
      type
    }
  }
}
    `;

export const useGetTouchPointIconsQuery = <
  TData = GetTouchPointIconsQuery,
  TError = unknown,
>(
  variables: GetTouchPointIconsQueryVariables,
  options?: Omit<
    UseQueryOptions<GetTouchPointIconsQuery, TError, TData>,
    "queryKey"
  > & {
    queryKey?: UseQueryOptions<
      GetTouchPointIconsQuery,
      TError,
      TData
    >["queryKey"];
  },
) => {
  return useQuery<GetTouchPointIconsQuery, TError, TData>({
    queryKey: ["GetTouchPointIcons", variables],
    queryFn: axiosRequest<
      GetTouchPointIconsQuery,
      GetTouchPointIconsQueryVariables
    >(GetTouchPointIconsDocument).bind(null, variables),
    ...options,
  });
};

useGetTouchPointIconsQuery.getKey = (
  variables: GetTouchPointIconsQueryVariables,
) => ["GetTouchPointIcons", variables];

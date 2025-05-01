import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { TOKEN_NAME } from "../constants";
import { getCookie, deleteCookie } from "../utils/cookieHelper.ts";

const $apiClient = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
});

const handleError = (error: Error | AxiosError) => {
  if (typeof window === "undefined") {
    throw error;
  }

  if (axios.isAxiosError(error) && !!error.response?.data?.message) {
    if (error.response.status === 401) {
      deleteCookie(TOKEN_NAME);
    }
    return Promise.reject(error.response.data);
  } else {
    return Promise.reject(error);
  }
};

$apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  config.headers = config.headers || {};

  const token = getCookie(TOKEN_NAME);

  config.headers["Cache-Control"] = "max-age=31536000";

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, handleError);

$apiClient.interceptors.response.use((response) => {
  return response.data;
}, handleError);

export const axiosRequest =
  <TData, TVariables>(
    query: string,
    headers?: Record<string, never>,
  ): ((variables?: TVariables) => Promise<TData>) =>
  async (variables?: TVariables) =>
    $apiClient
      ?.post<{ data: TData; errors: never }>(
        "",
        {
          query,
          variables,
        },
        { headers: headers },
      )
      .then((res) => {
        if (res.data.errors) {
          throw res.data;
        }
        return res.data.data;
      })
      .catch((error) => {
        if (error.message) {
          throw {
            message: error.message,
            status: error.status,
            query,
            variables,
          };
        } else if (error.errors?.length && error.errors[0]?.message) {
          throw {
            message: error.errors[0]?.message,
            status: error.errors[0]?.status,
            query,
            variables,
          };
        } else {
          throw { message: "Network Error", query, variables };
        }
      });

export default $apiClient;

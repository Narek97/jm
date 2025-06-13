import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getCookie, deleteCookie } from '../utils/cookieHelper.ts';
import { TOKEN_NAME } from '@/constants';

const $apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/graphql`,
});

const handleError = (error: Error | AxiosError) => {
  if (typeof window === 'undefined') {
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

  config.headers['Cache-Control'] = 'max-age=31536000';

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, handleError);

$apiClient.interceptors.response.use(response => {
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
        '',
        {
          query,
          variables,
        },
        { headers },
      )
      .then((res: any) => {
        if (res.errors?.length) {
          throw {
            message: res.errors[0]?.message,
            status: res.errors[0]?.status,
            query,
            variables,
          };
        }
        if (!res.data) {
        }
        return res.data;
      })
      .catch(error => {
        if (error.message) {
          throw {
            message: error.message,
            status: error.status,
            query,
            variables,
          };
        } else {
          throw { message: 'Network Error', query, variables };
        }
      });

export default $apiClient;

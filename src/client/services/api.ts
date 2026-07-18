/**
 * API Service - Centralized Axios Instance
 * =========================================
 *
 * This module creates a pre-configured Axios instance for all API calls.
 */

import axios, { type AxiosRequestConfig } from 'axios';
import { toast } from 'react-toastify';

/** Axios instance whose response interceptor unwraps `response.data` */
interface ApiClient {
  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
}

const api = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error: unknown) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data,
  (error: {
    response?: { data?: { message?: string }; status?: number };
    message?: string;
    config?: { url?: string };
  }) => {
    const message =
      error.response?.data?.message || error.message || 'An unexpected error occurred';

    toast.error(message);

    if (import.meta.env.DEV) {
      console.error('❌ API Error:', {
        url: error.config?.url,
        status: error.response?.status,
        message,
      });
    }

    return Promise.reject(error);
  }
);

export default api as ApiClient;

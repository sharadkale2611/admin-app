// // lib/services/apiService.ts
// import axios from 'axios';
// import API_ENDPOINTS from '../config/apiConfig';
// import type { AppDispatch } from '../store';
// import { logout } from '../features/auth/authSlice';

// const api = axios.create({
//     baseURL: API_ENDPOINTS.BASE_URL_API,
//     withCredentials: true, // Crucial for sending cookies
//     headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json',
//     },
// });

// // Response transformer - handles successful responses
// api.interceptors.response.use(
//     (response) => {
//         // Only transform JSON responses
//         if (response.headers['content-type']?.includes('application/json')) {
//             return response.data;
//         }
//         return response;
//     }
// );

// // Error interceptor - handles all error responses
// api.interceptors.response.use(
//     undefined, // Leave successful responses untouched
//     async (error) => {
//         const originalRequest = error.config;

//         // Network errors (no response)
//         if (!error.response) {
//             return Promise.reject({
//                 status: 0,
//                 message: 'Network error. Please check your connection.'
//             });
//         }

//         // 401 Unauthorized handling with token refresh
//         if (error.response.status === 401 && !originalRequest._retry) {
//             originalRequest._retry = true;

//             try {
//                 // Attempt to refresh tokens
//                 await axios.post(
//                     `${API_ENDPOINTS.BASE_URL_API}${API_ENDPOINTS.AUTH.REFRESH}`,
//                     {},
//                     { withCredentials: true }
//                 );

//                 // Retry the original request with new tokens
//                 return api(originalRequest);
//             } catch (refreshError) {
//                 // Refresh failed - logout and redirect
//                 if (typeof window !== 'undefined') {
//                     window.location.href = '/login';
//                 }
//                 return Promise.reject({
//                     status: 401,
//                     message: 'Session expired. Please login again.'
//                 });
//             }
//         }

//         // Standard error formatting
//         const errorData = {
//             status: error.response.status,
//             message: typeof error.response.data === 'string'
//                 ? error.response.data
//                 : error.response.data?.message || 'An error occurred',
//             ...(typeof error.response.data === 'object' && {
//                 errors: error.response.data.errors,
//                 fieldErrors: error.response.data.errors
//             })
//         };

//         return Promise.reject(errorData);
//     }
// );

// // Initialize function for Redux-dependent interceptors
// export const initializeAuthInterceptor = (dispatch: AppDispatch) => {
//     api.interceptors.response.use(
//         undefined,
//         (error) => {
//             // Handle logout on specific errors
//             if (error.response?.status === 401 && error.config.url !== API_ENDPOINTS.AUTH.REFRESH) {
//                 dispatch(logout());
//             }
//             return Promise.reject(error);
//         }
//     );
// };

// export const apiClient = api;
// export default api;

import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig, AxiosRequestConfig } from 'axios';
import API_ENDPOINTS from '../config/apiConfig';
import type { AppDispatch } from '../store';
import { logout } from '../features/auth/authSlice';

// Export the interface for transformed responses
export interface TransformedResponse<T = any> {
    // Original axios properties
    status: number;
    statusText: string;
    headers: any;
    config: InternalAxiosRequestConfig;

    // Your API response properties (from response.data)
    success?: boolean;
    message?: string;
    data?: T;
    error?: string | null;
    errors?: Record<string, string[]> | null;
}

// Create a regular axios instance
const axiosInstance: AxiosInstance = axios.create({
    baseURL: API_ENDPOINTS.BASE_URL_API,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // Add any request headers here if needed
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response transformer - handles successful responses
axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        // Only transform JSON responses
        if (response.headers['content-type']?.includes('application/json')) {
            // Create a new AxiosResponse that contains our transformed data
            // const transformedResponse: AxiosResponse = {
            //     ...response,
            //     data: {
            //         ...response.data, // Spread the actual API response data (success, message, data, etc.)
            //         status: response.status,
            //         statusText: response.statusText,
            //         headers: response.headers,
            //         config: response.config,
            //     }
            // };

            const transformedResponse = {
                ...response.data, // Spread the actual API response data
                status: response.status,
                statusText: response.statusText,
                headers: response.headers,
                config: response.config,
            };            

            return transformedResponse;
        }
        return response;
    },
    undefined // Leave error handling to the next interceptor
);

// Error interceptor - handles all error responses
axiosInstance.interceptors.response.use(
    undefined, // Leave successful responses untouched
    async (error) => {
        const originalRequest = error.config;

        // Network errors (no response)
        if (!error.response) {
            return Promise.reject({
                status: 0,
                message: 'Network error. Please check your connection.'
            });
        }

        // 401 Unauthorized handling with token refresh
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Attempt to refresh tokens
                await axios.post(
                    `${API_ENDPOINTS.BASE_URL_API}${API_ENDPOINTS.AUTH.REFRESH}`,
                    {},
                    { withCredentials: true }
                );

                // Retry the original request with new tokens
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // Refresh failed - logout and redirect
                if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                }
                return Promise.reject({
                    status: 401,
                    message: 'Session expired. Please login again.'
                });
            }
        }

        // Standard error formatting
        const errorData = {
            status: error.response.status,
            message: typeof error.response.data === 'string'
                ? error.response.data
                : error.response.data?.message || 'An error occurred',
            ...(typeof error.response.data === 'object' && {
                errors: error.response.data.errors,
                fieldErrors: error.response.data.errors
            })
        };

        return Promise.reject(errorData);
    }
);

// Create a typed wrapper around the axios instance that returns TransformedResponse
export const api = {
    get: async <T = any>(
        url: string,
        config?: AxiosRequestConfig
    ): Promise<TransformedResponse<T>> => {
        const response = await axiosInstance.get<TransformedResponse<T>>(url, config);
        return response as TransformedResponse<T>; // no .data here
    },
    post: async <T = any>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<TransformedResponse<T>> => {
        const response = await axiosInstance.post<TransformedResponse<T>>(url, data, config);
        return response as TransformedResponse<T>;
    },
    put: async <T = any>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<TransformedResponse<T>> => {
        const response = await axiosInstance.put<TransformedResponse<T>>(url, data, config);
        return response as TransformedResponse<T>;
    },
    delete: async <T = any>(
        url: string,
        config?: AxiosRequestConfig
    ): Promise<TransformedResponse<T>> => {
        const response = await axiosInstance.delete<TransformedResponse<T>>(url, config);
        return response as TransformedResponse<T>;
    },
};


// Initialize function for Redux-dependent interceptors
export const initializeAuthInterceptor = (dispatch: AppDispatch) => {
    axiosInstance.interceptors.response.use(
        undefined,
        (error) => {
            // Handle logout on specific errors
            if (error.response?.status === 401 && error.config.url !== API_ENDPOINTS.AUTH.REFRESH) {
                dispatch(logout());
            }
            return Promise.reject(error);
        }
    );
};

export const apiClient = axiosInstance;
export default api;
// lib/services/apiService.ts
import axios from 'axios';
import API_ENDPOINTS from '../config/apiConfig';
import type { AppDispatch } from '../store';
import { logout } from '../features/auth/authSlice';

const api = axios.create({
    baseURL: API_ENDPOINTS.BASE_URL_API,
    withCredentials: true, // Crucial for sending cookies
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Response transformer - handles successful responses
api.interceptors.response.use(
    (response) => {
        // Only transform JSON responses
        if (response.headers['content-type']?.includes('application/json')) {
            return response.data;
        }
        return response;
    }
);

// Error interceptor - handles all error responses
api.interceptors.response.use(
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
                return api(originalRequest);
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

// Initialize function for Redux-dependent interceptors
export const initializeAuthInterceptor = (dispatch: AppDispatch) => {
    api.interceptors.response.use(
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

export const apiClient = api;
export default api;
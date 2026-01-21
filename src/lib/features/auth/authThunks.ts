// lib/features/auth/authThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { loginFailure, loginStart, loginSuccess, logout } from './authSlice';
import api from '@/lib/services/apiService';
import { User } from './authTypes';
import API_ENDPOINTS from '@/lib/config/apiConfig';
import { setSessionExpiry, setRefreshing, clearTokens } from '../session/sessionSlice';
import { AppDispatch, RootState } from '@/lib/store';
import { setFirmId } from "../staff/staffSlice";
import { resetAdmissionDraft } from '../admission/admissionDraftSlice';

interface LoginCredentials {
    username: string;
    password: string;
}

interface ApiError {
    response?: {
        data?: {
            message?: string;
            error?: string;
            success?: boolean;
            errors?: Record<string, string[]>;
        };
        status?: number;
        statusText?: string;
    };
    message?: string;
    code?: string;
}

interface ThunkRejectValue {
    message: string;
    fieldErrors?: Record<string, string[]>;
}

const baseUrl = API_ENDPOINTS.BASE_URL_API;

/**
 * LOGIN
 */
export const login = createAsyncThunk<
    { user: User },
    LoginCredentials,
    { rejectValue: ThunkRejectValue; dispatch: AppDispatch }
>(
    'auth/login',
    async (credentials, { rejectWithValue, dispatch }) => {
        dispatch(loginStart());
        try {
            console.log(`before call ${baseUrl}${API_ENDPOINTS.AUTH.LOGIN} `, credentials);

            // The response here is already transformed to just the data by the interceptor
            const userData = await api.post<User>(`${baseUrl}${API_ENDPOINTS.AUTH.LOGIN}`, credentials) as unknown as User;

            console.log('Login successful, user data:', userData);
            console.log('Cookies:', document.cookie);

            // Type guard to ensure we have the required fields
            if (!userData.userId || !userData.username) {
                throw new Error('Invalid user data received from server');
            }

            const normalizedUser: User = {
                userId: userData.userId,
                username: userData.username,
                email: userData.email || '',
                roles: userData.roles || [],
                firmId: userData.firmId || null,
                firmName: userData.firmName || '',
                firmCode: userData.firmCode || '',
            };

            dispatch(loginSuccess(normalizedUser));
            const firmIdNumber = normalizedUser.firmId ? Number(normalizedUser.firmId) : null;
            dispatch(setFirmId(firmIdNumber)); 
            return { user: normalizedUser };

        } catch (err) {
            const error = err as ApiError;

            if (typeof error.response?.data === 'string') {
                return rejectWithValue({ message: error.response.data });
            }

            if (error.response?.data?.errors) {
                return rejectWithValue({
                    message: 'Please fix the following errors:',
                    fieldErrors: error.response.data.errors
                });
            }

            const message =
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                'Login failed';

            return rejectWithValue({ message });
        }
    }
);

/**
 * LOGOUT
 */
export const logoutUser = createAsyncThunk<void, void, { dispatch: AppDispatch }>(
    'auth/logout',
    async (_, { dispatch }) => {
        try {
            await api.post(`${baseUrl}${API_ENDPOINTS.AUTH.LOGOUT}`);
            console.log('logout done!');
            
        } finally {
            dispatch(resetAdmissionDraft());
            dispatch(logout());
            dispatch(setSessionExpiry(null));
        }
    }
);

/**
 * CHECK AUTH
 */
export const checkAuth = createAsyncThunk<
    { user: User } | null,
    void,
    { rejectValue: string; dispatch: AppDispatch; state: RootState }
>(
    'auth/checkAuth',
    async (_, { rejectWithValue, dispatch, getState }) => {
        try {
            const { auth } = getState();
            if (auth.isAuthenticated && auth.user) {
                return { user: auth.user };
            }

            const response = await api.get<{
                isAuthenticated: boolean;
                user?: User;
                expiresIn?: number;
            }>(`${baseUrl}${API_ENDPOINTS.AUTH.CHECK}`, {
                withCredentials: true,
                validateStatus: (status) => status < 500 // Don't throw for 401
            });

            console.log('Auth check response:', response.status);

            if (response.status === 401) {
                console.log('Unauthorized → attempting refresh');

                try {
                    await dispatch(refreshToken()).unwrap();

                    // Retry once after refresh
                    const retryResponse = await api.get<{
                        isAuthenticated: boolean;
                        user?: User;
                        expiresIn?: number;
                    }>(`${baseUrl}${API_ENDPOINTS.AUTH.CHECK}`, { withCredentials: true });

                    if (retryResponse.data?.isAuthenticated && retryResponse.data.user) {
                        return { user: retryResponse.data.user };
                    }
                } catch (refreshError) {
                    console.log('Refresh token failed → logging out');
                    dispatch(resetAdmissionDraft());
                    // dispatch(logout());
                    return rejectWithValue('Session expired. Please login again.');
                }
            }

            if (response.data?.isAuthenticated && response.data.user) {
                const userData: User = {
                    userId: response.data.user.userId,
                    username: response.data.user.username,
                    email: response.data.user.email ?? '',
                    roles: response.data.user.roles ?? [],
                    firmId: response.data.user.firmId ?? null,
                    firmName: response.data.user.firmName ?? '',
                    firmCode: response.data.user.firmCode ?? '',
                };

                if (response.data.expiresIn) {
                    const expiryTime = Date.now() + response.data.expiresIn * 1000;
                    dispatch(setSessionExpiry(expiryTime));
                }

                return { user: userData };
            }

            return null;
        } catch (error) {
            console.error('Authentication check failed:', error);
            dispatch(resetAdmissionDraft());
            // dispatch(logout());
            return rejectWithValue('Session expired. Please login again.');
        }
    }
);


/**
 * REFRESH TOKEN
 */
export const refreshToken = createAsyncThunk<
    void,
    void,
    { dispatch: AppDispatch }
>(
    'auth/refreshToken',
    async (_, { dispatch }) => {
        try {
            dispatch(setRefreshing(true));

            const response = await api.post<{ expiresIn?: number }>(`${baseUrl}${API_ENDPOINTS.AUTH.REFRESH}`);

            if (response.data?.expiresIn) {
                const expiryTime = Date.now() + response.data.expiresIn * 1000;
                dispatch(setSessionExpiry(expiryTime));
            }
        } catch (error) {
            const err = error as ApiError;
            const errorMessage = err.response?.data?.message || err.message || 'Refresh Token failed';
            dispatch(loginFailure({
                message: errorMessage,
                severity: 'error'
            }));
            dispatch(resetAdmissionDraft());
            dispatch(clearTokens());
            dispatch(logout());
            dispatch(setSessionExpiry(null));

            throw error;
        } finally {
            dispatch(setRefreshing(false));
        }
    }
);

/**
 * CHANGE PASSWORD
 */
export const changePassword = createAsyncThunk<
  void,
  { currentPassword: string; newPassword: string },
  { state: RootState }
>(
  "auth/changePassword",
  async (payload, { getState }) => {
    // 1️⃣ get logged-in userId from redux
    const userId = getState().auth.user?.userId;

    if (!userId) {
      throw new Error("User not logged in");
    }

    // 2️⃣ build API url
    const url = `${API_ENDPOINTS.USERS.BASE}/${userId}/change-password`;

    // 3️⃣ call backend API
    await api.post(`${baseUrl}${url}`, payload);
  }
);

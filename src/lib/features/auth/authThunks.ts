// lib/features/auth/authThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { loginFailure, loginStart, loginSuccess, logout } from './authSlice';
import api from '@/lib/services/apiService';
import { User } from './authTypes';
import API_ENDPOINTS from '@/lib/config/apiConfig';
import { setSessionExpiry, setRefreshing, clearTokens } from '../session/sessionSlice';
import { AppDispatch, RootState } from '@/lib/store';
import { setFirmId } from '../staff/staffSlice';
import { resetAdmissionDraft } from '../admission/admissionDraftSlice';

interface LoginCredentials {
    username: string;
    password: string;
}

interface ThunkRejectValue {
    message: string;
    fieldErrors?: Record<string, string[]>;
}

/**
 * ============================
 * LOGIN
 * ============================
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
            // IMPORTANT: no baseUrl here
            const response = await api.post<User>(
                API_ENDPOINTS.AUTH.LOGIN,
                credentials
            );

            if (!response.data) {
                return rejectWithValue({ message: 'No data received from server' });
            }

            const userData = response.data;

            if (!userData.userId || !userData.username) {
                return rejectWithValue({ message: 'Invalid user data received' });
            }

            const normalizedUser: User = {
                userId: userData.userId,
                username: userData.username,
                email: userData.email ?? '',
                roles: userData.roles ?? [],
                firmId: userData.firmId ?? null,
                firmName: userData.firmName ?? '',
                firmCode: userData.firmCode ?? '',
            };

            dispatch(loginSuccess(normalizedUser));
            dispatch(setFirmId(normalizedUser.firmId ? Number(normalizedUser.firmId) : null));

            return { user: normalizedUser };
        } catch (error: any) {
            return rejectWithValue({
                message: error?.message || 'Login failed',
                fieldErrors: error?.errors,
            });
        }
    }
);

/**
 * ============================
 * LOGOUT
 * ============================
 */
export const logoutUser = createAsyncThunk<void, void, { dispatch: AppDispatch }>(
    'auth/logout',
    async (_, { dispatch }) => {
        try {
            await api.post(API_ENDPOINTS.AUTH.LOGOUT);
        } finally {
            dispatch(resetAdmissionDraft());
            dispatch(logout());
            dispatch(setSessionExpiry(null));
        }
    }
);

/**
 * ============================
 * CHECK AUTH
 * ============================
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
            }>(API_ENDPOINTS.AUTH.CHECK, {
                withCredentials: true,
                validateStatus: (status) => status < 500,
            });

            if (response.status === 401) {
                try {
                    await dispatch(refreshToken()).unwrap();

                    const retry = await api.get<{
                        isAuthenticated: boolean;
                        user?: User;
                        expiresIn?: number;
                    }>(API_ENDPOINTS.AUTH.CHECK, { withCredentials: true });

                    if (retry.data?.isAuthenticated && retry.data.user) {
                        return { user: retry.data.user };
                    }
                } catch {
                    dispatch(resetAdmissionDraft());
                    return rejectWithValue('Session expired. Please login again.');
                }
            }

            if (response.data?.isAuthenticated && response.data.user) {
                if (response.data.expiresIn) {
                    dispatch(
                        setSessionExpiry(Date.now() + response.data.expiresIn * 1000)
                    );
                }

                return { user: response.data.user };
            }

            return null;
        } catch {
            dispatch(resetAdmissionDraft());
            return rejectWithValue('Session expired. Please login again.');
        }
    }
);

/**
 * ============================
 * REFRESH TOKEN
 * ============================
 */
export const refreshToken = createAsyncThunk<void, void, { dispatch: AppDispatch }>(
    'auth/refreshToken',
    async (_, { dispatch }) => {
        try {
            dispatch(setRefreshing(true));

            const response = await api.post<{ expiresIn?: number }>(
                API_ENDPOINTS.AUTH.REFRESH
            );

            if (response.data?.expiresIn) {
                dispatch(
                    setSessionExpiry(Date.now() + response.data.expiresIn * 1000)
                );
            }
        } catch (error: any) {
            dispatch(
                loginFailure({
                    message: error?.message || 'Refresh token failed',
                    severity: 'error',
                })
            );

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
 * ============================
 * CHANGE PASSWORD
 * ============================
 */
export const changePassword = createAsyncThunk<
    void,
    { currentPassword: string; newPassword: string },
    { state: RootState }
>(
    'auth/changePassword',
    async (payload, { getState }) => {
        const userId = getState().auth.user?.userId;

        if (!userId) {
            throw new Error('User not logged in');
        }

        await api.post(
            `${API_ENDPOINTS.USERS.BASE}/${userId}/change-password`,
            payload
        );
    }
);

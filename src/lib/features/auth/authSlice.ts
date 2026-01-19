// lib/features/auth/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from './authTypes';


export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    loading: boolean;          // login/register only
    isAuthChecking: boolean;   // initial check
    error: {
        message: string;
        severity?: 'error' | 'warning' | 'info' | 'success';
    } | null;
    initialCheckDone: boolean; // 🔑 SINGLE SOURCE OF TRUTH
    hasLoggedOut: boolean;

}


const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    loading: false,
    isAuthChecking: false,
    error: null,
    initialCheckDone: false,
    hasLoggedOut: false,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action: PayloadAction<User>) => {
            state.isAuthenticated = true;
            state.loading = false;
            state.error = null;
            state.initialCheckDone = true;
            state.hasLoggedOut = false; // 🔥 RESET HERE

            const user = action.payload;
            state.user = {
                userId: user.userId,
                username: user.username,
                email: user.email,
                roles: user.roles,
                firmId: user.firmId !== undefined && user.firmId !== null
                    ? Number(user.firmId)
                    : null,
                firmName: user.firmName || "",
                firmCode: user.firmCode || ""
            };
        },

        loginFailure: (state, action: PayloadAction<AuthState['error']>) => {
            state.loading = false;
            state.error = action.payload;
            state.initialCheckDone = true;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.loading = false;
            state.error = null;
            state.initialCheckDone = true;
            state.hasLoggedOut = true;
        },
        setAuthLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        resetAuthState: () => initialState,
    },
    // Removed extraReducers - they will be added in authStore.ts
});

export const {
    loginStart,
    loginSuccess,
    loginFailure,
    logout,
    setAuthLoading,
    clearError,
} = authSlice.actions;

// Export the plain reducer (without extraReducers)
export const authReducer = authSlice.reducer;

// Export action types for use in thunks
// export type AuthActions = ReturnType<typeof authSlice.actions[keyof typeof authSlice.actions]>;
// lib/features/auth/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from './authTypes';


export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    loading: boolean;
    error: {
        message: string;
        severity?: 'error' | 'warning' | 'info' | 'success';
    } | null;
    hasChecked: boolean; // ✅
    initialCheckDone: boolean

}

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    loading: false, //  form & async actions only
    error: null,
    hasChecked: false,
    initialCheckDone: false


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
            state.user = action.payload;
            state.loading = false;
            state.error = null;
            state.hasChecked = true; // ✅ add this

        },
        loginFailure: (state, action: PayloadAction<AuthState['error']>) => {
            state.loading = false;
            state.error = action.payload;
            state.hasChecked = true; // ✅ add this

        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.loading = false;
            state.error = null;
        },
        setAuthLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        setInitialized: (state) => {
            if (state.loading) {
                state.loading = false;
            }
        },
        markInitialCheckDone: (state) => {
            state.initialCheckDone = true;
        },        
        markInitialCheckComplete: (state) => {
            state.initialCheckDone = true;
        },
        resetAuthState: () => initialState,
        setHasChecked: (state, action: PayloadAction<boolean>) => {
            state.hasChecked = action.payload;
        },
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
    setInitialized,
    setHasChecked
} = authSlice.actions;

// Export the plain reducer (without extraReducers)
export const authReducer = authSlice.reducer;

// Export action types for use in thunks
// export type AuthActions = ReturnType<typeof authSlice.actions[keyof typeof authSlice.actions]>;
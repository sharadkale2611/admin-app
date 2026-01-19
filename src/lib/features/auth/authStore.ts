// lib/features/auth/authStore.ts
// import { login, logoutUser, checkAuth } from './authThunks';

import { createReducer } from '@reduxjs/toolkit';
import type { AnyAction, PayloadAction } from '@reduxjs/toolkit';
import * as authThunks from './authThunks'; // Import all thunks as namespace
import { authSlice } from './authSlice';
import { User } from './authTypes';



// Define the auth state type for clarity
type AuthState = ReturnType<typeof authSlice.getInitialState>;

// Create a new reducer with the extra reducers
const authReducer = createReducer(authSlice.getInitialState(), (builder) => {
    // Add original slice reducers
    Object.entries(authSlice.actions).forEach(([_, actionCreator]) => {
        builder.addCase(actionCreator, (state: AuthState, action: AnyAction) => {
            return authSlice.reducer(state, action);
        });
    });

    // Then add the thunk cases
    builder
        .addCase(authThunks.login.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(authThunks.login.fulfilled, (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.loading = false;
            state.error = null;
        })
        .addCase(authThunks.login.rejected, (state, action) => {
            state.loading = false;
            state.error = {
                message: action.payload?.message || 'Login failed',
                severity: 'error'
            };
        })
        .addCase(authThunks.logoutUser.pending, (state) => {
            state.loading = true;
        })
        .addCase(authThunks.logoutUser.fulfilled, (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.loading = false;
            state.error = null;
        })
        .addCase(authThunks.logoutUser.rejected, (state) => {
            state.loading = false;
        })
        .addCase(authThunks.checkAuth.pending, (state) => {
            state.loading = true;
            state.isAuthChecking = true;
        })
        .addCase(authThunks.checkAuth.fulfilled, (state, action: PayloadAction<{ user: User } | null>) => {
            state.loading = false;
            state.initialCheckDone = true;
            state.isAuthChecking = false;

            if (action.payload) {
                state.isAuthenticated = true;
                state.user = action.payload.user;
            } else {
                state.isAuthenticated = false;
                state.user = null;
            }
        })
        .addCase(authThunks.checkAuth.rejected, (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.loading = false;
            state.isAuthChecking = false;
            state.initialCheckDone = true;
        });
});

// Export combined actions
export const authActions = {
    ...authSlice.actions,
    ...authThunks
};

export { authReducer };
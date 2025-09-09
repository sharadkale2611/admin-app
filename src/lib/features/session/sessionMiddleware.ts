// src/lib/features/session/sessionMiddleware.ts
import { Middleware } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '@/lib/store';
import { refreshToken } from '../auth/authThunks';
import { loginSuccess, logout } from '../auth/authSlice'; // Add these imports

// Time before expiry to attempt refresh (5 minutes)
const REFRESH_THRESHOLD = 5 * 60 * 1000;

export const sessionMiddleware: Middleware<
    {}, // Most middleware do not modify the dispatch return value
    RootState,
    AppDispatch
> = (store) => (next) => (action: unknown) => { // Add type annotation here
    // Skip for non-API actions
    if (typeof action === 'object' && action !== null && 'type' in action &&
        typeof action.type === 'string' && !action.type.includes('api/')) {
        return next(action);
    }

    const state = store.getState();
    const { expiresAt, isRefreshing } = state.session;

    // Check if session is about to expire
    if (
        expiresAt &&
        !isRefreshing &&
        expiresAt - Date.now() < REFRESH_THRESHOLD
    ) {
        // Attempt refresh before proceeding with the original action
        return store.dispatch(refreshToken())
            .then(() => next(action))
            .catch(() => {
                // Refresh failed - the logout will be handled by the thunk
                return next(action); // Still proceed so the original request can fail
            });
    }

    return next(action);
};

// Additional middleware for periodic session checks
export const sessionMonitorMiddleware: Middleware<
    {},
    RootState,
    AppDispatch
> = (store) => {
    let checkInterval: NodeJS.Timeout;

    return (next) => (action: unknown) => { // Add type annotation here
        // Start monitoring after successful login
        if (typeof action === 'object' && action !== null && 'type' in action &&
            action.type === loginSuccess.type) {
            // Clear any existing interval
            if (checkInterval) clearInterval(checkInterval);

            // Check every minute
            checkInterval = setInterval(() => {
                const { expiresAt } = store.getState().session;
                if (expiresAt && expiresAt - Date.now() < REFRESH_THRESHOLD) {
                    store.dispatch(refreshToken());
                }
            }, 60 * 1000);
        }

        // Clean up on logout
        if (typeof action === 'object' && action !== null && 'type' in action &&
            action.type === logout.type) {
            if (checkInterval) clearInterval(checkInterval);
        }

        return next(action);
    };
};
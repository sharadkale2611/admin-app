// src/lib/features/session/sessionMiddleware.ts
import { Middleware } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '@/lib/store';
import { refreshToken as refreshTokenThunk } from '../auth/authThunks';
import { loginSuccess, logout } from '../auth/authSlice';

// Time before expiry to attempt refresh (5 minutes)
const REFRESH_THRESHOLD = 5 * 60 * 1000;

export const sessionMiddleware: Middleware<{}, RootState, AppDispatch> =
    (store) => (next) => (action: unknown) => {

        // Skip for non-API actions
        if (
            typeof action === 'object' &&
            action !== null &&
            'type' in action &&
            typeof action.type === 'string' &&
            !action.type.includes('api/')
        ) {
            return next(action);
        }

        const state = store.getState();

        // 🔥 HARD STOP if logged out
        if (!state.auth.isAuthenticated) {
            return next(action);
        }

        const { expiresAt, isRefreshing, refreshToken } = state.session;

        // 🔥 HARD STOP if no refresh token in STATE
        if (!refreshToken) {
            return next(action);
        }

        // Check if session is about to expire
        if (
            expiresAt &&
            !isRefreshing &&
            expiresAt - Date.now() < REFRESH_THRESHOLD
        ) {
            return store
                .dispatch(refreshTokenThunk())
                .then(() => next(action))
                .catch(() => next(action));
        }

        return next(action);
    };

// ---------------- MONITOR MIDDLEWARE ----------------

export const sessionMonitorMiddleware: Middleware<{}, RootState, AppDispatch> =
    (store) => {
        let checkInterval: NodeJS.Timeout | null = null;

        return (next) => (action: unknown) => {
            // Start monitoring after successful login
            if (
                typeof action === 'object' &&
                action !== null &&
                'type' in action &&
                action.type === loginSuccess.type
            ) {
                if (checkInterval) clearInterval(checkInterval);

                checkInterval = setInterval(() => {
                    const state = store.getState();

                    // 🔥 STOP interval if logged out or no refresh token
                    if (!state.auth.isAuthenticated || !state.session.refreshToken) {
                        if (checkInterval) clearInterval(checkInterval);
                        return;
                    }

                    const { expiresAt } = state.session;

                    if (expiresAt && expiresAt - Date.now() < REFRESH_THRESHOLD) {
                        store.dispatch(refreshTokenThunk());
                    }
                }, 60 * 1000);
            }

            // Clean up on logout
            if (
                typeof action === 'object' &&
                action !== null &&
                'type' in action &&
                action.type === logout.type
            ) {
                if (checkInterval) clearInterval(checkInterval);
            }

            return next(action);
        };
    };

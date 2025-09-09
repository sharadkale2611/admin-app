// src/lib/hooks/useLogout.ts
'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/lib/hooks';
import { logoutUser } from '@/lib/features/auth/authThunks';
import { AppRoutes } from '@/constants/routes';

export const useLogout = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const logout = useCallback(async (options: {
        redirectPath?: string;
        ignoreErrors?: boolean;
        clearLocalState?: boolean;
    } = {}) => {
        const {
            redirectPath = AppRoutes.LOGIN,
            ignoreErrors = true,
            clearLocalState = true
        } = options;

        try {
            // Attempt server logout
            await dispatch(logoutUser()).unwrap();

            // Clear client-side state
            if (clearLocalState) {
                localStorage.clear();
                sessionStorage.clear();
                // Clear any other client-side storage as needed
            }

            // Redirect to login page
            router.push(redirectPath);

            return true;
        } catch (error) {
            console.error('Logout failed:', error);

            // Fallback cleanup if server logout failed
            if (clearLocalState) {
                localStorage.clear();
                sessionStorage.clear();
            }

            // Still redirect if ignoreErrors is true
            if (ignoreErrors) {
                router.push(redirectPath);
            }

            return false;
        }
    }, [dispatch, router]);

    return { logout };
};
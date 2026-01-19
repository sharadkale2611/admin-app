// src/lib/hooks/useLogout.ts
'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/lib/hooks';
import { logoutUser } from '@/lib/features/auth/authThunks';
import { logout as logoutAction } from '@/lib/features/auth/authSlice';
import { resetAdmissionDraft } from '@/lib/features/admission/admissionDraftSlice';
import { persistor } from '@/lib/store';
import { AppRoutes } from '@/constants/routes';

export const useLogout = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const logout = useCallback(
        async (options: {
            redirectPath?: string;
            ignoreErrors?: boolean;
            clearLocalState?: boolean;
        } = {}) => {
            const {
                redirectPath = AppRoutes.LOGIN,
                ignoreErrors = true,
                clearLocalState = true,
            } = options;

            try {
                // 1️⃣ Attempt server-side logout (invalidate refresh token etc.)
                await dispatch(logoutUser()).unwrap();
            } catch (error) {
                console.error('Server logout failed:', error);
                if (!ignoreErrors) {
                    return false;
                }
            } finally {
                // 2️⃣ Always clear auth cookies (source of middleware truth)
                document.cookie = 'access-token=; Max-Age=0; path=/';
                document.cookie = 'refresh-token=; Max-Age=0; path=/';

                // 3️⃣ Reset redux slices
                dispatch(logoutAction());
                dispatch(resetAdmissionDraft());

                // 4️⃣ Purge redux-persist storage
                await persistor.purge();

                // 5️⃣ Optional extra client cleanup (kept from your existing logic)
                if (clearLocalState) {
                    localStorage.clear();
                    sessionStorage.clear();
                }

                // 6️⃣ Redirect
                router.replace(redirectPath);
            }

            return true;
        },
        [dispatch, router]
    );

    return { logout };
};

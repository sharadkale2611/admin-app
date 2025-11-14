'use client';
import { useEffect } from 'react';
import { checkAuth } from '@/lib/features/auth/authThunks';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { AppRoutes } from '@/constants/routes';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const dispatch = useAppDispatch();
    const { initialCheckDone } = useAppSelector(state => state.auth);

    useEffect(() => {
        if (!initialCheckDone) {
            dispatch(checkAuth());
        }
    }, [dispatch, initialCheckDone]);

    return <>{children}</>;
};





























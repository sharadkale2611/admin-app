// src/providers/StoreProvider.tsx
'use client';
import { Provider } from 'react-redux';
import { store } from '@/lib/store';
import { useEffect } from 'react';
import { useAppDispatch } from '@/lib/hooks';
import { checkAuth } from '@/lib/features/auth/authThunks';

// Separate component for auth initialization
const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(checkAuth());
    }, [dispatch]);

    return <>{children}</>;
};

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <Provider store={store}>
            <AuthInitializer>
                {children}
            </AuthInitializer>
        </Provider>
    );
};
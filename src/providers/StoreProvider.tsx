'use client';

import { Provider } from 'react-redux';
import { store } from '@/lib/store';
import { useEffect } from 'react';
import { checkAuth } from '@/lib/features/auth/authThunks';

function AuthBootstrap({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        const state = store.getState();

        if (!state.auth.initialCheckDone) {
            console.log('🔥 dispatching checkAuth from StoreProvider');
            store.dispatch(checkAuth());
        }
    }, []);

    return <>{children}</>;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <AuthBootstrap>
                {children}
            </AuthBootstrap>
        </Provider>
    );
}

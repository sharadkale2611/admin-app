'use client';

import { Provider } from 'react-redux';
import { store } from '@/lib/store';
import { useEffect } from 'react';
import { checkAuth } from '@/lib/features/auth/authThunks';

function AuthBootstrap({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        const state = store.getState();

        if (!state.auth.initialCheckDone && !state.auth.hasLoggedOut) {
            console.log('🔥 running checkAuth (cold start)');
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

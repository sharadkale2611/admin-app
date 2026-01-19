'use client';
// src/app/providers.tsx

import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../lib/store';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { checkAuth } from '@/lib/features/auth/authThunks';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#9c27b0',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
});

export function Providers({ children }: { children: React.ReactNode }) {

    const handleBeforeLift = async () => {
        const state = store.getState();

        if (!state.auth.initialCheckDone) {
            await store.dispatch(checkAuth());
        }
    };

    return (
        <Provider store={store}>
            <PersistGate
                loading={null}
                persistor={persistor}
                onBeforeLift={handleBeforeLift}
            >
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    {children}
                </ThemeProvider>
            </PersistGate>
        </Provider>
    );
}
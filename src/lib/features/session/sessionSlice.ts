import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SessionState {
    accessToken: string | null;
    refreshToken: string | null;
    expiresAt: number | null;
    isRefreshing: boolean;
}

const initialState: SessionState = {
    accessToken: null,
    refreshToken: null,
    expiresAt: null,
    isRefreshing: false,
};

export const sessionSlice = createSlice({
    name: 'session',
    initialState,
    reducers: {
        setTokens: (
            state,
            action: PayloadAction<{
                accessToken: string;
                refreshToken: string;
                expiresIn: number;
            }>
        ) => {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.expiresAt = Date.now() + action.payload.expiresIn * 1000;
        },
        clearTokens: (state) => {
            state.accessToken = null;
            state.refreshToken = null;
            state.expiresAt = null;
        },
        setSessionExpiry: (state, action: PayloadAction<number | null>) => {
            state.expiresAt = action.payload;
        },        
        setRefreshing: (state, action: PayloadAction<boolean>) => {
            state.isRefreshing = action.payload;
        },
    },
});

export const { setTokens, clearTokens, setSessionExpiry, setRefreshing } = sessionSlice.actions;
export const sessionReducer = sessionSlice.reducer;
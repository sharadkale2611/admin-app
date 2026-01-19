// src/lib/features/location/locationThunks.ts

import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "@/lib/store";
import api from "@/lib/services/apiService";
import API_ENDPOINTS from "@/lib/config/apiConfig";

/* ============================
   Types
============================ */

export interface State {
    stateId: number;
    stateName: string;
    country: string;
    isActive: boolean;
}

export interface City {
    cityId: number;
    cityName: string;
    stateId: number;
    stateName: string;
    isActive: boolean;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    error?: string | null;
    errors?: string[] | null;
}

/* ============================
   Error Handling (Same as Firm)
============================ */

export interface ApiError {
    error: string | null;
    errors: string[] | null;
}

function parseApiError(error: any): ApiError {
    console.log("parseApiError from location thunk", error);

    if (error?.response?.data) {
        const data = error.response.data;

        if (data.errors && typeof data.errors === "object") {
            const flattened = Object.entries(data.errors).flatMap(
                ([field, msgs]) =>
                    (msgs as string[]).map(msg => `${field}: ${msg}`)
            );
            return { error: null, errors: flattened };
        }

        if (data.error) {
            return { error: data.error, errors: null };
        }
    }

    return { error: "An unknown error occurred", errors: null };
}

/* ============================
   Fetch States
============================ */

export const fetchStates = createAsyncThunk<
    State[],
    void,
    { rejectValue: ApiError }
>(
    "location/fetchStates",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get<State[]>(
                API_ENDPOINTS.STATES.GET_LIST,
                { withCredentials: true }
            );

            console.log("✅ fetchStates response:", response);

            if (!Array.isArray(response.data)) {
                return rejectWithValue({
                    error: "No states found",
                    errors: null,
                });
            }

            return response.data;
        } catch (error: any) {
            return rejectWithValue(parseApiError(error));
        }
    }
);


/* ============================
   Fetch Cities by StateId
============================ */

export const fetchCitiesByState = createAsyncThunk<
    City[],
    number,
    { rejectValue: ApiError }
>(
    "location/fetchCitiesByState",
    async (stateId, { rejectWithValue }) => {
        try {
            const response = await api.get<City[]>(
                `${API_ENDPOINTS.CITIES.GET_LIST}/state/${stateId}`,
                { withCredentials: true }
            );

            if (!Array.isArray(response.data)) {
                return rejectWithValue({
                    error: "No cities found",
                    errors: null,
                });
            }

            return response.data;
        } catch (error: any) {
            return rejectWithValue(parseApiError(error));
        }
    }
);

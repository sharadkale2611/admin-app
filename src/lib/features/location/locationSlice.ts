import { createSlice } from "@reduxjs/toolkit";
import {
    fetchStates,
    fetchCitiesByState,
} from "./locationThunks";
import type { State, City } from "./locationThunks";

/* ============================
   State Type
============================ */

interface LocationState {
    states: State[];
    cities: City[];
    loadingStates: boolean;
    loadingCities: boolean;
    error: string | null;
}

/* ============================
   Initial State
============================ */

const initialState: LocationState = {
    states: [],
    cities: [],
    loadingStates: false,
    loadingCities: false,
    error: null,
};

/* ============================
   Slice
============================ */

const locationSlice = createSlice({
    name: "location",
    initialState,
    reducers: {
        clearLocationError: (state) => {
            state.error = null;
        },
        resetCities: (state) => {
            state.cities = [];
        },
        resetLocation: () => initialState,
    },

    extraReducers: (builder) => {
        builder

            // -------------------------------
            // FETCH STATES
            // -------------------------------
            .addCase(fetchStates.pending, (state) => {
                state.loadingStates = true;
                state.error = null;
            })
            .addCase(fetchStates.fulfilled, (state, action) => {
                state.loadingStates = false;
                state.states = action.payload;
            })
            .addCase(fetchStates.rejected, (state, action) => {
                state.loadingStates = false;
                state.error =
                    action.payload?.error ?? "Failed to load states";
            })

            // -------------------------------
            // FETCH CITIES BY STATE
            // -------------------------------
            .addCase(fetchCitiesByState.pending, (state) => {
                state.loadingCities = true;
                state.error = null;
            })
            .addCase(fetchCitiesByState.fulfilled, (state, action) => {
                state.loadingCities = false;
                state.cities = action.payload;
            })
            .addCase(fetchCitiesByState.rejected, (state, action) => {
                state.loadingCities = false;
                state.error =
                    action.payload?.error ?? "Failed to load cities";
            });
    },
});

/* ============================
   Exports
============================ */

export const {
    clearLocationError,
    resetCities,
    resetLocation,
} = locationSlice.actions;

export const locationReducer = locationSlice.reducer;
export default locationSlice.reducer;

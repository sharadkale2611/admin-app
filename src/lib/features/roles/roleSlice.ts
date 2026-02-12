// roles/roleSlice.ts

import { createSlice } from "@reduxjs/toolkit";
import { fetchRoles, fetchRoleById } from "./roleThunks";
import { RoleState, ApiError } from "./roleTypes";

const initialState: RoleState = {
    roles: [],
    currentRole: null,
    loading: false,
    error: null,
};

const roleSlice = createSlice({
    name: "roles",
    initialState,
    reducers: {
        clearCurrentRole(state) {
            state.currentRole = null;
        },
    },
    extraReducers: (builder) => {
        builder

            /* =========================
               GET ALL ROLES
            ========================= */

            .addCase(fetchRoles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRoles.fulfilled, (state, action) => {
                state.loading = false;
                state.roles = action.payload;
            })
            .addCase(fetchRoles.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    (action.payload as ApiError) ?? {
                        error: "Failed to fetch roles",
                        errors: null,
                    };
            })

            /* =========================
               GET ROLE BY ID
            ========================= */

            .addCase(fetchRoleById.fulfilled, (state, action) => {
                state.currentRole = action.payload;
            });
    },
});

export const { clearCurrentRole } = roleSlice.actions;
export default roleSlice.reducer;

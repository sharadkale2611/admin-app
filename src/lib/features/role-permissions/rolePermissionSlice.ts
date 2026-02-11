// src/lib/features/role-permissions/rolePermissionSlice.ts

import { createSlice } from "@reduxjs/toolkit";
import {
    fetchRolePermissions,
    saveRolePermissions,
} from "./rolePermissionThunks";
import { RolePermissionState } from "./rolePermissionTypes";

const initialState: RolePermissionState =   {
    items: [],
    original: [],
    loading: false,
    saving: false,
    error: null,
};

const slice = createSlice({
    name: "rolePermissions",
    initialState,
    reducers: {
        togglePermission(state, action) {
            const { permissionId, value } = action.payload;
            const item = state.items.find(p => p.permissionId === permissionId);
            if (item) item.isAllowed = value;
        },
    },
    extraReducers: (b) => {
        b.addCase(fetchRolePermissions.pending, s => {
            s.loading = true;
        });
        b.addCase(fetchRolePermissions.fulfilled, (s, a) => {
            s.loading = false;
            s.items = a.payload;
            s.original = JSON.parse(JSON.stringify(a.payload)); // deep clone

        });
        b.addCase(fetchRolePermissions.rejected, (s, a) => {
            s.loading = false;
            s.error = a.payload ?? null;
        });

        b.addCase(saveRolePermissions.pending, s => {
            s.saving = true;
        });
        b.addCase(saveRolePermissions.fulfilled, s => {
            s.saving = false;
        });
        b.addCase(saveRolePermissions.rejected, (s, a) => {
            s.saving = false;
            s.error = a.payload ?? null;
        });
    },
});

export const { togglePermission } = slice.actions;
export default slice.reducer;

// src/lib/features/role-permissions/rolePermissionThunks.ts

import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/services/apiService";
import API_ENDPOINTS from "@/lib/config/apiConfig";
import { RolePermissionView, ApiError } from "./rolePermissionTypes";

const parseApiError = (e: any): ApiError => ({
    error: e?.response?.data?.error ?? "Unknown error",
    errors: e?.response?.data?.errors ?? null,
});

export const fetchRolePermissions = createAsyncThunk<
    RolePermissionView[],
    number,
    { rejectValue: ApiError }
>("rolePermissions/fetch", async (roleId, { rejectWithValue }) => {
    try {
        const res = await api.get(
            `${API_ENDPOINTS.ROLES.GET_BY_ID}/${roleId}/permissions`,
            { withCredentials: true }
        );
        return res.data;
    } catch (e: any) {
        return rejectWithValue(parseApiError(e));
    }
});

export const saveRolePermissions = createAsyncThunk<
    void,
    { roleId: number; data: { permissionId: number; isAllowed: boolean }[] },
    { rejectValue: ApiError }
>("rolePermissions/save", async ({ roleId, data }, { rejectWithValue }) => {
    try {
        await api.post(
            `${API_ENDPOINTS.ROLES.GET_BY_ID}/${roleId}/permissions`,
            data,
            { withCredentials: true }
        );
    } catch (e: any) {
        return rejectWithValue(parseApiError(e));
    }
});

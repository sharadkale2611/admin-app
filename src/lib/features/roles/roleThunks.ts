// roles/roleThunks.ts

import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "@/lib/store";
import { Role, ApiError } from "./roleTypes";
import API_ENDPOINTS from "@/lib/config/apiConfig";
import api from "@/lib/services/apiService";

/* ===============================
   Error Parser (same pattern)
================================ */

function parseApiError(error: any): ApiError {
    if (error?.response?.data) {
        const data = error.response.data;

        if (data.errors && typeof data.errors === "object") {
            return { error: null, errors: data.errors };
        }

        if (data.error) {
            return { error: data.error, errors: null };
        }
    }

    return { error: "An unknown error occurred", errors: null };
}

/* ===============================
   GET ALL ROLES
================================ */

export const fetchRoles = createAsyncThunk<
    Role[],
    void,
    { dispatch: AppDispatch; state: RootState; rejectValue: ApiError }
>("roles/fetchAll", async (_, { rejectWithValue }) => {
    try {
        const response = await api.get<Role[]>(
            API_ENDPOINTS.ROLES.GET_LIST,
            { withCredentials: true }
        );

        if (!response?.data) {
            return rejectWithValue({
                error: "No roles returned from server",
                errors: null,
            });
        }

        return response.data;
    } catch (error: any) {
        return rejectWithValue(parseApiError(error));
    }
});

/* ===============================
   GET ROLE BY ID
================================ */

export const fetchRoleById = createAsyncThunk<
    Role,
    number,
    { rejectValue: ApiError }
>("roles/fetchById", async (id, { rejectWithValue }) => {
    try {
        const response = await api.get<Role>(
            `${API_ENDPOINTS.ROLES.GET_BY_ID}/${id}`,
            { withCredentials: true }
        );

        if (!response?.data) {
            return rejectWithValue({
                error: "Role not found",
                errors: null,
            });
        }

        return response.data;
    } catch (error: any) {
        return rejectWithValue(parseApiError(error));
    }
});

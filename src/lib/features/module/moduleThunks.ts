import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/services/apiService";
import API_ENDPOINTS from "@/lib/config/apiConfig";
import { ModuleDto, ModuleResponseDto } from "./moduleTypes";
import type { AppDispatch, RootState } from "@/lib/store";

interface ApiWrapper<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string | null;
}

const mapResponse = <T>(response: any): T | null => {
    if (Array.isArray(response)) return response as T;

    if (response?.success) return (response.data ?? null) as T;

    return null;
};


// GET ALL
export const fetchModules = createAsyncThunk<
    ModuleResponseDto[],
    void,
    { dispatch: AppDispatch; state: RootState; rejectValue: string }
>("modules/fetchModules", async (_, { rejectWithValue }) => {
    try {
        const response = await api.get<ApiWrapper<ModuleResponseDto[]>>(
            API_ENDPOINTS.MODULES.GET_LIST,
            { withCredentials: true }
        );

        const data = mapResponse<ModuleResponseDto[]>(response);
        if (!data) return rejectWithValue("No modules found");

        return data;
    } catch (error: any) {
        return rejectWithValue(error?.message || "Failed to fetch modules");
    }
});

// GET BY ID
export const fetchModuleById = createAsyncThunk<
    ModuleResponseDto,
    number,
    { dispatch: AppDispatch; state: RootState; rejectValue: string }
>("modules/fetchModuleById", async (id, { rejectWithValue }) => {
    try {
        const response = await api.get<ApiWrapper<ModuleResponseDto>>(
            `${API_ENDPOINTS.MODULES.GET_BY_ID}/${id}`,
            { withCredentials: true }
        );

        const data = mapResponse<ModuleResponseDto>(response);
        if (!data) return rejectWithValue("Module not found");

        return data;
    } catch (error: any) {
        return rejectWithValue(error?.message || "Failed to fetch module");
    }
});

// CREATE
export const createModule = createAsyncThunk<
    { success: boolean; module: ModuleResponseDto },
    ModuleDto,
    { dispatch: AppDispatch; state: RootState; rejectValue: string }
>("modules/createModule", async (dto, { rejectWithValue }) => {
    try {
        const response = await api.post<ApiWrapper<ModuleResponseDto>>(
            API_ENDPOINTS.MODULES.POST_CREATE,
            dto,
            { withCredentials: true }
        );

        const created = mapResponse<ModuleResponseDto>(response);
        if (!created) return rejectWithValue("Failed to create module");

        return { success: true, module: created };
    } catch (error: any) {
        return rejectWithValue(error?.message || "Failed to create module");
    }
});

// UPDATE
export const updateModule = createAsyncThunk<
    { success: boolean; module: ModuleResponseDto },
    { id: number; data: ModuleDto },
    { dispatch: AppDispatch; state: RootState; rejectValue: string }
>(
    "modules/updateModule",
    async ({ id, data }, { rejectWithValue, getState }) => {
        try {
            const response = await api.put<ApiWrapper<ModuleResponseDto>>(
                `${API_ENDPOINTS.MODULES.PUT_UPDATE}/${id}`,
                data,
                { withCredentials: true }
            );

            const res = response as ApiWrapper<ModuleResponseDto>;

            if (!res.success) {
                return rejectWithValue(res.message || "Failed to update module");
            }

            // Backend returned data:null, rebuild module
            let updatedModule: ModuleResponseDto;

            if (res.data) {
                // Backend returned full updated module
                updatedModule = res.data;
            } else {
                // Backend returned null → construct fallback updated module
                const state = getState();
                const existing = state.modules.modules.find(
                    (m: ModuleResponseDto) => m.moduleId === id
                );

                if (!existing) {
                    return rejectWithValue("Updated module not found locally");
                }

                updatedModule = {
                    ...existing, // ensure createdAt, firmId etc. exist
                    ...data,     // overwrite fields that were edited
                    moduleId: id,
                    updatedAt: new Date().toISOString(), // ensure valid required value
                };
            }

            return {
                success: true,
                module: updatedModule
            };
        } catch (error: any) {
            return rejectWithValue(error?.message || "Failed to update module");
        }
    }
);



// DELETE
export const deleteModule = createAsyncThunk<
    { success: boolean; id: number },
    number,
    { dispatch: AppDispatch; state: RootState; rejectValue: string }
>("modules/deleteModule", async (id, { rejectWithValue }) => {
    try {
        const response = await api.delete<ApiWrapper<any>>(
            `${API_ENDPOINTS.MODULES.DELETE}/${id}`,
            { withCredentials: true }
        );

        if (!response.success) return rejectWithValue(response.message || "Failed to delete");

        return { success: true, id };
    } catch (error: any) {
        return rejectWithValue(error?.message || "Failed to delete module");
    }
});

// src/lib/features/classRoom/classRoomThunks.ts

import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "@/lib/store";
import api from "@/lib/services/apiService";
import API_ENDPOINTS from "@/lib/config/apiConfig";
import {
    ClassRoomDto,
    ClassRoomResponseDto
} from "./classRoomTypes";

interface TypedApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string | null;
    errors?: Record<string, string[]> | null;
}

// Common helper (same idea as courseCategory)
const handleApiResponse = <T>(response: any): T | null => {
    if (Array.isArray(response)) return response as T;

    if (response && typeof response === "object" && "success" in response) {
        if (response.success) {
            return (response.data ?? {}) as T;
        }
        return null;
    }

    return response as T;
};

// 1) Get all ClassRooms
export const fetchClassRooms = createAsyncThunk<
    ClassRoomResponseDto[],
    void,
    { dispatch: AppDispatch; state: RootState; rejectValue: string }
>(
    "classRooms/fetchClassRooms",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get<TypedApiResponse<ClassRoomResponseDto[]>>(
                API_ENDPOINTS.CLASS_ROOMS.GET_LIST,
                { withCredentials: true }
            );

            const data = handleApiResponse<ClassRoomResponseDto[]>(response);
            if (!data) return rejectWithValue("No classrooms data received");

            return data;
        } catch (error: any) {
            console.error("Fetch class rooms error:", error);

            if (error.status === 401) return rejectWithValue("SESSION_EXPIRED");
            if (error.message) return rejectWithValue(error.message);

            return rejectWithValue("An unknown error occurred");
        }
    }
);

// 2) Get ClassRoom by ID
export const fetchClassRoomById = createAsyncThunk<
    ClassRoomResponseDto,
    number,
    { dispatch: AppDispatch; state: RootState; rejectValue: string }
>(
    "classRooms/fetchClassRoomById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get<TypedApiResponse<ClassRoomResponseDto>>(
                `${API_ENDPOINTS.CLASS_ROOMS.GET_BY_ID}/${id}`,
                { withCredentials: true }
            );

            const data = handleApiResponse<ClassRoomResponseDto>(response);
            if (!data) return rejectWithValue("Classroom not found");

            return data;
        } catch (error: any) {
            console.error("Fetch class room by ID error:", error);

            if (error.status === 401) return rejectWithValue("SESSION_EXPIRED");
            if (error.message) return rejectWithValue(error.message);

            return rejectWithValue("An unknown error occurred");
        }
    }
);

// 3) Create ClassRoom
export const createClassRoom = createAsyncThunk<
    { success: boolean; message: string; error: string | null; errors: Record<string, string[]> | null; classRoom: ClassRoomResponseDto; },
    ClassRoomDto,
    { dispatch: AppDispatch; state: RootState; rejectValue: string }
>(
    "classRooms/createClassRoom",
    async (dto, { rejectWithValue }) => {
        try {
            const response = await api.post<TypedApiResponse<ClassRoomResponseDto>>(
                API_ENDPOINTS.CLASS_ROOMS.POST_CREATE,
                dto,
                {
                    withCredentials: true,
                    headers: { "Content-Type": "application/json" }
                }
            );

            const created = handleApiResponse<ClassRoomResponseDto>(response);
            if (!created) return rejectWithValue("Failed to create classroom");

            return {
                success: true,
                message: "Classroom created successfully",
                error: null,
                errors: null,
                classRoom: created
            };
        } catch (error: any) {
            console.error("Create classroom error:", error);

            if (error.status === 401) return rejectWithValue("SESSION_EXPIRED");
            if (error.message) return rejectWithValue(error.message);

            return rejectWithValue("An unknown error occurred");
        }
    }
);

// 4) Update ClassRoom
export const updateClassRoom = createAsyncThunk<
    { success: boolean; message: string; error: string | null; errors: Record<string, string[]> | null; classRoom: ClassRoomResponseDto; },
    { id: number; data: ClassRoomDto },
    { dispatch: AppDispatch; state: RootState; rejectValue: string }
>(
    "classRooms/updateClassRoom",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await api.put<TypedApiResponse<ClassRoomResponseDto>>(
                `${API_ENDPOINTS.CLASS_ROOMS.PUT_UPDATE}/${id}`,
                data,
                {
                    withCredentials: true,
                    headers: { "Content-Type": "application/json" }
                }
            );

            const updated = handleApiResponse<ClassRoomResponseDto>(response);
            if (!updated) return rejectWithValue("Failed to update classroom");

            return {
                success: true,
                message: "Classroom updated successfully",
                error: null,
                errors: null,
                classRoom: updated
            };
        } catch (error: any) {
            console.error("Update classroom error:", error);

            if (error.status === 401) return rejectWithValue("SESSION_EXPIRED");
            if (error.message) return rejectWithValue(error.message);

            return rejectWithValue("An unknown error occurred");
        }
    }
);

// 5) Delete ClassRoom
export const deleteClassRoom = createAsyncThunk<
    { success: boolean; message: string; id: number; },
    number,
    { dispatch: AppDispatch; state: RootState; rejectValue: string }
>(
    "classRooms/deleteClassRoom",
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.delete(
                `${API_ENDPOINTS.CLASS_ROOMS.DELETE}/${id}`,
                { withCredentials: true }
            );

            const deleteResponse = handleApiResponse<{ success: boolean; message?: string }>(response);

            if (!deleteResponse || deleteResponse.success === false) {
                return rejectWithValue(deleteResponse?.message || "Failed to delete classroom");
            }

            return {
                success: true,
                message: deleteResponse.message || "Classroom deleted successfully",
                id
            };
        } catch (error: any) {
            console.error("Delete classroom error:", error);

            if (error.status === 401) return rejectWithValue("SESSION_EXPIRED");
            if (error.message) return rejectWithValue(error.message);

            return rejectWithValue("An unknown error occurred");
        }
    }
);

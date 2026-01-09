// lib/features/courseModules/courseModuleThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/services/apiService";
import API_ENDPOINTS from "@/lib/config/apiConfig";
import type { AppDispatch, RootState } from "@/lib/store";
import { CourseModuleDto, CourseModuleResponseDto } from "./courseModuleTypes";
import { Course } from "../course/courseTypes";
import { ModuleResponseDto } from "../module/moduleTypes";

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

// --------------------
// CourseModule CRUD
// --------------------

// GET ALL
export const fetchCourseModules = createAsyncThunk<
    CourseModuleResponseDto[],
    void,
    { dispatch: AppDispatch; state: RootState; rejectValue: string }
>("courseModules/fetchAll", async (_, { rejectWithValue }) => {
    try {
        const response = await api.get<ApiWrapper<CourseModuleResponseDto[]>>(
            API_ENDPOINTS.COURSE_MODULES.GET_LIST,
            { withCredentials: true }
        );

        const data = mapResponse<CourseModuleResponseDto[]>(response);
        if (!data) return rejectWithValue("No course modules found");

        return data;
    } catch (error: any) {
        return rejectWithValue(error?.message || "Failed to fetch course modules");
    }
});

// CREATE
export const createCourseModule = createAsyncThunk<
    { success: boolean; courseModule: CourseModuleResponseDto },
    CourseModuleDto,
    { dispatch: AppDispatch; state: RootState; rejectValue: string }
>("courseModules/create", async (dto, { rejectWithValue }) => {
    try {
        const response = await api.post<ApiWrapper<CourseModuleResponseDto>>(
            API_ENDPOINTS.COURSE_MODULES.POST_CREATE,
            dto,
            { withCredentials: true }
        );

        const created = mapResponse<CourseModuleResponseDto>(response);
        if (!created) return rejectWithValue("Failed to create course module");

        return { success: true, courseModule: created };
    } catch (error: any) {
        return rejectWithValue(error?.message || "Failed to create course module");
    }
});

// UPDATE
export const updateCourseModule = createAsyncThunk<
    { success: boolean; courseModule: CourseModuleResponseDto },
    { id: number; data: CourseModuleDto },
    { dispatch: AppDispatch; state: RootState; rejectValue: string }
>("courseModules/update", async ({ id, data }, { rejectWithValue, getState }) => {
    try {
        const response = await api.put<ApiWrapper<CourseModuleResponseDto>>(
            `${API_ENDPOINTS.COURSE_MODULES.PUT_UPDATE}/${id}`,
            data,
            { withCredentials: true }
        );

        const res = response as ApiWrapper<CourseModuleResponseDto>;

        if (!res.success) return rejectWithValue(res.message || "Failed to update course module");

        let updatedModule: CourseModuleResponseDto;

        if (res.data) {
            updatedModule = res.data;
        } else {
            const state = getState();
            const existing = state.courseModules.courseModules.find(
                (cm: CourseModuleResponseDto) => cm.courseModuleId === id
            );

            if (!existing) return rejectWithValue("Updated course module not found locally");

            updatedModule = {
                ...existing,
                ...data,
                courseModuleId: id,
                updatedAt: new Date().toISOString(),
            };
        }

        return { success: true, courseModule: updatedModule };
    } catch (error: any) {
        return rejectWithValue(error?.message || "Failed to update course module");
    }
});

// DELETE
export const deleteCourseModule = createAsyncThunk<
    { success: boolean; id: number },
    number,
    { dispatch: AppDispatch; state: RootState; rejectValue: string }
>("courseModules/delete", async (id, { rejectWithValue }) => {
    try {
        const response = await api.delete<ApiWrapper<any>>(
            `${API_ENDPOINTS.COURSE_MODULES.DELETE}/${id}`,
            { withCredentials: true }
        );

        if (!response.success) return rejectWithValue(response.message || "Failed to delete");

        return { success: true, id };
    } catch (error: any) {
        return rejectWithValue(error?.message || "Failed to delete course module");
    }
});

// --------------------
// Dropdowns for Forms
// --------------------

// Fetch courses for dropdown
export const fetchCoursesDropdown = createAsyncThunk<
    Course[],
    void,
    { dispatch: AppDispatch; state: RootState; rejectValue: string }
>("courseModules/fetchCoursesDropdown", async (_, { rejectWithValue }) => {
    try {
        const response = await api.get<ApiWrapper<Course[]>>(
            API_ENDPOINTS.COURSES.GET_LIST,
            { withCredentials: true }
        );

        const data = mapResponse<Course[]>(response);
        if (!data) return rejectWithValue("No courses found for dropdown");

        return data;
    } catch (error: any) {
        return rejectWithValue(error?.message || "Failed to fetch courses for dropdown");
    }
});

// Fetch modules for dropdown
export const fetchModulesDropdown = createAsyncThunk<
    ModuleResponseDto[],
    void,
    { dispatch: AppDispatch; state: RootState; rejectValue: string }
>("courseModules/fetchModulesDropdown", async (_, { rejectWithValue }) => {
    try {
        const response = await api.get<ApiWrapper<ModuleResponseDto[]>>(
            API_ENDPOINTS.MODULES.GET_LIST,
            { withCredentials: true }
        );

        const data = mapResponse<ModuleResponseDto[]>(response);
        if (!data) return rejectWithValue("No modules found for dropdown");

        return data;
    } catch (error: any) {
        return rejectWithValue(error?.message || "Failed to fetch modules for dropdown");
    }
});

// --------------------
// Course-wise modules for dropdown (cascading)
// --------------------

export const fetchModulesByCourse = createAsyncThunk<
    CourseModuleResponseDto[],
    number,
    { dispatch: AppDispatch; state: RootState; rejectValue: string }
>("courseModules/fetchModulesByCourse", async (courseId, { rejectWithValue }) => {
    try {
        const response = await api.get<ApiWrapper<CourseModuleResponseDto[]>>(
            `${API_ENDPOINTS.COURSE_MODULES.GET_BY_COURSE}/${courseId}`,
            { withCredentials: true }
        );

        const data = mapResponse<CourseModuleResponseDto[]>(response);
        if (!data) return rejectWithValue("No modules found for selected course");

        return data;
    } catch (error: any) {
        return rejectWithValue(error?.message || "Failed to fetch modules by course");
    }
});

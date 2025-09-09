import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "@/lib/store";
import {
    CourseCategoryDto,
    CourseCategoryResponseDto,
    CourseCategoryTreeDto,
    ApiResponse
} from './courseCategoryTypes';
import API_ENDPOINTS from "@/lib/config/apiConfig";
import api from "@/lib/services/apiService";

// Create a typed version of the api client that knows about your response structure
interface TypedApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string | null;
    errors?: Record<string, string[]> | null;
}

// Helper to handle API response structure
const handleApiResponse = <T>(response: any): T | null => {
    if (Array.isArray(response)) {
        return response as T;
    }

    if (response && typeof response === 'object' && 'success' in response) {
        if (response.success) {
            // If data is null, return empty object instead of null
            return (response.data ?? {}) as T;
        }
        return null;
    }

    return response as T;
};


export const fetchCourseCategories = createAsyncThunk<
    CourseCategoryResponseDto[],
    number | null | undefined,
    { dispatch: AppDispatch; state: RootState; rejectValue: string }
>(
    'courseCategories/fetchCourseCategories',
    async (firmId, { rejectWithValue }) => {
        try {
            const queryParams = new URLSearchParams();
            if (firmId) {
                queryParams.append('firmId', firmId.toString());
            }

            const response = await api.get<TypedApiResponse<CourseCategoryResponseDto[]>>(
                `${API_ENDPOINTS.COURSE_CATEGORIES.GET_LIST}?${queryParams}`,
                { withCredentials: true }
            );

            console.log("Categories response:", response);

            const categories = handleApiResponse<CourseCategoryResponseDto[]>(response);

            if (!categories) {
                return rejectWithValue('No categories data received');
            }

            return categories;

        } catch (error: any) {
            console.error('Fetch course categories error:', error);

            if (error.status === 401) {
                return rejectWithValue('SESSION_EXPIRED');
            }

            if (error.message) {
                return rejectWithValue(error.message);
            }

            return rejectWithValue('An unknown error occurred');
        }
    }
);

export const fetchCourseCategoryTree = createAsyncThunk<
    CourseCategoryTreeDto[],
    number | null | undefined,
    { dispatch: AppDispatch; state: RootState; rejectValue: string }
>(
    'courseCategories/fetchCourseCategoryTree',
    async (firmId, { rejectWithValue }) => {
        try {
            const queryParams = new URLSearchParams();
            if (firmId) {
                queryParams.append('firmId', firmId.toString());
            }

            const response = await api.get<TypedApiResponse<CourseCategoryTreeDto[]>>(
                `${API_ENDPOINTS.COURSE_CATEGORIES.GET_TREE}?${queryParams}`,
                { withCredentials: true }
            );

            console.log("Tree response:", response);

            const treeData = handleApiResponse<CourseCategoryTreeDto[]>(response);

            if (!treeData) {
                return rejectWithValue('No tree data received');
            }

            return treeData;

        } catch (error: any) {
            console.error('Fetch course category tree error:', error);

            if (error.status === 401) {
                return rejectWithValue('SESSION_EXPIRED');
            }

            if (error.message) {
                return rejectWithValue(error.message);
            }

            return rejectWithValue('An unknown error occurred');
        }
    }
);

export const fetchCourseCategoryById = createAsyncThunk<
    CourseCategoryResponseDto,
    number,
    { dispatch: AppDispatch; state: RootState; rejectValue: string }
>(
    'courseCategories/fetchCourseCategoryById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get<TypedApiResponse<CourseCategoryResponseDto>>(
                `${API_ENDPOINTS.COURSE_CATEGORIES.GET_BY_ID}/${id}`,
                { withCredentials: true }
            );

            console.log("Category by ID response:", response);

            const category = handleApiResponse<CourseCategoryResponseDto>(response);

            if (!category) {
                return rejectWithValue('Category not found');
            }

            return category;

        } catch (error: any) {
            console.error('Fetch course category by ID error:', error);

            if (error.status === 401) {
                return rejectWithValue('SESSION_EXPIRED');
            }

            if (error.message) {
                return rejectWithValue(error.message);
            }

            return rejectWithValue('An unknown error occurred');
        }
    }
);

export const createCourseCategory = createAsyncThunk<
    {
        success: boolean;
        message: string;
        error: string | null;
        errors: Record<string, string[]> | null;
        category: CourseCategoryResponseDto;
    },
    CourseCategoryDto,
    { dispatch: AppDispatch; state: RootState; rejectValue: string }
>(
    'courseCategories/createCourseCategory',
    async (categoryDto, { rejectWithValue }) => {
        try {
            const response = await api.post<TypedApiResponse<CourseCategoryResponseDto>>(
                API_ENDPOINTS.COURSE_CATEGORIES.POST_CREATE,
                categoryDto,
                {
                    withCredentials: true,
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            console.log("Create category response:", response);

            const createdCategory = handleApiResponse<CourseCategoryResponseDto>(response);

            if (!createdCategory) {
                return rejectWithValue('Failed to create category');
            }

            return {
                success: true,
                message: 'Category created successfully',
                error: null,
                errors: null,
                category: createdCategory
            };

        } catch (error: any) {
            console.error('Create category error:', error);

            if (error.status === 401) {
                return rejectWithValue('SESSION_EXPIRED');
            }

            if (error.message) {
                return rejectWithValue(error.message);
            }

            return rejectWithValue('An unknown error occurred');
        }
    }
);

export const updateCourseCategory = createAsyncThunk<
    {
        success: boolean;
        message: string;
        error: string | null;
        errors: Record<string, string[]> | null;
        category: CourseCategoryResponseDto;
    },
    { id: number; data: CourseCategoryDto },
    { dispatch: AppDispatch; state: RootState; rejectValue: string }
>(
    'courseCategories/updateCourseCategory',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await api.put<TypedApiResponse<CourseCategoryResponseDto>>(
                `${API_ENDPOINTS.COURSE_CATEGORIES.PUT_UPDATE}/${id}`,
                data,
                {
                    withCredentials: true,
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            console.log("Update category response:", response);
            

            const updatedCategory = handleApiResponse<CourseCategoryResponseDto>(response);

            if (!updatedCategory) {
                return rejectWithValue('Failed to update category');
            }

            return {
                success: true,
                message: 'Category updated successfully',
                error: null,
                errors: null,
                category: updatedCategory
            };

        } catch (error: any) {
            console.error('Update category error:', error);

            if (error.status === 401) {
                return rejectWithValue('SESSION_EXPIRED');
            }

            if (error.message) {
                return rejectWithValue(error.message);
            }

            return rejectWithValue('An unknown error occurred');
        }
    }
);

export const deleteCourseCategory = createAsyncThunk<
    {
        success: boolean;
        message: string;
        id: number;
    },
    number,
    { dispatch: AppDispatch; state: RootState; rejectValue: string }
>(
    'courseCategories/deleteCourseCategory',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.delete(
                `${API_ENDPOINTS.COURSE_CATEGORIES.DELETE}/${id}`,
                { withCredentials: true }
            );

            console.log("Delete category response:", response);

            // Use the handleApiResponse helper to properly extract the response
            const deleteResponse = handleApiResponse<{ success: boolean; message?: string }>(response);

            // For delete operations, check the success flag
            if (!deleteResponse || deleteResponse.success === false) {
                return rejectWithValue(deleteResponse?.message || 'Failed to delete category');
            }

            return {
                success: true,
                message: deleteResponse.message || 'Category deleted successfully',
                id
            };

        } catch (error: any) {
            console.error('Delete category error:', error);

            if (error.status === 401) {
                return rejectWithValue('SESSION_EXPIRED');
            }

            if (error.message) {
                return rejectWithValue(error.message);
            }

            return rejectWithValue('An unknown error occurred');
        }
    }
);
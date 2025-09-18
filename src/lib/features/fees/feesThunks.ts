import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "@/lib/store";
import API_ENDPOINTS from "@/lib/config/apiConfig";
import api from "@/lib/services/apiService";

// Types
export interface CourseFee {
    courseFeeId: number;
    courseId: number;
    courseName: string | null; // Allow null
    totalInstallments: number;
    feeAmount: number;
    gstPercentage: number;
    totalFee: number;
    createdAt: string;
    updatedAt?: string | null; // Allow null
    branchId?: number | null; // Allow null
    branchName?: string | null; // Allow null
    branchCode?: string | null; // Allow null
}
export interface CourseFeeDto {
    courseFeeId?: number;
    courseId: number;
    branchId?: number;
    totalInstallments: number;
    feeAmount: number;
    gstPercentage: number;
}

// Different response types for different endpoints
export interface CourseFeeListResponse {
    success: boolean;
    message: string;
    data: CourseFee[]; // Array for list endpoint
    error?: string | null;
    errors?: Record<string, string[]> | null;
}

export interface CourseFeeSingleResponse {
    success: boolean;
    message: string;
    data: CourseFee; // Single object for single item endpoints
    error?: string | null;
    errors?: Record<string, string[]> | null;
}

export interface FetchCourseFeesParams {
    courseId?: number;
}

// Thunks
export const fetchCourseFees = createAsyncThunk<
    CourseFee[],
    FetchCourseFeesParams | undefined,
    { dispatch: AppDispatch; state: RootState; rejectValue: string }
>(
    'courseFees/fetchCourseFees',
    async (params, { rejectWithValue }) => {
        try {
            console.log('Fetching course fees with params:', params);

            const queryParams = new URLSearchParams();
            if (params?.courseId) {
                queryParams.append('courseId', params.courseId.toString());
            }

            const queryString = queryParams.toString();
            const url = queryString
                ? `${API_ENDPOINTS.COURSE_FEES.GET_LIST}?${queryString}`
                : API_ENDPOINTS.COURSE_FEES.GET_LIST;

            console.log('API URL:', url);

            const response = await api.get<CourseFee[]>( // Change the generic type
                url,
                { withCredentials: true }
            );

            console.log('Full API Response:', response);
            console.log('Response data:', response.data);
            console.log('Is array:', Array.isArray(response.data));

            // If response.data is directly the array, just return it
            if (Array.isArray(response.data)) {
                console.log('Returning array data:', response.data);
                return response.data;
            } else {
                console.log('Unexpected response format:', response.data);
                return rejectWithValue('Unexpected response format from server');
            }

        } catch (error) {
            console.error('Fetch course fees error:', error);
            if (error instanceof Error) {
                return rejectWithValue(
                    error.message.includes('401') ? 'SESSION_EXPIRED' : error.message
                );
            }
            return rejectWithValue('An unknown error occurred');
        }
    }
);  


export const fetchCourseFeeById = createAsyncThunk<
    CourseFee,
    number,
    { dispatch: AppDispatch; state: RootState; rejectValue: string }
>(
    'courseFees/fetchCourseFeeById',
    async (courseFeeId, { rejectWithValue }) => {
        try {
            const response = await api.get<CourseFeeSingleResponse>(
                `${API_ENDPOINTS.COURSE_FEES.GET_BY_ID}/${courseFeeId}`,
                { withCredentials: true }
            );

            if (!response.data.success) {
                return rejectWithValue(response.data.error || 'Course fee not found');
            }

            return response.data.data;

        } catch (error) {
            console.error('Fetch course fee by ID error:', error);
            if (error instanceof Error) {
                return rejectWithValue(
                    error.message.includes('401') ? 'SESSION_EXPIRED' : error.message
                );
            }
            return rejectWithValue('An unknown error occurred');
        }
    }
);

// Define the expected API response shape
interface ApiResponse<T> {
    success: boolean;
    message: string;
    error: string | null;
    errors: Record<string, string[]> | null;
    data: T | null;
}



export const createCourseFee = createAsyncThunk<
    {
        success: boolean;
        message: string;
        error: string | null;
        errors: Record<string, string[]> | null;
        courseFee: CourseFee | null;
    },
    CourseFeeDto,
    { dispatch: AppDispatch; state: RootState; rejectValue: string }
>(
    "courseFees/createCourseFee",
    async (courseFeeDto, { rejectWithValue }) => {
        try {
            const response: ApiResponse<CourseFee> = await api.post(
                API_ENDPOINTS.COURSE_FEES.POST_CREATE,
                courseFeeDto,
                {
                    withCredentials: true,
                    headers: { "Content-Type": "application/json" },
                }
            );

            if (response.success) {
                return {
                    success: true,
                    message: response.message,
                    error: null,
                    errors: null,
                    courseFee: response.data, // ✅ this is CourseFee
                };
            } else {
                const errorMessage =
                    response.message || response.error || "Failed to create course fee";
                return rejectWithValue(errorMessage);
            }
        } catch (error: any) {
            return rejectWithValue(
                error.message || "An unknown error occurred"
            );
        }
    }
);



export const updateCourseFee = createAsyncThunk<
    {
        success: boolean;
        message: string;
        error: string | null;
        errors: Record<string, string[]> | null;
        courseFee: CourseFee | null;
    },
    CourseFeeDto,
    { dispatch: AppDispatch; state: RootState; rejectValue: string }
>(
    "courseFees/updateCourseFee",
    async (courseFeeDto, { rejectWithValue }) => {
        try {
            if (!courseFeeDto.courseFeeId) {
                return rejectWithValue("Course fee ID is required for update");
            }

            const response: ApiResponse<CourseFee> = await api.put(
                `${API_ENDPOINTS.COURSE_FEES.PUT_UPDATE}/${courseFeeDto.courseFeeId}`,
                courseFeeDto,
                {
                    withCredentials: true,
                    headers: { "Content-Type": "application/json" },
                }
            );

            if (response.success) {
                return {
                    success: true,
                    message: response.message || "Course fee updated successfully",
                    error: null,
                    errors: null,
                    courseFee: response.data, // ✅ Updated CourseFee from API
                };
            } else {
                const errorMessage =
                    response.message ||
                    response.error ||
                    "Failed to update course fee";
                return rejectWithValue(errorMessage);
            }
        } catch (error: any) {
            console.error("Update course fee error:", error);

            if (error.response?.data) {
                const err: ApiResponse<null> = error.response.data;
                return rejectWithValue(
                    err.message || err.error || "Server responded with an error"
                );
            }

            if (error.message) {
                return rejectWithValue(
                    error.message.includes("401") ? "SESSION_EXPIRED" : error.message
                );
            }

            return rejectWithValue("An unknown error occurred");
        }
    }
);



export const deleteCourseFee = createAsyncThunk<
    {
        success: boolean;
        message: string;
        id: number;
    },
    number,
    { dispatch: AppDispatch; state: RootState; rejectValue: string }
>(
    'courseFees/deleteCourseFee',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.delete<CourseFeeSingleResponse>(
                `${API_ENDPOINTS.COURSE_FEES.DELETE}/${id}`,
                { withCredentials: true }
            );

            if (!response.data.success) {
                return rejectWithValue(response.data.error || 'Failed to delete course fee');
            }

            return {
                success: true,
                message: 'Course fee deleted successfully',
                id
            };

        } catch (error: any) {
            console.error('Delete course fee error:', error);

            if (error.response?.data) {
                return rejectWithValue(
                    error.response.data.error ||
                    error.response.data.message ||
                    'Server responded with an error'
                );
            }

            if (error.message) {
                return rejectWithValue(
                    error.message.includes('401') ? 'SESSION_EXPIRED' : error.message
                );
            }

            return rejectWithValue('An unknown error occurred');
        }
    }
);  
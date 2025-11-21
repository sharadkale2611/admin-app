import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "@/lib/store";
import API_ENDPOINTS from "@/lib/config/apiConfig";
import { api } from "@/lib/services/apiService";

// Define the expected API response shape that matches your actual API
interface ApiResponse<T> {
    success: boolean;
    message: string;
    error: string | null;
    errors: Record<string, string[]> | null;
    data: T;
}

// Types
export interface CourseFee {
    courseFeeId: number;
    courseId: number;
    courseName: string | null;
    totalInstallments: number;
    feeAmount: number;
    gstPercentage: number;
    totalFee: number;
    createdAt: string;
    updatedAt?: string | null;
    branchId?: number | null;
    branchName?: string | null;
    branchCode?: string | null;
}

export interface CourseFeeDto {
    courseFeeId?: number;
    courseId: number;
    branchId?: number;
    totalInstallments: number;
    feeAmount: number;
    gstPercentage: number;
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

            const response = await api.get<ApiResponse<CourseFee[]>>(
                url,
                { withCredentials: true }
            );

            console.log('API Response:', response);

            if (response.success && Array.isArray(response.data)) {
                console.log('Returning array data:', response.data);
                return response.data;
            } else {
                console.log('Unexpected response format:', response);
                return rejectWithValue(response.message || 'Unexpected response format from server');
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




export const fetchCourseFeesByFirm = createAsyncThunk<
    CourseFee[],
    number, // firmId
    { dispatch: AppDispatch; state: RootState; rejectValue: string }
>(
    "courseFees/fetchCourseFeesByFirm",
    async (firmId, { rejectWithValue }) => {
        try {
            const url = `${API_ENDPOINTS.COURSE_FEES.GET_BY_FIRM}?firmId=${firmId}`;

            console.log("Fetching fees by firm:", url);

            const response = await api.get<ApiResponse<CourseFee[]>>(url, {
                withCredentials: true,
            });

            // Must return ONLY the array (CourseFee[])
            if (response.success && Array.isArray(response.data)) {
                return response.data;
            }

            return rejectWithValue(
                response.error ||
                response.message ||
                "Failed to fetch fees by firm"
            );

        } catch (error: any) {
            return rejectWithValue(error.message || "Unknown error");
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
            const response = await api.get<CourseFee>(
                `${API_ENDPOINTS.COURSE_FEES.GET_BY_ID}/${courseFeeId}`,
                { withCredentials: true }
            );

            console.log('Course fee response:', response);

            if (!response.success) {
                return rejectWithValue(response.error || 'Course fee not found');
            }

            if (!response.data) {
                return rejectWithValue('Course fee data is missing');
            }

            return response.data;

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

export const createCourseFee = createAsyncThunk<
    CourseFee,
    CourseFeeDto,
    { dispatch: AppDispatch; state: RootState; rejectValue: string }
>(
    "courseFees/createCourseFee",
    async (courseFeeDto, { rejectWithValue }) => {
        try {
            const response = await api.post<CourseFee>(
                API_ENDPOINTS.COURSE_FEES.POST_CREATE,
                courseFeeDto,
                {
                    withCredentials: true,
                    headers: { "Content-Type": "application/json" },
                }
            );

            if (response.success && response.data) {
                return response.data;
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
    CourseFee| null | boolean,
    CourseFeeDto,
    { dispatch: AppDispatch; state: RootState; rejectValue: string }
>(
    "courseFees/updateCourseFee",
    async (courseFeeDto, { rejectWithValue }) => {
        if (!courseFeeDto.courseFeeId) {
            return rejectWithValue("Course fee ID is required for update");
        }

        try {
            const response = await api.put<CourseFee>(
                `${API_ENDPOINTS.COURSE_FEES.PUT_UPDATE}/${courseFeeDto.courseFeeId}`,
                courseFeeDto,
                { withCredentials: true, headers: { "Content-Type": "application/json" } }
            );

            if (response.success) {
                return true;
            } else {
                return rejectWithValue(response.message || response.error || "Failed to update course fee");
            }

        } catch (error: any) {
            const message = error.message?.includes("401") ? "SESSION_EXPIRED" : error.message || "An unknown error occurred";
            return rejectWithValue(message);
        }
    }
);


export const deleteCourseFee = createAsyncThunk<
    number,
    number,
    { dispatch: AppDispatch; state: RootState; rejectValue: string }
>(
    'courseFees/deleteCourseFee',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.delete<ApiResponse<null>>(
                `${API_ENDPOINTS.COURSE_FEES.DELETE}/${id}`,
                { withCredentials: true }
            );

            if (!response.success) {
                return rejectWithValue(response.error || 'Failed to delete course fee');
            }

            return id;

        } catch (error: any) {
            console.error('Delete course fee error:', error);

            if (error.status && error.message) {
                return rejectWithValue(error.message);
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
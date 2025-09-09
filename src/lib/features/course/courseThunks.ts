import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "@/lib/store";
import {
    Course,
    CreateCourseDto,
    UpdateCourseDto,
    PaginatedCourses,
    ApiResponse,
    FetchCoursesParams,
    CourseLevel
} from './courseTypes';
import API_ENDPOINTS from "@/lib/config/apiConfig";
import api from "@/lib/services/apiService";

export const fetchCourses = createAsyncThunk<
    PaginatedCourses,
    FetchCoursesParams,
    { dispatch: AppDispatch; state: RootState; rejectValue: string }
>(
    'courses/fetchCourses',
    async ({
        page = 1,
        searchTerm = '',
        status = null,
        courseLevel = null,
        categoryId = null
    }, { rejectWithValue }) => {
        try {
            const queryParams = new URLSearchParams({
                pageNumber: page.toString(),
                pageSize: '10',
                ...(searchTerm && { search: searchTerm }),
                ...(status !== null && { status: status.toString() }),
                ...(courseLevel && { courseLevel }),
                ...(categoryId && { categoryId: categoryId.toString() }),
                _: Date.now().toString()
            }).toString();

            const response = await api.get<PaginatedCourses>(
                `${API_ENDPOINTS.COURSES.GET_LIST_PAGINATED}?${queryParams}`,
                { withCredentials: true }
            );

            return response.data;

        } catch (error) {
            console.error('Fetch courses error:', error);
            if (error instanceof Error) {
                return rejectWithValue(
                    error.message.includes('401') ? 'SESSION_EXPIRED' : error.message
                );
            }
            return rejectWithValue('An unknown error occurred');
        }
    }
);

export const fetchCourseById = createAsyncThunk<
    Course,
    number,
    { dispatch: AppDispatch; state: RootState; rejectValue: string }
>(
    'courses/fetchCourseById',
    async (courseId, { rejectWithValue }) => {
        try {
            const response = await api.get<Course>(
                `${API_ENDPOINTS.COURSES.GET_BY_ID}/${courseId}`,
                { withCredentials: true }
            );

            if (!response.data) {
                return rejectWithValue('Course not found');
            }

            return response.data;

        } catch (error) {
            console.error('Fetch course by ID error:', error);
            if (error instanceof Error) {
                return rejectWithValue(
                    error.message.includes('401') ? 'SESSION_EXPIRED' : error.message
                );
            }
            return rejectWithValue('An unknown error occurred');
        }
    }
);

export const createCourse = createAsyncThunk<
    {
        success: boolean;
        message: string;
        error: string | null;
        errors: Record<string, string[]> | null;
        course: Course;
    },
    CreateCourseDto,
    { dispatch: AppDispatch; state: RootState; rejectValue: string }
>(
    'courses/createCourse',
    async (createCourseDto, { rejectWithValue }) => {
        try {
            const response = await api.post<Course>(
                API_ENDPOINTS.COURSES.POST_CREATE,
                createCourseDto,
                {
                    withCredentials: true,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
            console.log('response from thunk', response);
            
            if (!response?.data) {
                return rejectWithValue('No response data from server');
            }
            

            return {
                success: true,
                message: 'Course created successfully',
                error: null,
                errors: null,
                course: response.data
            };

        } catch (error: any) {
            if (error.response) {
                return rejectWithValue(
                    error.response.data?.error ||
                    error.response.data?.message ||
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

// lib/features/courses/courseThunks.ts
export const updateCourse = createAsyncThunk<
    {
        success: boolean;
        message: string;
        error: string | null;
        errors: Record<string, string[]> | null;
        course: Course;
    },
    UpdateCourseDto,
    { dispatch: AppDispatch; state: RootState; rejectValue: string }
>(
    'courses/updateCourse',
    async (updateCourseDto, { rejectWithValue }) => {
        try {
            const response = await api.put(
                `${API_ENDPOINTS.COURSES.PUT_UPDATE}/${updateCourseDto.id}`,
                updateCourseDto,
                {
                    withCredentials: true,
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            // Fetch the updated course to get complete data
            const courseResponse = await api.get<Course>(
                `${API_ENDPOINTS.COURSES.GET_BY_ID}/${updateCourseDto.id}`,
                { withCredentials: true }
            );

            return {
                success: true,
                message: 'Course updated successfully',
                error: null,
                errors: null,
                course: courseResponse.data
            };

        } catch (error: any) {
            console.error('Update course error:', error);

            if (error.response?.data) {
                const errorData = error.response.data;
                return rejectWithValue(
                    errorData.error || errorData.message || 'Server responded with an error'
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


export const deleteCourse = createAsyncThunk<
    {
        success: boolean;
        message: string;
        id: number;
    },
    number,
    { dispatch: AppDispatch; state: RootState; rejectValue: string }
>(
    'courses/deleteCourse',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(
                `${API_ENDPOINTS.COURSES.DELETE}/${id}`,
                { withCredentials: true }
            );

            return {
                success: true,
                message: 'Course deleted successfully',
                id
            };

        } catch (error: any) {
            if (error.response) {
                return rejectWithValue(
                    error.response.data?.error ||
                    error.response.data?.message ||
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
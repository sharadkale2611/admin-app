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


export const fetchCoursesListOptions = createAsyncThunk<
  Course[],
  void,
  { rejectValue: string }
>("courses/fetchCoursesList", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get(`${API_ENDPOINTS.COURSES.GET_LIST}`, {
      withCredentials: true,
    });
    
    if (!response.success || !Array.isArray(response.data)) {
      return rejectWithValue("No courses found");
    }

    return response.data; 
  } catch (error: any) {
    return rejectWithValue(error.message || "An error occurred");
  }
});



export const fetchCoursesList = createAsyncThunk<
    Course[],
    { searchTerm?: string } | void,
    { dispatch: AppDispatch; state: RootState; rejectValue: string }
>(
    'courses/fetchCoursesList',
    async (params, { rejectWithValue }) => {
        try {
            const queryParams = new URLSearchParams({
                ...(params?.searchTerm && { search: params.searchTerm }),
                _: Date.now().toString()
            }).toString();

            const response = await api.get<Course[]>(
                `${API_ENDPOINTS.COURSES.GET_LIST}?${queryParams}`, // ✅ backend should expose list endpoint
                { withCredentials: true }
            );

            if (!response?.data) {
                return rejectWithValue('No courses found');
            }

            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.message?.includes('401') ? 'SESSION_EXPIRED' : error.message || 'An error occurred'
            );
        }
    }
);


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
        categoryId = null,
        firmId
    }, { rejectWithValue }) => {
        try {

            const queryObj: Record<string, string> = {
            pageNumber: page.toString(),
            pageSize: '10',
            _: Date.now().toString(),
        };

        // Add filters
        if (searchTerm) queryObj.search = searchTerm;
        if (status !== null) queryObj.status = status.toString();
        if (courseLevel) queryObj.courseLevel = courseLevel;
        if (categoryId !== null) queryObj.categoryId = categoryId.toString();

        // ⭐ Add firmId
        if (firmId !== null && firmId !== undefined) {
            queryObj.firmId = firmId.toString();
        }

            // Now convert to query string
            const queryString = new URLSearchParams(queryObj).toString();

            const response = await api.get<PaginatedCourses>(
                `${API_ENDPOINTS.COURSES.GET_LIST_PAGINATED}?${queryString}`,
                { withCredentials: true }
            );
                
            if (!response?.data) {
                return rejectWithValue('No response data from server');
            }            

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
            await api.put(
                `${API_ENDPOINTS.COURSES.PUT_UPDATE}/${updateCourseDto.id}`,
                updateCourseDto,
                {
                    withCredentials: true,
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            // Fetch updated course
            const courseResponse = await api.get<Course>(
                `${API_ENDPOINTS.COURSES.GET_BY_ID}/${updateCourseDto.id}`,
                { withCredentials: true }
            );

            if (!courseResponse?.data) {
                return rejectWithValue('Updated course not found');
            }

            return {
                success: true,
                message: 'Course updated successfully',
                error: null,
                errors: null,
                course: courseResponse.data, // ✅ guaranteed Course
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
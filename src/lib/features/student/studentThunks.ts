import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "@/lib/store";
import {
    Student,
    CreateStudentDto,
    UpdateStudentDto,
    PaginatedStudent,
    ApiResponse,
    FetchStudentParams
} from './studentTypes';
import API_ENDPOINTS from "@/lib/config/apiConfig";
import api from "@/lib/services/apiService";

export const fetchStudents = createAsyncThunk<
    PaginatedStudent,
    FetchStudentParams,
    { dispatch: AppDispatch; state: RootState; rejectValue: string }
>(
    'students/fetchStudents',
    async ({
        page = 1,
        searchTerm = '',
        activeOnly = true
    }, { rejectWithValue }) => {
        try {
            const query = new URLSearchParams({
                page: page.toString(),
                search: searchTerm,
                activeOnly: activeOnly.toString(),
                _: Date.now().toString()
            }).toString();

            const response = await api.get<PaginatedStudent>(
                `${API_ENDPOINTS.STUDENT.GET_LIST_PAGINATED}?${query}`,
                { withCredentials: true }
            );

            return response.data;

        } catch (error) {
            console.error('Fetch students error:', error);
            if (error instanceof Error) {
                return rejectWithValue(
                    error.message.includes('401') ? 'SESSION_EXPIRED' : error.message
                );
            }
            return rejectWithValue('An unknown error occurred');
        }
    }
);

export const createStudent = createAsyncThunk<
    {
        success: boolean;
        message: string;
        error: string | null;
        errors: Record<string, string[]> | null;
        student: Student;
    },
    CreateStudentDto,
    { dispatch: AppDispatch; state: RootState; rejectValue: string }
>(
    'students/createStudent',
    async (createStudentDto, { rejectWithValue }) => {
        try {
            const response = await api.post<Student>(
                API_ENDPOINTS.STUDENT.POST_CREATE,
                createStudentDto,
                {
                    withCredentials: true,
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            if (!response?.data) {
                return rejectWithValue('No response data from server');
            }

            return {
                success: true,
                message: 'Student created successfully',
                error: null,
                errors: null,
                student: response.data
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

export const updateStudent = createAsyncThunk<
    {
        success: boolean;
        message: string;
        error: string | null;
        errors: Record<string, string[]> | null;
        student: Student;
    },
    UpdateStudentDto,
    { dispatch: AppDispatch; state: RootState; rejectValue: string }
>(
    'students/updateStudent',
    async (updateStudentDto, { rejectWithValue, getState }) => {
        try {
            const response = await api.put<ApiResponse<Student | null>>(
                `${API_ENDPOINTS.STUDENT.PUT_UPDATE}/${updateStudentDto.id}`,
                updateStudentDto,
                {
                    withCredentials: true,
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            const strResponse = JSON.stringify(response);
            const objResponse = JSON.parse(strResponse);

            if (!objResponse || !objResponse.success) {
                return rejectWithValue('No response data from server');
            }

            if (!objResponse.success) {
                return rejectWithValue(
                    objResponse.error ||
                    objResponse.message ||
                    'Update operation failed'
                );
            }

            try {
                const studentResponse = await api.get<ApiResponse<Student>>(
                    `${API_ENDPOINTS.STUDENT.GET_BY_ID}/${updateStudentDto.id}`,
                    { withCredentials: true }
                );

                if (studentResponse.data && studentResponse.data.data) {
                    return {
                        success: true,
                        message: objResponse.message || 'Student updated successfully',
                        error: null,
                        errors: null,
                        student: studentResponse.data.data
                    };
                }
            } catch (fetchError) {
                console.warn('Could not fetch updated student data:', fetchError);
            }

            const state = getState() as RootState;
            const existingStudent = state.students.currentStudent ||
                state.students.students.find(s => s.studentId === updateStudentDto.id);

            if (!existingStudent) {
                return rejectWithValue('Could not find student data to update');
            }

            return {
                success: true,
                message: objResponse.message || 'Student updated successfully',
                error: null,
                errors: null,
                student: {
                    ...existingStudent,
                    ...updateStudentDto,
                    studentId: updateStudentDto.id,
                    updatedAt: new Date().toISOString()
                } as Student
            };

        } catch (error: any) {
            console.error('Update student error:', error);

            if (error.response?.data) {
                const errorData = error.response.data;
                if (typeof errorData === 'object') {
                    return rejectWithValue(
                        errorData.error ||
                        errorData.message ||
                        'Server responded with an error'
                    );
                }
                return rejectWithValue('Server responded with an error');
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

export const deleteStudent = createAsyncThunk<
    {
        success: boolean;
        message: string;
        id: string;
    },
    string,
    { dispatch: AppDispatch; state: RootState; rejectValue: string }
>(
    'students/deleteStudent',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(
                `${API_ENDPOINTS.STUDENT.DELETE}/${id}`,
                { withCredentials: true }
            );

            return {
                success: true,
                message: 'Student deleted successfully',
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

export const fetchStudentById = createAsyncThunk<
    Student,
    string,
    { dispatch: AppDispatch; state: RootState; rejectValue: string }
>(
    'students/fetchStudentById',
    async (studentId, { rejectWithValue }) => {
        try {
            const response = await api.get<Student>(
                `${API_ENDPOINTS.STUDENT.GET_BY_ID}/${studentId}`,
                { withCredentials: true }
            );

            if (!response.data) {
                return rejectWithValue('Student not found');
            }

            return response.data;

        } catch (error) {
            console.error('Fetch student by ID error:', error);
            if (error instanceof Error) {
                return rejectWithValue(
                    error.message.includes('401') ? 'SESSION_EXPIRED' : error.message
                );
            }
            return rejectWithValue('An unknown error occurred');
        }
    }
);
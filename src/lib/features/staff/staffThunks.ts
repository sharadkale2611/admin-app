// lib/features/staff/staffThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "@/lib/store";
import {
    Staff,
    CreateStaffDto,
    UpdateStaffDto,
    PaginatedStaff,
    ApiResponse,
    FetchStaffParams
} from './staffTypes';
import API_ENDPOINTS from "@/lib/config/apiConfig";
import api from "@/lib/services/apiService";

export const fetchStaff = createAsyncThunk<
    PaginatedStaff,
    FetchStaffParams,
    { dispatch: AppDispatch; state: RootState; rejectValue: string }
>(
    'staff/fetchStaff',
    async ({
        page = 1,
        searchTerm = '',
        activeOnly = true,
        department = '',
        position = ''
    }, { rejectWithValue }) => {
        try {
            const query = new URLSearchParams({
                page: page.toString(),
                search: searchTerm,
                activeOnly: activeOnly.toString(),
                ...(department && { department }),
                ...(position && { position }),
                _: Date.now().toString()
            }).toString();

            const response = await api.get<PaginatedStaff>(
                `${API_ENDPOINTS.STAFF.GET_LIST_PAGINATED}?${query}`,
                { withCredentials: true }
            );

            return response.data;

        } catch (error) {
            console.error('Fetch staff error:', error);
            if (error instanceof Error) {
                return rejectWithValue(
                    error.message.includes('401') ? 'SESSION_EXPIRED' : error.message
                );
            }
            return rejectWithValue('An unknown error occurred');
        }
    }
);

export const createStaff = createAsyncThunk<
    {
        success: boolean;
        message: string;
        error: string | null;
        errors: Record<string, string[]> | null;
        staff: Staff;
    },
    CreateStaffDto,
    { dispatch: AppDispatch; state: RootState; rejectValue: string }
>(
    'staff/createStaff',
    async (createStaffDto, { rejectWithValue }) => {
        try {
            const response = await api.post<Staff>(
                API_ENDPOINTS.STAFF.POST_CREATE,
                createStaffDto,
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
                message: 'Staff created successfully',
                error: null,
                errors: null,
                staff: response.data
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



export const updateStaff = createAsyncThunk<
    {
        success: boolean;
        message: string;
        error: string | null;
        errors: Record<string, string[]> | null;
        staff: Staff;
    },
    UpdateStaffDto,
    { dispatch: AppDispatch; state: RootState; rejectValue: string }
>(
    'staff/updateStaff',
    async (updateStaffDto, { rejectWithValue, getState }) => {
        try {
            // First, make the update request
            const response = await api.put<ApiResponse<Staff | null>>(
                `${API_ENDPOINTS.STAFF.PUT_UPDATE}/${updateStaffDto.id}`,
                updateStaffDto,
                {
                    withCredentials: true,
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            const str_response = JSON.stringify(response)
            // console.log("Update response:", JSON.stringify(response));
            const obj_response = JSON.parse(str_response)
            // console.log("Update response 2:", obj_response.success);

            // Check if response and response.data exist
            if (!obj_response || !obj_response.success) {
                return rejectWithValue('No response data from server');
            }

            // Check if the API response indicates success
            if (!obj_response.success) {
                return rejectWithValue(
                    obj_response.error ||
                    obj_response.message ||
                    'Update operation failed'
                );
            }

            // Since the API returns data: null on success, fetch the updated staff data
            try {
                const staffResponse = await api.get<ApiResponse<Staff>>(
                    `${API_ENDPOINTS.STAFF.GET_BY_ID}/${updateStaffDto.id}`,
                    { withCredentials: true }
                );

                console.log("Fetched updated staff:", staffResponse.data);

                if (staffResponse.data && staffResponse.data.data) {
                    return {
                        success: true,
                        message: obj_response.message || 'Staff updated successfully',
                        error: null,
                        errors: null,
                        staff: staffResponse.data.data
                    };
                }
            } catch (fetchError) {
                console.warn('Could not fetch updated staff data:', fetchError);
                // Continue with fallback approach
            }

            // Fallback: Use the update data (some fields might be missing)
            const state = getState() as RootState;
            const existingStaff = state.staff.currentStaff || state.staff.staff.find(s => s.staffId === updateStaffDto.id);

            if (!existingStaff) {
                return rejectWithValue('Could not find staff data to update');
            }

            return {
                success: true,
                message: obj_response.message || 'Staff updated successfully',
                error: null,
                errors: null,
                staff: {
                    ...existingStaff,
                    ...updateStaffDto,
                    staffId: updateStaffDto.id,
                    updatedAt: new Date().toISOString()
                } as Staff
            };

        } catch (error: any) {
            console.error('Update staff error:', error);

            // Handle different error formats
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


export const deleteStaff = createAsyncThunk<
    {
        success: boolean;
        message: string;
        id: string;
    },
    string,
    { dispatch: AppDispatch; state: RootState; rejectValue: string }
>(
    'staff/deleteStaff',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(
                `${API_ENDPOINTS.STAFF.DELETE}/${id}`,
                { withCredentials: true }
            );

            return {
                success: true,
                message: 'Staff deleted successfully',
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


// Update your fetchStaffById thunk
export const fetchStaffById = createAsyncThunk<
    Staff,
    string,
    { dispatch: AppDispatch; state: RootState; rejectValue: string }
>(
    'staff/fetchStaffById',
    async (staffId, { rejectWithValue }) => {
        try {
            const response = await api.get<Staff>( // Change the type to Staff directly
                `${API_ENDPOINTS.STAFF.GET_BY_ID}/${staffId}`,
                { withCredentials: true }
            );
            console.log("response.data: ", response.data);

            if (!response.data) {
                return rejectWithValue('Staff not found');
            }

            return response.data; // Return response.data directly

        } catch (error) {
            console.error('Fetch staff by ID error:', error);
            if (error instanceof Error) {
                return rejectWithValue(
                    error.message.includes('401') ? 'SESSION_EXPIRED' : error.message
                );
            }
            return rejectWithValue('An unknown error occurred');
        }
    }
);
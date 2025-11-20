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
} from "./staffTypes";
import API_ENDPOINTS from "@/lib/config/apiConfig";
import api from "@/lib/services/apiService";

/* ========================================================
    ✅ FETCH STAFF (WITH firmId, filters, pagination)
======================================================== */
export const fetchStaff = createAsyncThunk<
    PaginatedStaff,
    FetchStaffParams,
    { dispatch: AppDispatch; state: RootState; rejectValue: string }
>(
    "staff/fetchStaff",
    async (
        { page, searchTerm, isActive, department, position, pageSize, firmId },
        { rejectWithValue }
    ) => {
        try {
            const queryParams: Record<string, string> = {
                pageNumber: String(page),
                pageSize: String(pageSize),
                search: searchTerm ?? "",
                isActive: String(isActive),
            };

            if (department) queryParams.department = department;
            if (position) queryParams.position = position;
            if (firmId !== null && firmId !== undefined)
                queryParams.firmId = String(firmId);

            const query = new URLSearchParams(queryParams).toString();

            const response = await api.get<PaginatedStaff>(
                `${API_ENDPOINTS.STAFF.GET_LIST_PAGINATED}?${query}`,
                { withCredentials: true }
            );

            if (!response?.data) {
                return rejectWithValue("Invalid server response");
            }

            return response.data;

        } catch (error: any) {
            return rejectWithValue(error.message || "Failed to fetch staff");
        }
    }
);

/* ========================================================
    ✅ CREATE STAFF
======================================================== */
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
    "staff/createStaff",
    async (createStaffDto, { rejectWithValue }) => {
        try {
            const response = await api.post<Staff>(
                API_ENDPOINTS.STAFF.POST_CREATE,
                createStaffDto,
                {
                    withCredentials: true,
                    headers: { "Content-Type": "application/json" }
                }
            );

            if (!response?.data) {
                return rejectWithValue("No response data from server");
            }

            return {
                success: true,
                message: "Staff created successfully",
                error: null,
                errors: null,
                staff: response.data
            };

        } catch (error: any) {
            if (error.response) {
                return rejectWithValue(
                    error.response.data?.error ||
                    error.response.data?.message ||
                    "Server responded with an error"
                );
            }

            return rejectWithValue(
                error.message?.includes("401") ? "SESSION_EXPIRED" : error.message
            );
        }
    }
);

/* ========================================================
    ✅ UPDATE STAFF
======================================================== */
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
    "staff/updateStaff",
    async (updateStaffDto, { rejectWithValue, getState }) => {
        try {
            const response = await api.put<ApiResponse<Staff | null>>(
                `${API_ENDPOINTS.STAFF.PUT_UPDATE}/${updateStaffDto.id}`,
                updateStaffDto,
                {
                    withCredentials: true,
                    headers: { "Content-Type": "application/json" }
                }
            );

            const apiRes = response.data;

            if (!apiRes || !apiRes.success) {
                return rejectWithValue(
                    apiRes?.error || apiRes?.message || "Update failed"
                );
            }

            /* Fetch updated data from API */
            try {
                const updatedRes = await api.get<ApiResponse<Staff>>(
                    `${API_ENDPOINTS.STAFF.GET_BY_ID}/${updateStaffDto.id}`,
                    { withCredentials: true }
                );

                if (updatedRes.data?.data) {
                    return {
                        success: true,
                        message: apiRes.message || "Staff updated successfully",
                        error: null,
                        errors: null,
                        staff: updatedRes.data.data
                    };
                }
            } catch {
                // fallback below
            }

            /* FALLBACK FROM STATE IF API RETURNED NULL */
            const state = getState() as RootState;
            const existing =
                state.staff.currentStaff ||
                state.staff.staff.find(
                    (s: Staff) => s.staffId === updateStaffDto.id
                );

            if (!existing) {
                return rejectWithValue("Could not find staff in state");
            }

            return {
                success: true,
                message: apiRes.message || "Staff updated successfully",
                error: null,
                errors: null,
                staff: {
                    ...existing,
                    ...updateStaffDto,
                    staffId: updateStaffDto.id,
                    updatedAt: new Date().toISOString()
                }
            };

        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.error ||
                error.response?.data?.message ||
                (error.message?.includes("401")
                    ? "SESSION_EXPIRED"
                    : error.message)
            );
        }
    }
);

/* ========================================================
    ✅ DELETE STAFF
======================================================== */
export const deleteStaff = createAsyncThunk<
    { success: boolean; message: string; id: string },
    string,
    { dispatch: AppDispatch; state: RootState; rejectValue: string }
>(
    "staff/deleteStaff",
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`${API_ENDPOINTS.STAFF.DELETE}/${id}`, {
                withCredentials: true
            });

            return {
                success: true,
                message: "Staff deleted successfully",
                id
            };

        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.error ||
                error.response?.data?.message ||
                (error.message?.includes("401")
                    ? "SESSION_EXPIRED"
                    : error.message)
            );
        }
    }
);

/* ========================================================
    ✅ FETCH STAFF BY ID
======================================================== */
export const fetchStaffById = createAsyncThunk<
    Staff,
    string,
    { dispatch: AppDispatch; state: RootState; rejectValue: string }
>(
    "staff/fetchStaffById",
    async (staffId, { rejectWithValue }) => {
        try {
            const response = await api.get<Staff>(
                `${API_ENDPOINTS.STAFF.GET_BY_ID}/${staffId}`,
                { withCredentials: true }
            );

            if (!response.data) {
                return rejectWithValue("Staff not found");
            }

            return response.data;

        } catch (error: any) {
            return rejectWithValue(
                error.message?.includes("401")
                    ? "SESSION_EXPIRED"
                    : error.message
            );
        }
    }
);

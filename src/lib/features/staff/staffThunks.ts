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
/* ========================================================
    ✅ CREATE STAFF (FULL FIX)
======================================================== */
export const createStaff = createAsyncThunk<
    {
        success: boolean;
        message: string;
        error: string | null;
        errors: Record<string, string[]> | null;
        staff: Staff | null;
    },
    CreateStaffDto,
    { rejectValue: string }
>(
    "staff/createStaff",
    async (createStaffDto, { rejectWithValue }) => {
        try {
            const response = await api.post(
                API_ENDPOINTS.STAFF.POST_CREATE,
                createStaffDto,
                { withCredentials: true }
            );

            const res = response.data;

            console.log("thunk response:", res);
            console.log("thunk Msg:", response.message);

            // Backend: success: false
            if (response.success === false) {
                return rejectWithValue(response.message || "Failed to create staff");
            }

            return {
                success: true,
                message: res.message || "Staff created successfully",
                error: null,
                errors: null,
                staff: res.data ?? null
            };

        } catch (error: any) {
            const errRes = error.response?.message;

            console.log("🔥 BACKEND ERROR:", errRes);

            if (errRes?.errors) {
                const all = Object.values(errRes.errors).flat();
                return rejectWithValue(all.join(", "));
            }

            if (errRes?.message) {
                return rejectWithValue(errRes.message);
            }

            if (errRes?.error) {
                return rejectWithValue(errRes.error);
            }

            return rejectWithValue("Server error");
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
      const response = await api.put(
        `${API_ENDPOINTS.STAFF.PUT_UPDATE}/${updateStaffDto.id}`,
        updateStaffDto,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" }
        }
      );

      // Axios may remove "success", so we treat HTTP 200 as success
      const apiRes = response.data || {};

      // Merge with state or DTO
      const state = getState() as RootState;
      const existing =
        state.staff.currentStaff ||
        state.staff.staff.find((s: Staff) => s.staffId === updateStaffDto.id);

      const merged: Staff = {
        ...(existing ?? ({} as Staff)),
        ...updateStaffDto,
        staffId: updateStaffDto.id
      };

      return {
        success: true,
        message: apiRes.message || "Staff updated successfully",
        error: null,
        errors: null,
        staff: merged
      };

    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to update staff"
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

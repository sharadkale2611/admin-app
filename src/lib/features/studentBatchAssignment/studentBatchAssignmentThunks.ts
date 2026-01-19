import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "@/lib/store";
import API_ENDPOINTS from "@/lib/config/apiConfig";
import api from "@/lib/services/apiService";

import {
    StudentBatchAssignment,
    CreateStudentBatchAssignmentDto,
    CreateBulkStudentBatchAssignmentDto,
    UpdateStudentBatchAssignmentDto,
    PaginatedStudentBatchAssignment,
    ApiResponse,
    ApiError,
    FetchSBAPaginationParams
} from "./studentBatchAssignmentTypes";


// -------------------------
// Common API Error Parser
// -------------------------
function parseApiError(error: any): ApiError {
    if (error?.response?.data) {
        const data = error.response.data;

        if (data.errors && typeof data.errors === "object") {
            const flattened = Object.entries(data.errors).flatMap(([field, msgs]) =>
                (msgs as string[]).map((msg) => `${field}: ${msg}`)
            );

            return { error: null, errors: flattened };
        }

        if (data.error) {
            return { error: data.error, errors: null };
        }
    }

    if (error?.message) {
        return { error: error.message, errors: null };
    }

    return { error: "Unknown error occurred", errors: null };
}



// ======================================================
// 1. Get All Assignments (non-paged)
// ======================================================
export const fetchSBAList = createAsyncThunk<
    StudentBatchAssignment[],
    void,
    { dispatch: AppDispatch; state: RootState; rejectValue: ApiError }
>(
    "sba/fetchList",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get<StudentBatchAssignment[]>(
                `${API_ENDPOINTS.STUDENT_BATCH_ASSIGNMENTS.GET_LIST}`,
                { withCredentials: true }
            );

            if (!res.data) {
                return rejectWithValue({ error: "No data returned", errors: null });
            }

            return res.data;
        } catch (err: any) {
            return rejectWithValue(parseApiError(err));
        }
    }
);


// ======================================================
// 2. Get Paginated List
// ======================================================
export const fetchSBAPaginated = createAsyncThunk<
    PaginatedStudentBatchAssignment,
    FetchSBAPaginationParams,
    { dispatch: AppDispatch; state: RootState; rejectValue: ApiError }
>(
    "sba/fetchPaginated",
    async ({ page = 1, searchTerm = "", activeOnly = true }, { rejectWithValue }) => {
        try {
            const query = new URLSearchParams({
                page: page.toString(),
                search: searchTerm,
                activeOnly: activeOnly.toString(),
                _: Date.now().toString()
            }).toString();

            const res = await api.get<PaginatedStudentBatchAssignment>(
                `${API_ENDPOINTS.STUDENT_BATCH_ASSIGNMENTS.GET_LIST_PAGINATED}?${query}`,
                { withCredentials: true }
            );

            if (!res.data) {
                return rejectWithValue({ error: "Empty response", errors: null });
            }

            return res.data;
        } catch (err: any) {
            return rejectWithValue(parseApiError(err));
        }
    }
);


// ======================================================
// 3. Create Assignment
// ======================================================
export const createSBA = createAsyncThunk<
    { success: boolean; message: string; data: StudentBatchAssignment | null },
    CreateStudentBatchAssignmentDto,
    { dispatch: AppDispatch; state: RootState; rejectValue: ApiError }
>(
    "sba/create",
    async (payload, { rejectWithValue }) => {
        try {
            const res = await api.post<StudentBatchAssignment>(
                API_ENDPOINTS.STUDENT_BATCH_ASSIGNMENTS.POST_CREATE,
                payload,
                {
                    withCredentials: true,
                    headers: { "Content-Type": "application/json" }
                }
            );

            if (!res.success) {
                return rejectWithValue({
                    error: res.message ?? "Creation failed",
                    errors: null
                });
            }

            return {
                success: true,
                message: res.message ?? "Created successfully",
                data: res.data ?? null
            };

        } catch (err: any) {
            return rejectWithValue(parseApiError(err));
        }
    }
);



// ======================================================
// 3B. Create Bulk Assignments
// ======================================================

export const createSBABulk = createAsyncThunk<
    { success: boolean; message: string; data: StudentBatchAssignment[] | null },
    CreateBulkStudentBatchAssignmentDto,
    { rejectValue: ApiError }
>(
    "sba/createBulk",
    async (payload, { rejectWithValue }) => {
        try {
            const res = await api.post(
                "/StudentBatchAssignments/bulk",
                payload,
                {
                    withCredentials: true,
                    headers: { "Content-Type": "application/json" }
                }
            );

            // FIX: use `res.success` instead of `res.data.success`
            if (res.success !== true) {
                return rejectWithValue({
                    error: res.message ?? "Bulk creation failed",
                    errors: null
                });
            }

            return {
                success: true,
                message: res.message ?? "Assignments created successfully",
                data: res.data ?? null,        // ← This is your array
            };
        } catch (err: any) {
            return rejectWithValue({
                error: err.message || "Something went wrong",
                errors: null
            });
        }
    }
);



// ======================================================
// 4. Update Assignment
// ======================================================
export const updateSBA = createAsyncThunk<
  { success: boolean; message: string; data: StudentBatchAssignment | null },
  UpdateStudentBatchAssignmentDto,
  { rejectValue: ApiError }
>(
  "sba/update",
  async (dto, { rejectWithValue }) => {
    try {
      // ❗ IMPORTANT: remove ApiResponse<T> typing here
      const res = await api.put(
        `/StudentBatchAssignments/${dto.id}`,
        dto,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" }
        }
      );

      // ⚠ FIX condition
      if (res.success !== true) {
        return rejectWithValue({
          error: res.message ?? "Update failed",
          errors: null,
        });
      }

      // ⚠ return ONLY StudentBatchAssignment object
      return {
        success: true,
        message: res.message ?? "Updated successfully",
        data: res.data ?? null,  // <--- CORRECT
      };

    } catch (err: any) {
      return rejectWithValue({
        error: err.message || "Something went wrong",
        errors: null,
      });
    }
  }
);


// ======================================================
// 5. Delete Assignment
// ======================================================
export const deleteSBA = createAsyncThunk<
    { success: boolean; message: string; id: number },
    number,
    { dispatch: AppDispatch; state: RootState; rejectValue: ApiError }
>(
    "sba/delete",
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`${API_ENDPOINTS.STUDENT_BATCH_ASSIGNMENTS.DELETE}/${id}`, {
                withCredentials: true
            });

            return { success: true, message: "Deleted successfully", id };
        } catch (err: any) {
            return rejectWithValue(parseApiError(err));
        }
    }
);


// ======================================================
// 6. Get By Id
// ======================================================
export const fetchSBAById = createAsyncThunk<
    StudentBatchAssignment,
    number,
    { dispatch: AppDispatch; state: RootState; rejectValue: ApiError }
>(
    "sba/fetchById",
    async (id, { rejectWithValue }) => {
        try {
            const res = await api.get<StudentBatchAssignment>(
                `${API_ENDPOINTS.STUDENT_BATCH_ASSIGNMENTS.GET_BY_ID}/${id}`,
                { withCredentials: true }
            );

            if (!res.data) {
                return rejectWithValue({ error: "Not found", errors: null });
            }

            return res.data;
        } catch (err: any) {
            return rejectWithValue(parseApiError(err));
        }
    }
);


// ======================================================
// 7. Get Assignments By BatchId
// ======================================================
export const fetchSBAByBatchId = createAsyncThunk<
    StudentBatchAssignment[],
    number, // batchId
    { dispatch: AppDispatch; state: RootState; rejectValue: ApiError }
>(
    "sba/fetchByBatchId",
    async (batchId, { rejectWithValue }) => {
        try {
            const res = await api.get<StudentBatchAssignment[]>(
                `${API_ENDPOINTS.STUDENT_BATCH_ASSIGNMENTS.GET_BY_BATCH}/${batchId}`,
                { withCredentials: true }
            );

            if (!res.success) {
                return rejectWithValue({
                    error: res.message ?? "Failed to fetch batch assignments",
                    errors: null
                });
            }

            if (!res.data) {
                return rejectWithValue({
                    error: "No assignments found for this batch",
                    errors: null
                });
            }

            return res.data;

        } catch (err: any) {
            return rejectWithValue(parseApiError(err));
        }
    }
);

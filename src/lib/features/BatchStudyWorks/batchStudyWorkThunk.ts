import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "@/lib/store";
import {
  BatchStudyWork,
  CreateBatchStudyWorkDto,
  UpdateBatchStudyWorkDto,
  PaginatedBatchStudyWorks,
  ApiResponse,
}from "./batchStudyWorkTypes";

import API_ENDPOINTS from "@/lib/config/apiConfig";
import api from "@/lib/services/apiService";

/**
 * Error type for consistent API error handling
 */
export interface ApiError {
  error: string | null;
  errors: string[] | null;
}

/**
 * Parse API errors into consistent shape
 */
function parseApiError(error: any): ApiError {
  console.log("parseApiError from BatchStudyWork thunk", error);

  if (error?.response?.data) {
    const data = error.response.data;

    if (data.errors && typeof data.errors === "object") {
      const flattened = Object.entries(data.errors).flatMap(
        ([field, msgs]) => (msgs as string[]).map((msg) => `${field}: ${msg}`)
      );
      return { error: null, errors: flattened };
    }

    if (data.error) {
      return { error: data.error, errors: null };
    }
  }

  return { error: "An unknown error occurred", errors: null };
}

/**
 * Fetch BatchStudyWorks (paginated)
 */
interface FetchBatchSWParams {
  page?: number;
  searchTerm?: string;
  activeOnly?: boolean;
}

export const fetchBatchStudyWorks = createAsyncThunk<
  PaginatedBatchStudyWorks,
  FetchBatchSWParams,
  { dispatch: AppDispatch; state: RootState; rejectValue: ApiError }
>(
  "batchStudyWorks/fetchBatchStudyWorks",
  async ({ page = 1, searchTerm = "", activeOnly = true }, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams({
        page: page.toString(),
        search: searchTerm,
        activeOnly: activeOnly.toString(),
        _: Date.now().toString(),
      }).toString();

      const response = await api.get<PaginatedBatchStudyWorks>(
        `${API_ENDPOINTS.BATCH_STUDY_WORKS.GET_LIST_PAGINATED}?${query}`,
        { withCredentials: true }
      );

      if (!response.data) {
        return rejectWithValue({ error: "No data from server", errors: null });
      }

      return response.data;
    } catch (error: any) {
      return rejectWithValue(parseApiError(error));
    }
  }
);

/**
 * Create BatchStudyWork
 */
export const createBatchStudyWork = createAsyncThunk<
  {
    success: boolean;
    message: string;
    error: string | null;
    errors: string[] | null;
    data: BatchStudyWork | null;
  },
  CreateBatchStudyWorkDto,
  { dispatch: AppDispatch; state: RootState; rejectValue: ApiError }
>(
  "batchStudyWorks/createBatchStudyWork",
  async (createDto, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<BatchStudyWork>>(
        API_ENDPOINTS.BATCH_STUDY_WORKS.POST_CREATE,
        createDto,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      return {
        success: true,
        message: response.data?.message || "Batch Study Work created",
        error: null,
        errors: null,
        data: response.data?.data ?? null,
      };
    } catch (error: any) {
      const parsed = parseApiError(error);
      return rejectWithValue({
        error: parsed.error ?? "Creation failed",
        errors: parsed.errors ?? null,
      });
    }
  }
);

/**
 * Update BatchStudyWork
 */
export const updateBatchStudyWork = createAsyncThunk<
  {
    success: boolean;
    message: string;
    error: string | null;
    errors: string[] | null;
    data: BatchStudyWork;
  },
  UpdateBatchStudyWorkDto,
  { dispatch: AppDispatch; state: RootState; rejectValue: ApiError }
>(
  "batchStudyWorks/updateBatchStudyWork",
  async (updateDto, { rejectWithValue, getState }) => {
    try {
      const response = await api.put<ApiResponse<BatchStudyWork>>(
        `${API_ENDPOINTS.BATCH_STUDY_WORKS.PUT_UPDATE}/${updateDto.batchStudyWorkId}`,
        updateDto,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      // fetch updated record
      try {
        const updated = await api.get<ApiResponse<BatchStudyWork>>(
          `${API_ENDPOINTS.BATCH_STUDY_WORKS.GET_BY_ID}/${updateDto.batchStudyWorkId}`,
          { withCredentials: true }
        );

        if (updated.data?.data) {
          return {
            success: true,
            message: "Updated successfully",
            error: null,
            errors: null,
            data: updated.data.data,
          };
        }
      } catch (fetchErr) {
        console.warn("Failed to fetch updated BatchStudyWork:", fetchErr);
      }

      // fallback to local merge
      const state = getState() as RootState;
      const existing =
        state.batchStudyWorks.items.find(
          (b) => b.batchStudyWorkId === updateDto.batchStudyWorkId
        );

      if (!existing) {
        return rejectWithValue({
          error: "Record not found",
          errors: null,
        });
      }

      return {
        success: true,
        message: "Updated successfully",
        error: null,
        errors: null,
        data: { ...existing, ...updateDto },
      };
    } catch (error: any) {
      const parsed = parseApiError(error);
      return rejectWithValue({
        error: parsed.error ?? "Update failed",
        errors: parsed.errors ?? null,
      });
    }
  }
);

/**
 * Delete BatchStudyWork (Soft delete)
 */
export const deleteBatchStudyWork = createAsyncThunk<
  { success: boolean; message: string; id: number },
  number,
  { dispatch: AppDispatch; state: RootState; rejectValue: ApiError }
>(
  "batchStudyWorks/deleteBatchStudyWork",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(
        `${API_ENDPOINTS.BATCH_STUDY_WORKS.DELETE}/${id}`,
        { withCredentials: true }
      );

      return { success: true, message: "Deleted successfully", id };
    } catch (error: any) {
      return rejectWithValue(parseApiError(error));
    }
  }
);

/**
 * Fetch By ID
 */
export const fetchBatchStudyWorkById = createAsyncThunk<
  BatchStudyWork,
  number,
  { rejectValue: ApiError }
>(
  "batchStudyWorks/fetchBatchStudyWorkById",
  async (id, { rejectWithValue }) => {
    try {
      // Your API service ALREADY unwraps "data"
      const record = await api.get<BatchStudyWork>(
        `${API_ENDPOINTS.BATCH_STUDY_WORKS.GET_BY_ID}/${id}`,
        { withCredentials: true }
      ).then(res => res.data);

      if (!record || !record.batchStudyWorkId) {
        return rejectWithValue({ error: "Not found", errors: null });
      }

      return record;
    } catch (error: any) {
      return rejectWithValue(parseApiError(error));
    }
  }
);

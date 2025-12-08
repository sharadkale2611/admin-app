// src/lib/features/batch/batchThunks.ts

import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "@/lib/store";
import {
  Batch,
  PaginatedBatch,
  ApiResponse,
  FetchBatchParams,
  CreateBatchDto,
  CreateBatchResponse
} from "./batchTypes";
import API_ENDPOINTS from "@/lib/config/apiConfig";
import api from "@/lib/services/apiService";

/**
 * Local ApiError type for thunk rejectValue
 */
export interface ApiError {
  error: string | null;
  errors: string[] | null;  
}

/**
 * Common error parser for API responses (similar to Student module)
 */
function parseApiError(error: any): ApiError {
  console.log("parseApiError from batchThunk", error);

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

  if (error?.errors) {
    return { error: error.message, errors: error?.errors };
  }

  if (error?.fieldErrors) {
    return { error: error.message, errors: error?.fieldErrors };
  }

  return { error: "An unknown error occurred while calling Batch API", errors: null };
}   

/**
 * 🔹 Fetch Batches (paginated)
 * Uses: GET /Batches/paginated?pageNumber=&pageSize=&search=&isActive=
 */

export const fetchBatches = createAsyncThunk<
  PaginatedBatch,
  FetchBatchParams,
  { rejectValue: ApiError }
>(
  "batches/fetchBatches",
  async ({ page = 1, searchTerm = "", activeOnly = true }, { rejectWithValue }) => {
    try {
      const params: Record<string, string> = {
        pageNumber: page.toString(),
        pageSize: "10",
        search: searchTerm,
        isActive: activeOnly.toString(),
        _: Date.now().toString(),
      };

      const query = new URLSearchParams(params).toString();

      // ✅ FIX: Expect PAGINATED response, not Batch[]
      const response = await api.get<PaginatedBatch>(
        `${API_ENDPOINTS.BATCHES.GET_LIST_PAGINATED}?${query}`,
        { withCredentials: true }
      );

      if (!response.success || !response.data) {
        return rejectWithValue({
          error: response.error || response.message || "Failed to fetch batches",
          errors: null,
        });
      }

      // ✅ FIX: Directly return backend pagination
      return response.data;

    } catch (error: any) {
      return rejectWithValue(parseApiError(error));
    }
  }
);


/**
 * 🔹 Fetch single Batch by ID
 * Uses: GET /Batches/{id}
 */
export const fetchBatchById = createAsyncThunk<
  Batch,
  number,
  { dispatch: AppDispatch; state: RootState; rejectValue: ApiError }
>("batches/fetchBatchById", async (batchId, { rejectWithValue }) => {
  try {
    const response = await api.get<Batch>(
      `${API_ENDPOINTS.BATCHES.GET_BY_ID}/${batchId}`,
      { withCredentials: true }
    );

    if (!response.success || !response.data) {
      return rejectWithValue({
        error: response.error || response.message || "Failed to fetch batch",
        errors: null,
      });
    }

    return response.data;
  } catch (error: any) {
    return rejectWithValue(parseApiError(error));
  }
});




function flattenApiErrors(errors: Record<string, string[]> | null): string[] | null {
  if (!errors) return null;
  return Object.values(errors).flat();
}


export const createBatch = createAsyncThunk<
  CreateBatchResponse,
  CreateBatchDto,
  { rejectValue: ApiError }
>(
  "batches/createBatch",
  async (dto, { rejectWithValue }) => {
    try {
      const response = await api.post<CreateBatchResponse>(
        API_ENDPOINTS.BATCHES.POST_CREATE,
        dto,                     // ⬅ FIXED
        { withCredentials: true }
      );

      const normalized: CreateBatchResponse = {
        success: response.success ?? false,
        message: response.message ?? "",
        data: response.data ?? null,
        error: response.error ?? null,
        errors: response.errors ?? null,
      };

      if (!normalized.success) {
        return rejectWithValue({
          error: normalized.error || normalized.message,
          errors: flattenApiErrors(normalized.errors),
        });
      }

      return normalized;

    } catch (error: any) {
      return rejectWithValue({
        error: error.message || "Failed to create batch",
        errors: null,
      });
    }
  }
);



export const updateBatch = createAsyncThunk<
  ApiResponse<Batch>,
  { id: number; dto: any },
  { rejectValue: ApiError }
>(
  "batches/updateBatch",
  async ({ id, dto }, { rejectWithValue }) => {
    try {
      const res = await api.put<ApiResponse<Batch>>(
        `${API_ENDPOINTS.BATCHES.PUT_UPDATE}/${id}`,
        dto,
        { withCredentials: true }
      );

      const normalized: ApiResponse<Batch> = {
        success: res.success ?? false,
        message: res.message ?? "",
        data: res.data ?? null,
        error: res.error ?? null,
        errors: res.errors ?? null,
      };

      if (!normalized.success) {
        return rejectWithValue({
          error: normalized.error || normalized.message || "Failed to update batch",
          errors: flattenApiErrors(normalized.errors),
        });
      }

      return normalized;
    } catch (error: any) {
      return rejectWithValue({
        error: error.message || "Failed to update batch",
        errors: null,
      });
    }
  }
);






/**
 * 🔹 Delete Batch (soft delete)
 * Uses: DELETE /Batches/{id}
 */
export const deleteBatch = createAsyncThunk<
  { success: boolean; message: string; id: number },
  number,
  { dispatch: AppDispatch; state: RootState; rejectValue: ApiError }
>("batches/deleteBatch", async (id, { rejectWithValue }) => {
  try {
    const response = await api.delete(
      `${API_ENDPOINTS.BATCHES.DELETE}/${id}`,
      { withCredentials: true }
    );

    if (!response.success) {
      return rejectWithValue({
        error: response.error || response.message || "Failed to delete batch",
        errors: null,
      });
    }

    return {
      success: true,
      message: response.message || "Batch deleted successfully",
      id,
    };
  } catch (error: any) {
    return rejectWithValue(parseApiError(error));
  }
});
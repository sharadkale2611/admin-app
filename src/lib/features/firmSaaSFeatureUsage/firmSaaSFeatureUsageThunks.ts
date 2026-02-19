import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/services/apiService";
import API_ENDPOINTS from "@/lib/config/apiConfig";

import type {
  FirmSaaSFeatureUsage,
  CreateFirmSaaSFeatureUsageDto,
  UpdateFirmSaaSFeatureUsageDto,
  ApiError,
} from "./firmSaaSFeatureUsageTypes";

function parseApiError(error: any): ApiError {
  if (error?.response?.data) {
    const data = error.response.data;

    if (data.errors && typeof data.errors === "object") {
      return { error: null, errors: data.errors };
    }

    if (data.error || data.message) {
      return { error: data.error ?? data.message, errors: null };
    }
  }

  return { error: "An unknown error occurred", errors: null };
}

/* ===============================
   GET LIST (filters)
================================ */
export const fetchFirmSaaSFeatureUsage = createAsyncThunk<
  FirmSaaSFeatureUsage[],
  { firmId?: number; saasFeatureId?: number } | void,
  { rejectValue: ApiError }
>("firmSaaSFeatureUsage/fetchAll", async (filters, { rejectWithValue }) => {
  try {
    const params = new URLSearchParams();
    const f = filters ?? {};

    if (typeof f.firmId === "number") params.set("firmId", String(f.firmId));
    if (typeof f.saasFeatureId === "number")
      params.set("saasFeatureId", String(f.saasFeatureId));

    const url =
      API_ENDPOINTS.FIRM_SAAS_FEATURE_USAGE.GET_LIST +
      (params.toString() ? `?${params.toString()}` : "");

    const response = await api.get<FirmSaaSFeatureUsage[]>(url, {
      withCredentials: true,
    });

    if (!response?.success || !response.data) {
      return rejectWithValue({
        error: response?.message || "No data",
        errors: null,
      });
    }

    return response.data;
  } catch (error: any) {
    return rejectWithValue(parseApiError(error));
  }
});

/* ===============================
   GET BY KEYS
================================ */
export const fetchFirmSaaSFeatureUsageByKeys = createAsyncThunk<
  FirmSaaSFeatureUsage,
  { firmId: number; saasFeatureId: number },
  { rejectValue: ApiError }
>(
  "firmSaaSFeatureUsage/fetchByKeys",
  async ({ firmId, saasFeatureId }, { rejectWithValue }) => {
    try {
      const response = await api.get<FirmSaaSFeatureUsage>(
        `${API_ENDPOINTS.FIRM_SAAS_FEATURE_USAGE.GET_BY_KEYS}/${firmId}/${saasFeatureId}`,
        { withCredentials: true }
      );

      if (!response?.success || !response.data) {
        return rejectWithValue({ error: "Usage record not found", errors: null });
      }

      return response.data;
    } catch (error: any) {
      return rejectWithValue(parseApiError(error));
    }
  }
);

/* ===============================
   CREATE
================================ */
export const createFirmSaaSFeatureUsage = createAsyncThunk<
  { success: boolean; item: FirmSaaSFeatureUsage | null },
  CreateFirmSaaSFeatureUsageDto,
  { rejectValue: ApiError }
>("firmSaaSFeatureUsage/create", async (dto, { rejectWithValue }) => {
  try {
    const payload: CreateFirmSaaSFeatureUsageDto = {
      firmId: dto.firmId,
      saaSFeatureId: dto.saaSFeatureId,
      usedCount: dto.usedCount ?? 0,
    };

    const response = await api.post<FirmSaaSFeatureUsage>(
      API_ENDPOINTS.FIRM_SAAS_FEATURE_USAGE.POST_CREATE,
      payload,
      { withCredentials: true }
    );

    if (!response?.success) {
      return rejectWithValue({
        error: response?.message || "Create failed",
        errors: null,
      });
    }

    return { success: true, item: response.data ?? null };
  } catch (error: any) {
    return rejectWithValue(parseApiError(error));
  }
});

/* ===============================
   UPDATE
================================ */
export const updateFirmSaaSFeatureUsage = createAsyncThunk<
  { success: boolean; item: FirmSaaSFeatureUsage | null },
  { firmId: number; saasFeatureId: number; dto: UpdateFirmSaaSFeatureUsageDto },
  { rejectValue: ApiError }
>(
  "firmSaaSFeatureUsage/update",
  async ({ firmId, saasFeatureId, dto }, { rejectWithValue }) => {
    try {
      const response = await api.put<FirmSaaSFeatureUsage>(
        `${API_ENDPOINTS.FIRM_SAAS_FEATURE_USAGE.PUT_UPDATE}/${firmId}/${saasFeatureId}`,
        dto,
        { withCredentials: true }
      );

      if (!response?.success) {
        return rejectWithValue({
          error: response?.message || "Update failed",
          errors: null,
        });
      }

      return { success: true, item: response.data ?? null };
    } catch (error: any) {
      return rejectWithValue(parseApiError(error));
    }
  }
);

/* ===============================
   DELETE
================================ */
export const deleteFirmSaaSFeatureUsage = createAsyncThunk<
  { success: boolean; firmId: number; saasFeatureId: number },
  { firmId: number; saasFeatureId: number },
  { rejectValue: ApiError }
>(
  "firmSaaSFeatureUsage/delete",
  async ({ firmId, saasFeatureId }, { rejectWithValue }) => {
    try {
      const response = await api.delete(
        `${API_ENDPOINTS.FIRM_SAAS_FEATURE_USAGE.DELETE}/${firmId}/${saasFeatureId}`,
        { withCredentials: true }
      );

      if (!response?.success) {
        return rejectWithValue({
          error: response?.message || "Delete failed",
          errors: null,
        });
      }

      return { success: true, firmId, saasFeatureId };
    } catch (error: any) {
      return rejectWithValue(parseApiError(error));
    }
  }
);
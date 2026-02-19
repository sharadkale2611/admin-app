import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/services/apiService";
import API_ENDPOINTS from "@/lib/config/apiConfig";

import {
  FirmSaaSFeature,
  CreateFirmSaaSFeatureDto,
  UpdateFirmSaaSFeatureDto,
  ApiError,
} from "./firmSaaSFeatureTypes";

/* ===============================
   Error Parser (same pattern)
================================ */

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
   GET LIST (supports filters)
================================ */

export const fetchFirmSaaSFeatures = createAsyncThunk<
  FirmSaaSFeature[],
  { firmId?: number; saasFeatureId?: number; isEnabled?: boolean } | void,
  { rejectValue: ApiError }
>("firmSaaSFeatures/fetchAll", async (filters, { rejectWithValue }) => {
  try {
    const params = new URLSearchParams();

    const f = filters ?? {};
    if (typeof f.firmId === "number") params.set("firmId", String(f.firmId));
    if (typeof f.saasFeatureId === "number") params.set("saasFeatureId", String(f.saasFeatureId));
    if (typeof f.isEnabled === "boolean") params.set("isEnabled", String(f.isEnabled));

    const url =
      API_ENDPOINTS.FIRM_SAAS_FEATURES.GET_LIST +
      (params.toString() ? `?${params.toString()}` : "");

    const response = await api.get<FirmSaaSFeature[]>(url, { withCredentials: true });

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
   GET BY ID
================================ */

export const fetchFirmSaaSFeatureById = createAsyncThunk<
  FirmSaaSFeature,
  number,
  { rejectValue: ApiError }
>("firmSaaSFeatures/fetchById", async (id, { rejectWithValue }) => {
  try {
    const response = await api.get<FirmSaaSFeature>(
      `${API_ENDPOINTS.FIRM_SAAS_FEATURES.GET_BY_ID}/${id}`,
      { withCredentials: true }
    );

    if (!response?.success || !response.data) {
      return rejectWithValue({ error: "Firm SaaS feature not found", errors: null });
    }

    return response.data;
  } catch (error: any) {
    return rejectWithValue(parseApiError(error));
  }
});

/* ===============================
   CREATE
================================ */

export const createFirmSaaSFeature = createAsyncThunk<
  { success: boolean; item: FirmSaaSFeature | null },
  CreateFirmSaaSFeatureDto,
  { rejectValue: ApiError }
>("firmSaaSFeatures/create", async (dto, { rejectWithValue }) => {
  try {
    const payload = {
      ...dto,
      limitType: dto.limitType?.trim?.() ? dto.limitType.trim() : null,
      limitValue: dto.limitValue ?? null,
    };

    const response = await api.post<FirmSaaSFeature>(
      API_ENDPOINTS.FIRM_SAAS_FEATURES.POST_CREATE,
      payload,
      { withCredentials: true }
    );

    if (!response?.success) {
      return rejectWithValue({ error: response?.message || "Create failed", errors: null });
    }

    return { success: true, item: response.data ?? null };
  } catch (error: any) {
    return rejectWithValue(parseApiError(error));
  }
});

/* ===============================
   UPDATE
================================ */

export const updateFirmSaaSFeature = createAsyncThunk<
  { success: boolean; item?: FirmSaaSFeature | null },
  { id: number; dto: UpdateFirmSaaSFeatureDto },
  { rejectValue: ApiError }
>("firmSaaSFeatures/update", async ({ id, dto }, { rejectWithValue }) => {
  try {
    const payload = {
      ...dto,
      limitType: dto.limitType?.trim?.() ? dto.limitType.trim() : null,
      limitValue: dto.limitValue ?? null,
    };

    const response = await api.put<FirmSaaSFeature>(
      `${API_ENDPOINTS.FIRM_SAAS_FEATURES.PUT_UPDATE}/${id}`,
      payload,
      { withCredentials: true }
    );

    if (!response?.success) {
      return rejectWithValue({ error: response?.message || "Update failed", errors: null });
    }

    return { success: true, item: response.data ?? null };
  } catch (error: any) {
    return rejectWithValue(parseApiError(error));
  }
});

/* ===============================
   DELETE
================================ */

export const deleteFirmSaaSFeature = createAsyncThunk<
  { success: boolean; id: number },
  number,
  { rejectValue: ApiError }
>("firmSaaSFeatures/delete", async (id, { rejectWithValue }) => {
  try {
    const response = await api.delete(
      `${API_ENDPOINTS.FIRM_SAAS_FEATURES.DELETE}/${id}`,
      { withCredentials: true }
    );

    if (!response?.success) {
      return rejectWithValue({ error: response?.message || "Delete failed", errors: null });
    }

    return { success: true, id };
  } catch (error: any) {
    return rejectWithValue(parseApiError(error));
  }
});
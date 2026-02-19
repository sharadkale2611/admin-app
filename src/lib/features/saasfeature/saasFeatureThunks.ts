import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/services/apiService";
import API_ENDPOINTS from "@/lib/config/apiConfig";

import {
  SaaSFeature,
  CreateSaaSFeatureDto,
  UpdateSaaSFeatureDto,
  ApiError,
} from "./saasFeatureTypes";

/* ===============================
   Error Parser
================================ */

function parseApiError(error: any): ApiError {
  if (error?.response?.data) {
    const data = error.response.data;

    if (data.errors && typeof data.errors === "object") {
      return { error: null, errors: data.errors };
    }

    if (data.error) {
      return { error: data.error, errors: null };
    }
  }

  return { error: "An unknown error occurred", errors: null };
}

/* ===============================
   GET LIST
================================ */

export const fetchSaaSFeatures = createAsyncThunk<
  SaaSFeature[],
  void,
  { rejectValue: ApiError }
>("saasFeatures/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<SaaSFeature[]>(
      API_ENDPOINTS.SAASFEATURES.GET_LIST,
      { withCredentials: true }
    );

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

export const fetchSaaSFeatureById = createAsyncThunk<
  SaaSFeature,
  number,
  { rejectValue: ApiError }
>("saasFeatures/fetchById", async (id, { rejectWithValue }) => {
  try {
    const response = await api.get<SaaSFeature>(
      `${API_ENDPOINTS.SAASFEATURES.GET_BY_ID}/${id}`,
      { withCredentials: true }
    );

    if (!response?.success || !response.data) {
      return rejectWithValue({
        error: "Feature not found",
        errors: null,
      });
    }

    return response.data;
  } catch (error: any) {
    return rejectWithValue(parseApiError(error));
  }
});

/* ===============================
   CREATE
================================ */

export const createSaaSFeature = createAsyncThunk<
  { success: boolean; saasFeature: SaaSFeature | null },
  CreateSaaSFeatureDto,
  { rejectValue: ApiError }
>("saasFeatures/create", async (dto, { rejectWithValue }) => {
  try {
    const response = await api.post<SaaSFeature>(
      API_ENDPOINTS.SAASFEATURES.POST_CREATE,
      dto,
      { withCredentials: true }
    );

    if (!response?.success) {
      return rejectWithValue({
        error: response?.message || "Create failed",
        errors: null,
      });
    }

    return {
      success: true,
      saasFeature: response.data ?? null,
    };
  } catch (error: any) {
    return rejectWithValue(parseApiError(error));
  }
});

/* ===============================
   ✅ UPDATE — ⭐ FIXED VERSION
================================ */

export const updateSaaSFeature = createAsyncThunk<
  { success: boolean },
  { id: number; dto: UpdateSaaSFeatureDto },
  { rejectValue: ApiError }
>("saasFeatures/update", async ({ id, dto }, { rejectWithValue }) => {
  try {
    /* ⭐ IMPORTANT FIX ⭐
       Backend expects saaSFeatureId in body also
    */
    const payload: UpdateSaaSFeatureDto = {
      ...dto,
      saaSFeatureId: id,
    };

    const response = await api.put(
      `${API_ENDPOINTS.SAASFEATURES.PUT_UPDATE}/${id}`,
      payload,
      { withCredentials: true }
    );

    if (!response?.success) {
      return rejectWithValue({
        error: response?.message || "Update failed",
        errors: null,
      });
    }

    return { success: true };
  } catch (error: any) {
    return rejectWithValue(parseApiError(error));
  }
});

/* ===============================
   DELETE
================================ */

export const deleteSaaSFeature = createAsyncThunk<
  { success: boolean; id: number },
  number,
  { rejectValue: ApiError }
>("saasFeatures/delete", async (id, { rejectWithValue }) => {
  try {
    const response = await api.delete(
      `${API_ENDPOINTS.SAASFEATURES.DELETE}/${id}`,
      { withCredentials: true }
    );

    if (!response?.success) {
      return rejectWithValue({
        error: response?.message || "Delete failed",
        errors: null,
      });
    }

    return { success: true, id };
  } catch (error: any) {
    return rejectWithValue(parseApiError(error));
  }
});

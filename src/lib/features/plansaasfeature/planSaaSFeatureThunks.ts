import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/services/apiService";
import API_ENDPOINTS from "@/lib/config/apiConfig";

import {
  PlanSaaSFeature,
  CreatePlanSaaSFeatureDto,
  UpdatePlanSaaSFeatureDto,
  ApiError,
} from "./planSaaSFeatureTypes";

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

export const fetchPlanSaaSFeatures = createAsyncThunk<
  PlanSaaSFeature[],
  void,
  { rejectValue: ApiError }
>("planSaaSFeatures/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<PlanSaaSFeature[]>(
      API_ENDPOINTS.PLANSAASFEATURES.GET_LIST,
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

export const fetchPlanSaaSFeatureById = createAsyncThunk<
  PlanSaaSFeature,
  number,
  { rejectValue: ApiError }
>("planSaaSFeatures/fetchById", async (id, { rejectWithValue }) => {
  try {
    const response = await api.get<PlanSaaSFeature>(
      `${API_ENDPOINTS.PLANSAASFEATURES.GET_BY_ID}/${id}`,
      { withCredentials: true }
    );

    if (!response?.success || !response.data) {
      return rejectWithValue({
        error: "Record not found",
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

export const createPlanSaaSFeature = createAsyncThunk<
  { success: boolean; planSaaSFeature: PlanSaaSFeature | null },
  CreatePlanSaaSFeatureDto,
  { rejectValue: ApiError }
>("planSaaSFeatures/create", async (dto, { rejectWithValue }) => {
  try {
    const response = await api.post<PlanSaaSFeature>(
      API_ENDPOINTS.PLANSAASFEATURES.POST_CREATE,
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
      planSaaSFeature: response.data ?? null,
    };
  } catch (error: any) {
    return rejectWithValue(parseApiError(error));
  }
});

/* ===============================
   UPDATE
================================ */

export const updatePlanSaaSFeature = createAsyncThunk<
  { success: boolean },
  { id: number; dto: UpdatePlanSaaSFeatureDto },
  { rejectValue: ApiError }
>("planSaaSFeatures/update", async ({ id, dto }, { rejectWithValue }) => {
  try {
    const payload: UpdatePlanSaaSFeatureDto = {
      ...dto,
      planSaaSFeatureId: id,
    };

    const response = await api.put(
      `${API_ENDPOINTS.PLANSAASFEATURES.PUT_UPDATE}/${id}`,
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

export const deletePlanSaaSFeature = createAsyncThunk<
  { success: boolean; id: number },
  number,
  { rejectValue: ApiError }
>("planSaaSFeatures/delete", async (id, { rejectWithValue }) => {
  try {
    const response = await api.delete(
      `${API_ENDPOINTS.PLANSAASFEATURES.DELETE}/${id}`,
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

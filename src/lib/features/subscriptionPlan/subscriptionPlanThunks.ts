import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/services/apiService";
import API_ENDPOINTS from "@/lib/config/apiConfig";

import {
  SubscriptionPlan,
  CreateSubscriptionPlanDto,
  UpdateSubscriptionPlanDto,
  ApiError,
} from "./subscriptionPlanTypes";

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
   GET ALL
================================ */

export const fetchSubscriptionPlans = createAsyncThunk<
  SubscriptionPlan[],
  void,
  { rejectValue: ApiError }
>("subscriptionPlans/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<SubscriptionPlan[]>(
      API_ENDPOINTS.SUBSCRIPTIONPLANS.GET_LIST,
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

export const fetchSubscriptionPlanById = createAsyncThunk<
  SubscriptionPlan,
  number,
  { rejectValue: ApiError }
>("subscriptionPlans/fetchById", async (id, { rejectWithValue }) => {
  try {
    const response = await api.get<SubscriptionPlan>(
      `${API_ENDPOINTS.SUBSCRIPTIONPLANS.GET_BY_ID}/${id}`,
      { withCredentials: true }
    );

    if (!response?.success || !response.data) {
      return rejectWithValue({
        error: "Plan not found",
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

export const createSubscriptionPlan = createAsyncThunk<
  { success: boolean; subscriptionPlan: SubscriptionPlan | null },
  CreateSubscriptionPlanDto,
  { rejectValue: ApiError }
>("subscriptionPlans/create", async (dto, { rejectWithValue }) => {
  try {
    const response = await api.post<SubscriptionPlan>(
      API_ENDPOINTS.SUBSCRIPTIONPLANS.POST_CREATE,
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
      subscriptionPlan: response.data ?? null,
    };
  } catch (error: any) {
    return rejectWithValue(parseApiError(error));
  }
});

/* ===============================
   UPDATE
================================ */

export const updateSubscriptionPlan = createAsyncThunk<
  { success: boolean },
  { id: number; dto: UpdateSubscriptionPlanDto },
  { rejectValue: ApiError }
>("subscriptionPlans/update", async ({ id, dto }, { rejectWithValue }) => {
  try {
    const payload: UpdateSubscriptionPlanDto = {
      ...dto,
      planId: id,
    };

    const response = await api.put(
      `${API_ENDPOINTS.SUBSCRIPTIONPLANS.PUT_UPDATE}/${id}`,
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

export const deleteSubscriptionPlan = createAsyncThunk<
  { success: boolean; id: number },
  number,
  { rejectValue: ApiError }
>("subscriptionPlans/delete", async (id, { rejectWithValue }) => {
  try {
    const response = await api.delete(
      `${API_ENDPOINTS.SUBSCRIPTIONPLANS.DELETE}/${id}`,
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

import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/services/apiService";
import API_ENDPOINTS from "@/lib/config/apiConfig";
import type { AppDispatch, RootState } from "@/lib/store";
import {
  AdminDashboardSummary,
  
} from "./dashboardTypes";

interface ApiWrapper<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string | null;
}

const mapResponse = <T>(response: any): T | null => {
  if (response?.success) return response.data ?? null;
  return null;
};

// --------------------
// ADMIN DASHBOARD
// --------------------

// 🔹 Summary (Top cards)
export const fetchAdminDashboardSummary = createAsyncThunk<
  AdminDashboardSummary,
  void,
  { dispatch: AppDispatch; state: RootState; rejectValue: string }
>("dashboard/fetchAdminDashboardSummary", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<ApiWrapper<AdminDashboardSummary>>(
      API_ENDPOINTS.DASHBOARD.ADMIN_SUMMARY,
      { withCredentials: true }
    );

    const data = mapResponse<AdminDashboardSummary>(response);
    if (!data) return rejectWithValue("No dashboard summary data");

    return data;
  } catch (error: any) {
    return rejectWithValue(error?.message || "Failed to load dashboard summary");
  }
});

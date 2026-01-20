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

// // 🔹 Student attendance today
// export const fetchStudentAttendanceToday = createAsyncThunk<
//   StudentAttendanceToday,
//   void,
//   { dispatch: AppDispatch; state: RootState; rejectValue: string }
// >("dashboard/fetchStudentAttendanceToday", async (_, { rejectWithValue }) => {
//   try {
//     const response = await api.get<ApiWrapper<StudentAttendanceToday>>(
//       API_ENDPOINTS.DASHBOARD.STUDENT_ATTENDANCE_TODAY,
//       { withCredentials: true }
//     );

//     const data = mapResponse<StudentAttendanceToday>(response);
//     if (!data) return rejectWithValue("No attendance data");

//     return data;
//   } catch (error: any) {
//     return rejectWithValue(error?.message || "Failed to load attendance");
//   }
// });

// // 🔹 Recent activity
// export const fetchRecentActivity = createAsyncThunk<
//   DashboardActivity[],
//   void,
//   { dispatch: AppDispatch; state: RootState; rejectValue: string }
// >("dashboard/fetchRecentActivity", async (_, { rejectWithValue }) => {
//   try {
//     const response = await api.get<ApiWrapper<DashboardActivity[]>>(
//       API_ENDPOINTS.DASHBOARD.RECENT_ACTIVITY,
//       { withCredentials: true }
//     );

//     const data = mapResponse<DashboardActivity[]>(response);
//     if (!data) return rejectWithValue("No recent activity");

//     return data;
//   } catch (error: any) {
//     return rejectWithValue(error?.message || "Failed to load recent activity");
//   }
// });

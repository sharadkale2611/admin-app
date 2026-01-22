import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAdminDashboardSummary,
 
} from "./dashboardThunks";
import {
  AdminDashboardSummary,
 
} from "./dashboardTypes";

interface DashboardState {
  summary: AdminDashboardSummary | null;
 
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  summary: null,
  
 
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Summary
      .addCase(fetchAdminDashboardSummary.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminDashboardSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload;
      })

      // // Attendance
      // .addCase(fetchStudentAttendanceToday.fulfilled, (state, action) => {
      //   state.attendanceToday = action.payload;
      // })

      // // Recent activity
      // .addCase(fetchRecentActivity.fulfilled, (state, action) => {
      //   state.recentActivity = action.payload;
      // })

      // Error
      .addCase(fetchAdminDashboardSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default dashboardSlice.reducer;

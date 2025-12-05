import { createSlice } from "@reduxjs/toolkit";
import type { BatchSchedulesState } from "./batchScheduleTypes";

import {
  fetchBatchSchedules,
  createBulkSchedules,
  createSingleSchedule,
} from "./batchScheduleThunks";

const initialState: BatchSchedulesState = {
  items: [],
  loading: false,
  error: null,
  successMessage: null,
};

const batchSchedulesSlice = createSlice({
  name: "batchSchedules",
  initialState,
  reducers: {
    clearMessages(state) {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    // FETCH
    builder.addCase(fetchBatchSchedules.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.successMessage = null;
    });
    builder.addCase(fetchBatchSchedules.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload;
    });
    builder.addCase(fetchBatchSchedules.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to load schedules";
    });

    // BULK CREATE
    builder.addCase(createBulkSchedules.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.successMessage = null;
    });
    builder.addCase(createBulkSchedules.fulfilled, (state, action) => {
      state.loading = false;
      state.items.push(...action.payload);
      state.successMessage = "Batch schedules created successfully";
    });
    builder.addCase(createBulkSchedules.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Bulk creation failed";
    });

    // SINGLE CREATE
    builder.addCase(createSingleSchedule.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.successMessage = null;
    });
    builder.addCase(createSingleSchedule.fulfilled, (state, action) => {
      state.loading = false;
      state.items.push(action.payload);
      state.successMessage = "Re-Schedule created successfully";
    });
    builder.addCase(createSingleSchedule.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Re-Schedule failed";
    });
  },
});

export const { clearMessages } = batchSchedulesSlice.actions;
export default batchSchedulesSlice.reducer;

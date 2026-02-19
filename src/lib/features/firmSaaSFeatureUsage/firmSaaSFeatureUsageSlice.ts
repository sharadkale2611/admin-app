import { createSlice } from "@reduxjs/toolkit";
import type { FirmSaaSFeatureUsageState, ApiError } from "./firmSaaSFeatureUsageTypes";

/* SSR-safe namespace import */
import * as thunks from "./firmSaaSFeatureUsageThunks";

const initialState: FirmSaaSFeatureUsageState = {
  items: [],
  current: null,
  loading: false,
  error: null,
};

const firmSaaSFeatureUsageSlice = createSlice({
  name: "firmSaaSFeatureUsage",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // GET ALL
    builder.addCase(thunks.fetchFirmSaaSFeatureUsage.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(thunks.fetchFirmSaaSFeatureUsage.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload ?? [];
    });

    builder.addCase(thunks.fetchFirmSaaSFeatureUsage.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as ApiError) ?? null;
    });

    // GET BY KEYS
    builder.addCase(thunks.fetchFirmSaaSFeatureUsageByKeys.fulfilled, (state, action) => {
      state.current = action.payload ?? null;
    });

    // CREATE
    builder.addCase(thunks.createFirmSaaSFeatureUsage.fulfilled, (state, action) => {
      if (action.payload?.item) state.items.unshift(action.payload.item);
    });

    // UPDATE
    builder.addCase(thunks.updateFirmSaaSFeatureUsage.fulfilled, (state, action) => {
      const updated = action.payload?.item;
      if (!updated) return;

      const idx = state.items.findIndex(
        (x) => x.firmId === updated.firmId && x.saaSFeatureId === updated.saaSFeatureId
      );
      if (idx >= 0) state.items[idx] = updated;

      if (
        state.current &&
        state.current.firmId === updated.firmId &&
        state.current.saaSFeatureId === updated.saaSFeatureId
      ) {
        state.current = updated;
      }
    });

    // DELETE
    builder.addCase(thunks.deleteFirmSaaSFeatureUsage.fulfilled, (state, action) => {
      state.items = state.items.filter(
        (x) =>
          !(
            x.firmId === action.payload.firmId &&
            x.saaSFeatureId === action.payload.saasFeatureId
          )
      );
    });
  },
});

export default firmSaaSFeatureUsageSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";
import { FirmSaaSFeatureState, ApiError } from "./firmSaaSFeatureTypes";

/* namespace import (same SSR-safe pattern) */
import * as thunks from "./firmSaaSFeatureThunks";

const initialState: FirmSaaSFeatureState = {
  firmSaaSFeatures: [],
  currentFirmSaaSFeature: null,
  loading: false,
  error: null,
};

const firmSaaSFeatureSlice = createSlice({
  name: "firmSaaSFeatures",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    /* GET ALL */
    builder.addCase(thunks.fetchFirmSaaSFeatures.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(thunks.fetchFirmSaaSFeatures.fulfilled, (state, action) => {
      state.loading = false;
      state.firmSaaSFeatures = action.payload ?? [];
    });

    builder.addCase(thunks.fetchFirmSaaSFeatures.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as ApiError) ?? null;
    });

    /* GET BY ID */
    builder.addCase(thunks.fetchFirmSaaSFeatureById.fulfilled, (state, action) => {
      state.currentFirmSaaSFeature = action.payload ?? null;
    });

    /* CREATE */
    builder.addCase(thunks.createFirmSaaSFeature.fulfilled, (state, action) => {
      if (action.payload?.item) {
        state.firmSaaSFeatures.unshift(action.payload.item);
      }
    });

    /* UPDATE */
    builder.addCase(thunks.updateFirmSaaSFeature.fulfilled, (state, action) => {
      const updated = action.payload?.item;
      if (!updated) return;

      const idx = state.firmSaaSFeatures.findIndex(
        (x) => x.firmSaaSFeatureId === updated.firmSaaSFeatureId
      );

      if (idx >= 0) state.firmSaaSFeatures[idx] = updated;

      if (
        state.currentFirmSaaSFeature?.firmSaaSFeatureId === updated.firmSaaSFeatureId
      ) {
        state.currentFirmSaaSFeature = updated;
      }
    });

    /* DELETE */
    builder.addCase(thunks.deleteFirmSaaSFeature.fulfilled, (state, action) => {
      state.firmSaaSFeatures = state.firmSaaSFeatures.filter(
        (x) => x.firmSaaSFeatureId !== action.payload.id
      );
    });
  },
});

export default firmSaaSFeatureSlice.reducer;
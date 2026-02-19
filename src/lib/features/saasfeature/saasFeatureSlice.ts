import { createSlice } from "@reduxjs/toolkit";

import { SaaSFeatureState, ApiError } from "./saasFeatureTypes";

/* 🔥 IMPORTANT — namespace import fixes SSR undefined thunk */
import * as thunks from "./saasFeatureThunks";

const initialState: SaaSFeatureState = {
  saasFeatures: [],
  currentSaaSFeature: null,
  loading: false,
  error: null,
};

const saasFeatureSlice = createSlice({
  name: "saasFeatures",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    /* ===============================
       GET ALL
    ================================ */

    builder.addCase(thunks.fetchSaaSFeatures.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(thunks.fetchSaaSFeatures.fulfilled, (state, action) => {
      state.loading = false;
      state.saasFeatures = action.payload ?? [];
    });

    builder.addCase(thunks.fetchSaaSFeatures.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as ApiError) ?? null;
    });

    /* ===============================
       GET BY ID
    ================================ */

    builder.addCase(thunks.fetchSaaSFeatureById.fulfilled, (state, action) => {
      state.currentSaaSFeature = action.payload ?? null;
    });

    /* ===============================
       CREATE
    ================================ */

    builder.addCase(thunks.createSaaSFeature.fulfilled, (state, action) => {
      if (action.payload?.saasFeature) {
        state.saasFeatures.unshift(action.payload.saasFeature);
      }
    });

    /* ===============================
       DELETE
    ================================ */

    builder.addCase(thunks.deleteSaaSFeature.fulfilled, (state, action) => {
      state.saasFeatures = state.saasFeatures.filter(
        (x) => x.saaSFeatureId !== action.payload.id
      );
    });

    /* ===============================
       UPDATE (optional)
    ================================ */

    builder.addCase(thunks.updateSaaSFeature.fulfilled, (state) => {
      // keep same behavior as examPaperSlice
    });
  },
});

export default saasFeatureSlice.reducer;

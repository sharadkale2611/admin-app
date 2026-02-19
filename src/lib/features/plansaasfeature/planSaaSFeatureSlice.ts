import { createSlice } from "@reduxjs/toolkit";

import { PlanSaaSFeatureState, ApiError } from "./planSaaSFeatureTypes";

/* 🔥 IMPORTANT — namespace import fixes SSR undefined thunk */
import * as thunks from "./planSaaSFeatureThunks";

const initialState: PlanSaaSFeatureState = {
  planSaaSFeatures: [],
  currentPlanSaaSFeature: null,
  loading: false,
  error: null,
};

const planSaaSFeatureSlice = createSlice({
  name: "planSaaSFeatures",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    /* ===============================
       GET ALL
    ================================ */

    builder.addCase(thunks.fetchPlanSaaSFeatures.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(
      thunks.fetchPlanSaaSFeatures.fulfilled,
      (state, action) => {
        state.loading = false;
        state.planSaaSFeatures = action.payload ?? [];
      }
    );

    builder.addCase(
      thunks.fetchPlanSaaSFeatures.rejected,
      (state, action) => {
        state.loading = false;
        state.error = (action.payload as ApiError) ?? null;
      }
    );

    /* ===============================
       GET BY ID
    ================================ */

    builder.addCase(
      thunks.fetchPlanSaaSFeatureById.fulfilled,
      (state, action) => {
        state.currentPlanSaaSFeature = action.payload ?? null;
      }
    );

    /* ===============================
       CREATE
    ================================ */

    builder.addCase(
      thunks.createPlanSaaSFeature.fulfilled,
      (state, action) => {
        if (action.payload?.planSaaSFeature) {
          state.planSaaSFeatures.unshift(
            action.payload.planSaaSFeature
          );
        }
      }
    );

    /* ===============================
       DELETE
    ================================ */

    builder.addCase(
      thunks.deletePlanSaaSFeature.fulfilled,
      (state, action) => {
        state.planSaaSFeatures = state.planSaaSFeatures.filter(
          (x) => x.planSaaSFeatureId !== action.payload.id
        );
      }
    );

    /* ===============================
       UPDATE (optional)
    ================================ */

    builder.addCase(thunks.updatePlanSaaSFeature.fulfilled, (state) => {
      // same behavior as subscriptionPlanSlice
    });
  },
});

export default planSaaSFeatureSlice.reducer;

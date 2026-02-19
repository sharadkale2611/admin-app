import { createSlice } from "@reduxjs/toolkit";
import { SubscriptionPlanState, ApiError } from "./subscriptionPlanTypes";
import * as thunks from "./subscriptionPlanThunks";

const initialState: SubscriptionPlanState = {
  subscriptionPlans: [],
  currentSubscriptionPlan: null,
  loading: false,
  error: null,
};

const subscriptionPlanSlice = createSlice({
  name: "subscriptionPlans",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(thunks.fetchSubscriptionPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(thunks.fetchSubscriptionPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.subscriptionPlans = action.payload ?? [];
      })
      .addCase(thunks.fetchSubscriptionPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as ApiError) ?? null;
      })

      .addCase(thunks.fetchSubscriptionPlanById.fulfilled, (state, action) => {
        state.currentSubscriptionPlan = action.payload ?? null;
      })

      .addCase(thunks.createSubscriptionPlan.fulfilled, (state, action) => {
        if (action.payload?.subscriptionPlan) {
          state.subscriptionPlans.unshift(action.payload.subscriptionPlan);
        }
      })

      .addCase(thunks.deleteSubscriptionPlan.fulfilled, (state, action) => {
        state.subscriptionPlans = state.subscriptionPlans.filter(
          (x) => x.planId !== action.payload.id
        );
      });
  },
});

export default subscriptionPlanSlice.reducer;

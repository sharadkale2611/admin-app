import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { RootState } from "@/lib/store";
import { fetchSubscriptionPlanById } from "./subscriptionPlanThunks";

export const useSubscriptionPlanDetailsViewModel = (id: string) => {
  const dispatch = useAppDispatch();

  const { currentSubscriptionPlan, loading, error } = useAppSelector(
    (state: RootState) => state.subscriptionPlans
  );

  useEffect(() => {
    if (id) dispatch(fetchSubscriptionPlanById(Number(id)));
  }, [dispatch, id]);

  return {
    subscriptionPlan: currentSubscriptionPlan,
    isLoading: loading,
    error,
  };
};

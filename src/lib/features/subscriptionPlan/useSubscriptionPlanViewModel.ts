import { useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchSubscriptionPlans } from "./subscriptionPlanThunks";
import { RootState } from "@/lib/store";

export const useSubscriptionPlanViewModel = () => {
  const dispatch = useAppDispatch();

  const { subscriptionPlans, loading, error } = useAppSelector(
    (state: RootState) => state.subscriptionPlans
  );

  const fetchData = useCallback(() => {
    dispatch(fetchSubscriptionPlans());
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    subscriptionPlans: subscriptionPlans ?? [],
    isLoading: loading,
    error,
    refetch: fetchData,
  };
};

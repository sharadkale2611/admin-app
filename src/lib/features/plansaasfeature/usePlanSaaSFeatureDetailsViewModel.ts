import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect } from "react";
import { fetchPlanSaaSFeatureById } from "./planSaaSFeatureThunks";
import { RootState } from "@/lib/store";

export const usePlanSaaSFeatureDetailsViewModel = (id: string) => {
  const dispatch = useAppDispatch();

  const { currentPlanSaaSFeature, loading, error } = useAppSelector(
    (state: RootState) => state.planSaaSFeatures
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchPlanSaaSFeatureById(Number(id)));
    }
  }, [dispatch, id]);

  return {
    planSaaSFeature: currentPlanSaaSFeature,
    isLoading: loading,
    error,
  };
};

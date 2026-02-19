import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect } from "react";
import { fetchSaaSFeatureById } from "./saasFeatureThunks";
import { RootState } from "@/lib/store";

export const useSaaSFeatureDetailsViewModel = (id: string) => {
  const dispatch = useAppDispatch();

  const { currentSaaSFeature, loading, error } = useAppSelector(
    (state: RootState) => state.saasFeatures
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchSaaSFeatureById(Number(id)));
    }
  }, [dispatch, id]);

  return {
    saasFeature: currentSaaSFeature,
    isLoading: loading,
    error, 
  };
};

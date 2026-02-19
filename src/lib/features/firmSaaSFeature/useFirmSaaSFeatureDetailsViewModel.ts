"use client";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect } from "react";
import { fetchFirmSaaSFeatureById } from "./firmSaaSFeatureThunks";
import { RootState } from "@/lib/store";

export const useFirmSaaSFeatureDetailsViewModel = (id: string) => {
  const dispatch = useAppDispatch();

  const { currentFirmSaaSFeature, loading, error } = useAppSelector(
    (state: RootState) => state.firmSaaSFeatures
  );

  useEffect(() => {
    if (id) dispatch(fetchFirmSaaSFeatureById(Number(id)));
  }, [dispatch, id]);

  return {
    firmSaaSFeature: currentFirmSaaSFeature,
    isLoading: loading,
    error,
  };
};
"use client";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect, useCallback } from "react";
import type { RootState } from "@/lib/store";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";

import {
  fetchFirmSaaSFeatureUsage,
  fetchFirmSaaSFeatureUsageByKeys,
  createFirmSaaSFeatureUsage,
  updateFirmSaaSFeatureUsage,
  deleteFirmSaaSFeatureUsage,
} from "./firmSaaSFeatureUsageThunks";

import type {
  CreateFirmSaaSFeatureUsageDto,
  UpdateFirmSaaSFeatureUsageDto,
} from "./firmSaaSFeatureUsageTypes";

export const useFirmSaaSFeatureUsageViewModel = () => {
  const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useAppDispatch();

  const { items, current, loading, error } = useAppSelector(
    (state: RootState) => state.firmSaaSFeatureUsage
  );

  const fetchData = useCallback(() => {
    dispatch(fetchFirmSaaSFeatureUsage());
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getByKeys = useCallback(
    (firmId: number, saasFeatureId: number) =>
      dispatch(fetchFirmSaaSFeatureUsageByKeys({ firmId, saasFeatureId })),
    [dispatch]
  );

  const create = useCallback(
    (dto: CreateFirmSaaSFeatureUsageDto) => dispatch(createFirmSaaSFeatureUsage(dto)),
    [dispatch]
  );

  const update = useCallback(
    (firmId: number, saasFeatureId: number, dto: UpdateFirmSaaSFeatureUsageDto) =>
      dispatch(updateFirmSaaSFeatureUsage({ firmId, saasFeatureId, dto })),
    [dispatch]
  );

  const remove = useCallback(
    (firmId: number, saasFeatureId: number) =>
      dispatch(deleteFirmSaaSFeatureUsage({ firmId, saasFeatureId })),
    [dispatch]
  );

  return {
    items: items ?? [],
    current,
    isLoading: loading,
    error,
    refetch: fetchData,
    getByKeys,
    create,
    update,
    remove,
  };
};
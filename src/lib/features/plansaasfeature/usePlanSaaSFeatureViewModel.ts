import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect, useCallback } from "react";
import type { RootState } from "@/lib/store";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";

import {
  fetchPlanSaaSFeatures,
  fetchPlanSaaSFeatureById,
  createPlanSaaSFeature,
  updatePlanSaaSFeature,
  deletePlanSaaSFeature,
} from "./planSaaSFeatureThunks";

import {
  CreatePlanSaaSFeatureDto,
  UpdatePlanSaaSFeatureDto,
} from "./planSaaSFeatureTypes";

export const usePlanSaaSFeatureViewModel = () => {
  const dispatch: ThunkDispatch<RootState, unknown, AnyAction> =
    useAppDispatch();

  const {
    planSaaSFeatures,
    currentPlanSaaSFeature,
    loading,
    error,
  } = useAppSelector((state: RootState) => state.planSaaSFeatures);

  const safePlanSaaSFeatures = planSaaSFeatures || [];

  /* ===============================
     Fetch List
  ================================ */

  const fetchData = useCallback(() => {
    dispatch(fetchPlanSaaSFeatures());
  }, [dispatch]);

  /* ===============================
     Initial Load
  ================================ */

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* ===============================
     Action Handlers
  ================================ */

  const handleGetById = useCallback(
    (id: number) => {
      dispatch(fetchPlanSaaSFeatureById(id));
    },
    [dispatch]
  );

  const handleCreate = useCallback(
    (dto: CreatePlanSaaSFeatureDto) => {
      return dispatch(createPlanSaaSFeature(dto));
    },
    [dispatch]
  );

  const handleUpdate = useCallback(
    (id: number, dto: UpdatePlanSaaSFeatureDto) => {
      return dispatch(updatePlanSaaSFeature({ id, dto }));
    },
    [dispatch]
  );

  const handleDelete = useCallback(
    (id: number) => {
      return dispatch(deletePlanSaaSFeature(id));
    },
    [dispatch]
  );

  return {
    /* ===== State ===== */

    planSaaSFeatures: safePlanSaaSFeatures,
    currentPlanSaaSFeature,
    isLoading: loading,
    error,

    /* ===== Actions ===== */

    getById: handleGetById,
    create: handleCreate,
    update: handleUpdate,
    remove: handleDelete,
    refetch: fetchData,
  };
};

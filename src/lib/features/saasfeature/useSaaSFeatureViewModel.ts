import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect, useCallback } from "react";
import type { RootState } from "@/lib/store";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";

import {
  fetchSaaSFeatures,
  fetchSaaSFeatureById,
  createSaaSFeature,
  updateSaaSFeature,
  deleteSaaSFeature,
} from "./saasFeatureThunks";

import {
  CreateSaaSFeatureDto,
  UpdateSaaSFeatureDto,
} from "./saasFeatureTypes";

export const useSaaSFeatureViewModel = () => {
  const dispatch: ThunkDispatch<RootState, unknown, AnyAction> =
    useAppDispatch();

  const {
    saasFeatures,
    currentSaaSFeature,
    loading,
    error,
  } = useAppSelector((state: RootState) => state.saasFeatures);

  const safeSaaSFeatures = saasFeatures || [];

  /* ===============================
     Fetch SaaS Features
  ================================ */

  const fetchData = useCallback(() => {
    dispatch(fetchSaaSFeatures());
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
      dispatch(fetchSaaSFeatureById(id));
    },
    [dispatch]
  );

  const handleCreate = useCallback(
    (dto: CreateSaaSFeatureDto) => {
      return dispatch(createSaaSFeature(dto));
    },
    [dispatch]
  );

  const handleUpdate = useCallback(
    (id: number, dto: UpdateSaaSFeatureDto) => {
      return dispatch(updateSaaSFeature({ id, dto }));
    },
    [dispatch]
  );

  const handleDelete = useCallback(
    (id: number) => {
      return dispatch(deleteSaaSFeature(id));
    },
    [dispatch]
  );

  return {
    /* ===== State ===== */

    saasFeatures: safeSaaSFeatures,
    currentSaaSFeature,
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

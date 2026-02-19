"use client";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect, useCallback } from "react";
import type { RootState } from "@/lib/store";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";

import {
  fetchFirmSaaSFeatures,
  fetchFirmSaaSFeatureById,
  createFirmSaaSFeature,
  updateFirmSaaSFeature,
  deleteFirmSaaSFeature,
} from "./firmSaaSFeatureThunks";

import {
  CreateFirmSaaSFeatureDto,
  UpdateFirmSaaSFeatureDto,
} from "./firmSaaSFeatureTypes";

export const useFirmSaaSFeatureViewModel = () => {
  const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useAppDispatch();

  const { firmSaaSFeatures, currentFirmSaaSFeature, loading, error } = useAppSelector(
    (state: RootState) => state.firmSaaSFeatures
  );

  const safeItems = firmSaaSFeatures || [];

  /* ===============================
     Fetch list
  ================================ */

  const fetchData = useCallback(() => {
    dispatch(fetchFirmSaaSFeatures());
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* ===============================
     Actions
  ================================ */

  const handleGetById = useCallback(
    (id: number) => {
      dispatch(fetchFirmSaaSFeatureById(id));
    },
    [dispatch]
  );

  const handleCreate = useCallback(
    (dto: CreateFirmSaaSFeatureDto) => dispatch(createFirmSaaSFeature(dto)),
    [dispatch]
  );

  const handleUpdate = useCallback(
    (id: number, dto: UpdateFirmSaaSFeatureDto) =>
      dispatch(updateFirmSaaSFeature({ id, dto })),
    [dispatch]
  );

  const handleDelete = useCallback(
    (id: number) => dispatch(deleteFirmSaaSFeature(id)),
    [dispatch]
  );

  return {
    /* State */
    firmSaaSFeatures: safeItems,
    currentFirmSaaSFeature,
    isLoading: loading,
    error,

    /* Actions */
    getById: handleGetById,
    create: handleCreate,
    update: handleUpdate,
    remove: handleDelete,
    refetch: fetchData,
  };
};
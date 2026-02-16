import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect, useCallback } from "react";
import type { RootState } from "@/lib/store";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";

import {
  fetchExamAttempts,
  fetchExamAttemptById,
  createExamAttempt,
  updateExamAttempt,
  deleteExamAttempt,
} from "./examAttemptThunks";

import {
  CreateExamAttemptDto,
  UpdateExamAttemptDto,
} from "./examAttemptTypes";

export const useExamAttemptViewModel = () => {
  const dispatch: ThunkDispatch<RootState, unknown, AnyAction> =
    useAppDispatch();

  const {
    attempts,
    currentAttempt,
    loading,
    error,
  } = useAppSelector((state: RootState) => state.examAttempts);

  const safeAttempts = attempts || [];

  /* ===============================
     Fetch Attempts
  ================================ */

  const fetchAttemptData = useCallback(() => {
    dispatch(fetchExamAttempts());
  }, [dispatch]);

  /* ===============================
     Initial Load
  ================================ */

  useEffect(() => {
    fetchAttemptData();
  }, [fetchAttemptData]);

  /* ===============================
     Action Handlers
  ================================ */

  const handleGetById = useCallback(
    (id: number) => {
      dispatch(fetchExamAttemptById(id));
    },
    [dispatch]
  );

  const handleCreate = useCallback(
    (dto: CreateExamAttemptDto) => {
      return dispatch(createExamAttempt(dto));
    },
    [dispatch]
  );

  const handleUpdate = useCallback(
    (id: number, dto: UpdateExamAttemptDto) => {
      return dispatch(updateExamAttempt({ id, dto }));
    },
    [dispatch]
  );

  const handleDelete = useCallback(
    (id: number) => {
      return dispatch(deleteExamAttempt(id));
    },
    [dispatch]
  );

  return {
    /* ===== State ===== */

    attempts: safeAttempts,
    currentAttempt,
    isLoading: loading,
    error,

    /* ===== Actions ===== */

    getById: handleGetById,
    create: handleCreate,
    update: handleUpdate,
    remove: handleDelete,
    refetch: fetchAttemptData,
  };
};

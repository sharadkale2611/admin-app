import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect, useCallback } from "react";
import type { RootState } from "@/lib/store";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";

import {
  fetchQuestionOptions,
  fetchQuestionOptionById,
  createQuestionOption,
  updateQuestionOption,
  deleteQuestionOption,
} from "./questionOptionThunks";

import {
  CreateQuestionOptionDto,
  UpdateQuestionOptionDto,
} from "./questionOptionTypes";

export const useQuestionOptionViewModel = () => {
  const dispatch: ThunkDispatch<RootState, unknown, AnyAction> =
    useAppDispatch();

  const {
    options,
    currentOption,
    loading,
    error,
  } = useAppSelector((state: RootState) => state.questionOptions);

  const safeOptions = options || [];

  /* ===============================
     Fetch Options
  ================================ */

  const fetchOptionData = useCallback(() => {
    dispatch(fetchQuestionOptions());
  }, [dispatch]);

  /* ===============================
     Initial Load
  ================================ */

  useEffect(() => {
    fetchOptionData();
  }, [fetchOptionData]);

  /* ===============================
     Action Handlers
  ================================ */

  const handleGetById = useCallback(
    (id: number) => {
      dispatch(fetchQuestionOptionById(id));
    },
    [dispatch]
  );

  const handleCreate = useCallback(
    (dto: CreateQuestionOptionDto) => {
      return dispatch(createQuestionOption(dto));
    },
    [dispatch]
  );

  const handleUpdate = useCallback(
    (id: number, dto: UpdateQuestionOptionDto) => {
      return dispatch(updateQuestionOption({ id, dto }));
    },
    [dispatch]
  );

  const handleDelete = useCallback(
    (id: number) => {
      return dispatch(deleteQuestionOption(id));
    },
    [dispatch]
  );

  /* ===============================
     Fetch By Question (Optional Helper)
  ================================ */

  const fetchByQuestion = useCallback(
    (questionId: number) => {
      return dispatch(fetchQuestionOptions({ questionId }));
    },
    [dispatch]
  );

  return {
    /* ===== State ===== */
    options: safeOptions,
    currentOption,
    isLoading: loading,
    error,

    /* ===== Actions ===== */
    getById: handleGetById,
    create: handleCreate,
    update: handleUpdate,
    remove: handleDelete,
    refetch: fetchOptionData,
    fetchByQuestion,
  };
};

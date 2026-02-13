import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect, useCallback } from "react";
import type { RootState } from "@/lib/store";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";

import {
  fetchQuestionTypes,
  fetchQuestionTypeById,
  createQuestionType,
  updateQuestionType,
  deleteQuestionType,
  fetchQuestionTypesPaginated,
} from "./questionTypeThunks";

import {
  CreateQuestionTypeDto,
  UpdateQuestionTypeDto,
} from "./questionTypeTypes";

export const useQuestionTypeViewModel = () => {
  const dispatch: ThunkDispatch<RootState, unknown, AnyAction> =
    useAppDispatch();

  const {
    questionTypes,
    currentQuestionType,
    loading,
    error,
  } = useAppSelector((state: RootState) => state.questionTypes);

  const safeQuestionTypes = questionTypes || [];

  /* ===============================
     Fetch Question Types
  ================================ */

  const fetchQuestionTypeData = useCallback(() => {
    dispatch(fetchQuestionTypes());
  }, [dispatch]);

  /* ===============================
     Initial Load
  ================================ */

  useEffect(() => {
    fetchQuestionTypeData();
  }, [fetchQuestionTypeData]);

  /* ===============================
     Action Handlers
  ================================ */

  const handleGetById = useCallback(
    (id: number) => {
      dispatch(fetchQuestionTypeById(id));
    },
    [dispatch]
  );

  const handleCreate = useCallback(
    (dto: CreateQuestionTypeDto) => {
      return dispatch(createQuestionType(dto));
    },
    [dispatch]
  );

  const handleUpdate = useCallback(
    (dto: UpdateQuestionTypeDto) => {
      return dispatch(updateQuestionType(dto));
    },
    [dispatch]
  );

  const handleDelete = useCallback(
    (id: number) => {
      return dispatch(deleteQuestionType(id));
    },
    [dispatch]
  );

  /* ===============================
     Paginated Fetch (Optional)
  ================================ */

  const fetchPaginated = useCallback(
    (params: {
      pageNumber?: number;
      pageSize?: number;
      search?: string;
      isActive?: boolean | null;
    }) => {
      return dispatch(fetchQuestionTypesPaginated(params));
    },
    [dispatch]
  );

  return {
    /* ===== State ===== */
    questionTypes: safeQuestionTypes,
    currentQuestionType,
    isLoading: loading,
    error,

    /* ===== Actions ===== */
    getById: handleGetById,
    create: handleCreate,
    update: handleUpdate,
    remove: handleDelete,
    refetch: fetchQuestionTypeData,
    fetchPaginated,
  };
};

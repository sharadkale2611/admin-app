import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect, useCallback } from "react";
import type { RootState } from "@/lib/store";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";

import {
  fetchQuestions,
  fetchQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  fetchQuestionsPaginated,
} from "./questionThunks";

import {
  CreateQuestionDto,
  UpdateQuestionDto,
} from "./questionTypes";

export const useQuestionViewModel = () => {
  const dispatch: ThunkDispatch<RootState, unknown, AnyAction> =
    useAppDispatch();

  const {
    questions,
    currentQuestion,
    loading,
    error,
  } = useAppSelector((state: RootState) => state.questions);

  const safeQuestions = questions || [];

  /* ===============================
     Fetch Questions
  ================================ */

  const fetchQuestionData = useCallback(() => {
    dispatch(fetchQuestions());
  }, [dispatch]);

  /* ===============================
     Initial Load
  ================================ */

  useEffect(() => {
    fetchQuestionData();
  }, [fetchQuestionData]);

  /* ===============================
     Action Handlers
  ================================ */

  const handleGetById = useCallback(
    (id: number) => {
      dispatch(fetchQuestionById(id));
    },
    [dispatch]
  );

  const handleCreate = useCallback(
    (dto: CreateQuestionDto) => {
      return dispatch(createQuestion(dto));
    },
    [dispatch]
  );

  const handleUpdate = useCallback(
    (id: number, dto: UpdateQuestionDto) => {
      return dispatch(updateQuestion({ id, dto }));
    },
    [dispatch]
  );

  const handleDelete = useCallback(
    (id: number) => {
      return dispatch(deleteQuestion(id));
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
    }) => {
      return dispatch(fetchQuestionsPaginated(params));
    },
    [dispatch]
  );

  return {
    /* ===== State ===== */
    questions: safeQuestions,
    currentQuestion,
    isLoading: loading,
    error,

    /* ===== Actions ===== */
    getById: handleGetById,
    create: handleCreate,
    update: handleUpdate,
    remove: handleDelete,
    refetch: fetchQuestionData,
    fetchPaginated,
  };
};

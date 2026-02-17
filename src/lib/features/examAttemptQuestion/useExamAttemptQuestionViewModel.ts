import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect, useCallback } from "react";
import type { RootState } from "@/lib/store";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";

import {
  fetchExamAttemptQuestions,
  fetchExamAttemptQuestionById,
  createExamAttemptQuestion,
  updateExamAttemptQuestion,
  deleteExamAttemptQuestion,
  fetchQuestionsByAttemptId,
} from "./examAttemptQuestionThunks";

import {
  CreateExamAttemptQuestionDto,
  UpdateExamAttemptQuestionDto,
} from "./examAttemptQuestionTypes";

export const useExamAttemptQuestionViewModel = () => {
  const dispatch: ThunkDispatch<RootState, unknown, AnyAction> =
    useAppDispatch();

  const {
    attemptQuestions,
    currentAttemptQuestion,
    loading,
    error,
  } = useAppSelector(
    (state: RootState) => state.examAttemptQuestions
  );

  const safeAttemptQuestions = attemptQuestions || [];

  /* ===============================
     Fetch All Attempt Questions
  ================================ */

  const fetchAttemptQuestionData = useCallback(() => {
    dispatch(fetchExamAttemptQuestions());
  }, [dispatch]);

  /* ===============================
     Initial Load
  ================================ */

  useEffect(() => {
    fetchAttemptQuestionData();
  }, [fetchAttemptQuestionData]);

  /* ===============================
     Action Handlers
  ================================ */

  const handleGetById = useCallback(
    (id: number) => {
      dispatch(fetchExamAttemptQuestionById(id));
    },
    [dispatch]
  );

  const handleGetByAttemptId = useCallback(
    (attemptId: number) => {
      dispatch(fetchQuestionsByAttemptId(attemptId));
    },
    [dispatch]
  );

  const handleCreate = useCallback(
    (dto: CreateExamAttemptQuestionDto) => {
      return dispatch(createExamAttemptQuestion(dto));
    },
    [dispatch]
  );

  const handleUpdate = useCallback(
    (id: number, dto: UpdateExamAttemptQuestionDto) => {
      return dispatch(updateExamAttemptQuestion({ id, dto }));
    },
    [dispatch]
  );

  const handleDelete = useCallback(
    (id: number) => {
      return dispatch(deleteExamAttemptQuestion(id));
    },
    [dispatch]
  );

  return {
    /* ===== State ===== */

    attemptQuestions: safeAttemptQuestions,
    currentAttemptQuestion,
    isLoading: loading,
    error,

    /* ===== Actions ===== */

    getById: handleGetById,
    getByAttemptId: handleGetByAttemptId,
    create: handleCreate,
    update: handleUpdate,
    remove: handleDelete,
    refetch: fetchAttemptQuestionData,
  };
};

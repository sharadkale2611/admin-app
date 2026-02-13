import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect, useCallback } from "react";
import type { RootState } from "@/lib/store";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";

import {
  fetchQuestionAnswers,
  fetchQuestionAnswerById,
  createQuestionAnswer,
  updateQuestionAnswer,
  deleteQuestionAnswer,
} from "./questionAnswerThunks";

import {
  CreateQuestionAnswerDto,
  UpdateQuestionAnswerDto,
} from "./questionAnswerTypes";

export const useQuestionAnswerViewModel = () => {
  const dispatch: ThunkDispatch<RootState, unknown, AnyAction> =
    useAppDispatch();

  const {
    answers,
    currentAnswer,
    loading,
    error,
  } = useAppSelector((state: RootState) => state.questionAnswers);

  const safeAnswers = answers || [];

  /* ===============================
     Fetch Answers
  ================================ */

  const fetchAnswerData = useCallback(() => {
    dispatch(fetchQuestionAnswers());
  }, [dispatch]);

  /* ===============================
     Initial Load
  ================================ */

  useEffect(() => {
    fetchAnswerData();
  }, [fetchAnswerData]);

  /* ===============================
     Action Handlers
  ================================ */

  const handleGetById = useCallback(
    (id: number) => {
      dispatch(fetchQuestionAnswerById(id));
    },
    [dispatch]
  );

  const handleCreate = useCallback(
    (dto: CreateQuestionAnswerDto) => {
      return dispatch(createQuestionAnswer(dto));
    },
    [dispatch]
  );

  const handleUpdate = useCallback(
    (id: number, dto: UpdateQuestionAnswerDto) => {
      return dispatch(updateQuestionAnswer({ id, dto }));
    },
    [dispatch]
  );

  const handleDelete = useCallback(
    (id: number) => {
      return dispatch(deleteQuestionAnswer(id));
    },
    [dispatch]
  );

  /* ===============================
     Fetch By Question (Optional Helper)
  ================================ */

  const fetchByQuestion = useCallback(
    (questionId: number) => {
      return dispatch(fetchQuestionAnswers({ questionId }));
    },
    [dispatch]
  );

  return {
    /* ===== State ===== */
    answers: safeAnswers,
    currentAnswer,
    isLoading: loading,
    error,

    /* ===== Actions ===== */
    getById: handleGetById,
    create: handleCreate,
    update: handleUpdate,
    remove: handleDelete,
    refetch: fetchAnswerData,
    fetchByQuestion,
  };
};


import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect, useCallback } from "react";
import type { RootState } from "@/lib/store";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";

import {
  fetchStudentAnswers,
  fetchStudentAnswerById,
  createStudentAnswer,
  updateStudentAnswer,
  deleteStudentAnswer,
} from "./studentAnswerThunks";

import {
  CreateStudentAnswerDto,
  UpdateStudentAnswerDto,
} from "./studentAnswerTypes";

export const useStudentAnswerViewModel = () => {
  const dispatch: ThunkDispatch<RootState, unknown, AnyAction> =
    useAppDispatch();

  const {
    studentAnswers,
    currentStudentAnswer,
    loading,
    error,
  } = useAppSelector(
    (state: RootState) => state.studentAnswers
  );

  const safeStudentAnswers = studentAnswers || [];

  /* ===============================
     Fetch All Student Answers
  ================================ */

  const fetchStudentAnswerData = useCallback(() => {
    dispatch(fetchStudentAnswers());
  }, [dispatch]);

  /* ===============================
     Initial Load
  ================================ */

  useEffect(() => {
    fetchStudentAnswerData();
  }, [fetchStudentAnswerData]);

  /* ===============================
     Action Handlers
  ================================ */

  const handleGetById = useCallback(
    (id: number) => {
      dispatch(fetchStudentAnswerById(id));
    },
    [dispatch]
  );

  const handleCreate = useCallback(
    (dto: CreateStudentAnswerDto) => {
      return dispatch(createStudentAnswer(dto));
    },
    [dispatch]
  );

  const handleUpdate = useCallback(
    (id: number, dto: UpdateStudentAnswerDto) => {
      return dispatch(updateStudentAnswer({ id, dto }));
    },
    [dispatch]
  );

  const handleDelete = useCallback(
    (id: number) => {
      return dispatch(deleteStudentAnswer(id));
    },
    [dispatch]
  );

  return {
    /* ===== State ===== */

    studentAnswers: safeStudentAnswers,
    currentStudentAnswer,
    isLoading: loading,
    error,

    /* ===== Actions ===== */

    getById: handleGetById,
    create: handleCreate,
    update: handleUpdate,
    remove: handleDelete,
    refetch: fetchStudentAnswerData,
  };
};

"use client";

import { useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import type { RootState } from "@/lib/store";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";

import {
  fetchExamPaperQuestions,
  deleteExamPaperQuestion,
} from "./examPaperQuestionThunks";

/* 🔥 ADD THESE */
import { fetchExamPapers } from "@/lib/features/exampaper/examPaperThunks";
import { fetchQuestions } from "@/lib/features/question/questionThunks";

export const useExamPaperQuestionViewModel = () => {
  const dispatch: ThunkDispatch<RootState, unknown, AnyAction> =
    useAppDispatch();

  const { examPaperQuestions, loading, error } =
    useAppSelector((state: RootState) => state.examPaperQuestions);

  const examPapers = useAppSelector(
    (state: RootState) => state.examPapers?.examPapers ?? []
  );

  const questions = useAppSelector(
    (state: RootState) => state.questions?.questions ?? []
  );

  /* =========================
     FETCH ALL DATA
  ========================== */
  const fetchData = useCallback(() => {
    dispatch(fetchExamPaperQuestions());

    /* 🔥 IMPORTANT — load dropdown data */
    dispatch(fetchExamPapers());
    dispatch(fetchQuestions());
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = (id: number) => {
    return dispatch(deleteExamPaperQuestion(id));
  };

  return {
    examPaperQuestions: examPaperQuestions ?? [],
    examPapers,
    questions,
    isLoading: loading,
    error,
    refetch: fetchData,
    handleDelete,
  };
};

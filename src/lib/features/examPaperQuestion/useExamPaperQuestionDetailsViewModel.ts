"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import type { RootState } from "@/lib/store";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";

import { fetchExamPaperQuestionById } from "./examPaperQuestionThunks";

export const useExamPaperQuestionDetailsViewModel = (
  examPaperQuestionId: string
) => {
  const dispatch: ThunkDispatch<
    RootState,
    unknown,
    AnyAction
  > = useAppDispatch();

  const { currentExamPaperQuestion, loading, error } =
    useAppSelector(
      (state: RootState) => state.examPaperQuestions
    );

  useEffect(() => {
    if (
      examPaperQuestionId &&
      (!currentExamPaperQuestion ||
        currentExamPaperQuestion.examPaperQuestionId !==
          Number(examPaperQuestionId))
    ) {
      dispatch(
        fetchExamPaperQuestionById(
          Number(examPaperQuestionId)
        )
      );
    }
  }, [
    dispatch,
    examPaperQuestionId,
    currentExamPaperQuestion,
  ]);

  return {
    examPaperQuestion: currentExamPaperQuestion,
    isLoading: loading,
    error,
  };
};

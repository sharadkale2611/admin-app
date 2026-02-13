import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import type { RootState } from "@/lib/store";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { fetchQuestionTypeById } from "./questionTypeThunks";

export const useQuestionTypeDetailsViewModel = (
  questionTypeId: string
) => {
  const dispatch: ThunkDispatch<RootState, unknown, AnyAction> =
    useAppDispatch();

  const { currentQuestionType, loading, error } =
    useAppSelector((state: RootState) => state.questionTypes);

  useEffect(() => {
    if (questionTypeId && !currentQuestionType) {
      dispatch(fetchQuestionTypeById(Number(questionTypeId)));
    }
  }, [dispatch, questionTypeId, currentQuestionType]);

  return {
    questionType: currentQuestionType,
    isLoading: loading,
    error,
  };
};

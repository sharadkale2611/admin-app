import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import type { RootState } from "@/lib/store";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { fetchQuestionById } from "./questionThunks";

export const useQuestionDetailsViewModel = (
  questionId: string
) => {
  const dispatch: ThunkDispatch<
    RootState,
    unknown,
    AnyAction
  > = useAppDispatch();

  const { currentQuestion, loading, error } =
    useAppSelector(
      (state: RootState) => state.questions
    );

  useEffect(() => {
    if (
      questionId &&
      (!currentQuestion ||
        currentQuestion.questionId !==
          Number(questionId))
    ) {
      dispatch(fetchQuestionById(Number(questionId)));
    }
  }, [dispatch, questionId, currentQuestion]);

  return {
    question: currentQuestion,
    isLoading: loading,
    error,
  };
};

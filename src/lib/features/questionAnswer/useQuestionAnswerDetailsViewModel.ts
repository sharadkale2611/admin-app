import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import type { RootState } from "@/lib/store";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { fetchQuestionAnswerById } from "./questionAnswerThunks";

export const useQuestionAnswerDetailsViewModel = (
  answerId: string
) => {
  const dispatch: ThunkDispatch<
    RootState,
    unknown,
    AnyAction
  > = useAppDispatch();

  const { currentAnswer, loading, error } =
    useAppSelector(
      (state: RootState) =>
        state.questionAnswers
    );

  useEffect(() => {
    if (
      answerId &&
      (!currentAnswer ||
        currentAnswer.questionAnswerId !==
          Number(answerId))
    ) {
      dispatch(
        fetchQuestionAnswerById(
          Number(answerId)
        )
      );
    }
  }, [dispatch, answerId, currentAnswer]);

  return {
    answer: currentAnswer,
    isLoading: loading,
    error,
  };
};
    
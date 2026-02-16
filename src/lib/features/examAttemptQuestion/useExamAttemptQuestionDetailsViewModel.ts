import { useEffect } from "react";

import {
  useAppDispatch,
  useAppSelector,
} from "@/lib/hooks";

import type { RootState } from "@/lib/store";

import {
  AnyAction,
  ThunkDispatch,
} from "@reduxjs/toolkit";

import {
  fetchExamAttemptQuestionById,
} from "./examAttemptQuestionThunks";


export const useExamAttemptQuestionDetailsViewModel = (
  attemptQuestionId: string
) => {

  const dispatch: ThunkDispatch<
    RootState,
    unknown,
    AnyAction
  > = useAppDispatch();


  const {
    currentAttemptQuestion,
    loading,
    error,
  } = useAppSelector(
    (state: RootState) =>
      state.examAttemptQuestions
  );


  useEffect(() => {

    if (
      attemptQuestionId &&
      (!currentAttemptQuestion ||
        currentAttemptQuestion.attemptQuestionId !==
          Number(attemptQuestionId))
    ) {

      dispatch(
        fetchExamAttemptQuestionById(
          Number(attemptQuestionId)
        )
      );

    }

  }, [
    dispatch,
    attemptQuestionId,
    currentAttemptQuestion,
  ]);


  return {

    attemptQuestion: currentAttemptQuestion,

    isLoading: loading,

    error,

  };

};

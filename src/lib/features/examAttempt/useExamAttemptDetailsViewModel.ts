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
  fetchExamAttemptById,
} from "./examAttemptThunks";


export const useExamAttemptDetailsViewModel = (
  attemptId: string
) => {

  const dispatch: ThunkDispatch<
    RootState,
    unknown,
    AnyAction
  > = useAppDispatch();


  const {
    currentAttempt,
    loading,
    error,
  } = useAppSelector(
    (state: RootState) =>
      state.examAttempts
  );


  useEffect(() => {

    if (
      attemptId &&
      (!currentAttempt ||
        currentAttempt.examAttemptId !==
          Number(attemptId))
    ) {

      dispatch(
        fetchExamAttemptById(
          Number(attemptId)
        )
      );

    }

  }, [
    dispatch,
    attemptId,
    currentAttempt,
  ]);


  return {

    attempt: currentAttempt,

    isLoading: loading,

    error,

  };

};

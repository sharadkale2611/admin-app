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
  fetchStudentAnswerById,
} from "./studentAnswerThunks";


export const useStudentAnswerDetailsViewModel = (
  studentAnswerId: string
) => {

  const dispatch: ThunkDispatch<
    RootState,
    unknown,
    AnyAction
  > = useAppDispatch();


  const {
    currentStudentAnswer,
    loading,
    error,
  } = useAppSelector(
    (state: RootState) =>
      state.studentAnswers
  );


  useEffect(() => {

    if (
      studentAnswerId &&
      (!currentStudentAnswer ||
        currentStudentAnswer.studentAnswerId !==
          Number(studentAnswerId))
    ) {

      dispatch(
        fetchStudentAnswerById(
          Number(studentAnswerId)
        )
      );

    }

  }, [
    dispatch,
    studentAnswerId,
    currentStudentAnswer,
  ]);


  return {

    studentAnswer: currentStudentAnswer,

    isLoading: loading,

    error,

  };

};

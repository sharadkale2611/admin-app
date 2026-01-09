import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchExamById } from "./examThunks";
import { useEffect } from "react";
import type { RootState } from "@/lib/store";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";

export const useExamDetailsViewModel = (examId: number) => {
  const dispatch: ThunkDispatch<RootState, unknown, AnyAction> =
    useAppDispatch();

  const { currentExam, loading, error } = useAppSelector(
    (state: RootState) => state.exam
  );

  useEffect(() => {
    if (examId) {
      dispatch(fetchExamById(examId));
    }
  }, [dispatch, examId]);

  return {
    exam: currentExam,
    isLoading: loading,
    error,
  };
};

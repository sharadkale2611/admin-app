import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchExamMarkById } from "./examMarksThunks";
import type { RootState } from "@/lib/store";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";

export const useExamMarkDetailsViewModel = (id: number) => {
  const dispatch: ThunkDispatch<RootState, unknown, AnyAction> =
    useAppDispatch();

  const { currentExamMark, loading, error } = useAppSelector(
    (state: RootState) => state.examMarks
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchExamMarkById(id));
    }
  }, [dispatch, id]);

  return {
    examMark: currentExamMark,
    isLoading: loading,
    error,
  };
};

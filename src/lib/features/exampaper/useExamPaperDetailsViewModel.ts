import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import type { RootState } from "@/lib/store";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { fetchExamPaperById } from "./examPaperThunks";

export const useExamPaperDetailsViewModel = (
  examPaperId: string
) => {
  const dispatch: ThunkDispatch<
    RootState,
    unknown,
    AnyAction
  > = useAppDispatch();

  const { currentExamPaper, loading, error } =
    useAppSelector(
      (state: RootState) => state.examPapers
    );

  useEffect(() => {
    if (
      examPaperId &&
      (!currentExamPaper ||
        currentExamPaper.examPaperId !==
          Number(examPaperId))
    ) {
      dispatch(
        fetchExamPaperById(Number(examPaperId))
      );
    }
  }, [dispatch, examPaperId, currentExamPaper]);

  return {
    examPaper: currentExamPaper,
    isLoading: loading,
    error,
  };
};

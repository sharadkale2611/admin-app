import { useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import type { RootState } from "@/lib/store";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import {
  setExamFilter,
  setStudentFilter,
  setStatusFilter,
  setExamMarksPage,
  resetExamMarksFilters,
} from "./examMarksSlice";
import { fetchExamMarksPaginated } from "./examMarksThunks";

export const useExamMarksViewModel = () => {
  const dispatch: ThunkDispatch<RootState, unknown, AnyAction> =
    useAppDispatch();

  const {
    items,
    loading,
    error,
    currentPage,
    totalPages,
    pageSize,
    examId,
    studentId,
    status,
  } = useAppSelector((state: RootState) => state.examMarks);

  const safeItems = items || [];

  const fetchData = useCallback(() => {
    // Do not load anything until at least one filter is selected
    if (examId === null && studentId === null) return;

    dispatch(
      fetchExamMarksPaginated({
        page: currentPage,
        pageSize,
        examId,
        studentId,
        status,
      })
    );
  }, [dispatch, currentPage, pageSize, examId, studentId, status]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleExamChange = useCallback(
    (id: number | null) => {
      dispatch(setExamFilter(id));
    },
    [dispatch]
  );

  const handleStudentChange = useCallback(
    (id: number | null) => {
      dispatch(setStudentFilter(id));
    },
    [dispatch]
  );

  const handleStatusChange = useCallback(
    (value: boolean | null) => {
      dispatch(setStatusFilter(value));
    },
    [dispatch]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) {
        dispatch(setExamMarksPage(page));
      }
    },
    [dispatch, totalPages]
  );

  const handleResetFilters = useCallback(() => {
    dispatch(resetExamMarksFilters());
  }, [dispatch]);

  return {
    examMarks: safeItems,
    isLoading: loading,
    error,
    page: currentPage,
    totalPages: totalPages || 1,
    pageSize,
    examId,
    studentId,
    status,
    handleExamChange,
    handleStudentChange,
    handleStatusChange,
    handlePageChange,
    handleResetFilters,
    refetch: fetchData,
  };
};

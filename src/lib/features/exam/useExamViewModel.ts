import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  setFirmId,
  resetFilters,
  setSearchTerm,
  toggleActiveOnly,
  setPage,
} from "./examSlice";

import { fetchExams } from "./examThunks";
import { useEffect, useCallback } from "react";
import type { RootState } from "@/lib/store";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";

import { fetchCourses } from "@/lib/features/course/courseThunks";
import { fetchModules } from "@/lib/features/module/moduleThunks";

export const useExamViewModel = () => {

  const dispatch: ThunkDispatch<RootState, unknown, AnyAction> =
    useAppDispatch();

  /* ------------------------------
     Auth user (FirmId source)
  ------------------------------ */
  const authUser = useAppSelector(
    (state: RootState) => state.auth.user
  );

  /* ------------------------------
     Exam state
  ------------------------------ */
  const {
    exams,
    loading,
    error,

    page,
    totalPages,
    pageSize,

    searchTerm,
    isActive,
    firmId,
  } = useAppSelector((state: RootState) => state.exam);

  const safeExams = exams || [];

  /* ------------------------------
     Courses + Modules state
  ------------------------------ */
  const courses =
    useAppSelector(
      (state: RootState) => state.courses.courses
    ) || [];

  const modules =
    useAppSelector(
      (state: RootState) => state.modules.modules
    ) || [];

  /* ------------------------------
     Load course + module dropdowns
  ------------------------------ */
  useEffect(() => {
    dispatch(fetchCourses({ page: 1 }));
    dispatch(fetchModules());
  }, [dispatch]);

  /* ------------------------------
     Auto-set FirmId
  ------------------------------ */
  useEffect(() => {
    if (authUser?.firmId && firmId !== Number(authUser.firmId)) {
      dispatch(setFirmId(Number(authUser.firmId)));
    }
  }, [authUser?.firmId, firmId, dispatch]);

  /* ------------------------------
     Fetch exams
  ------------------------------ */
  const fetchExamData = useCallback(() => {
    dispatch(
      fetchExams({
        page,
        pageSize,
        searchTerm,
        isActive,
        firmId,
      })
    );
  }, [dispatch, page, pageSize, searchTerm, isActive, firmId]);

  /* ------------------------------
     Debounced auto fetch
  ------------------------------ */
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchExamData();
    }, searchTerm ? 300 : 0);

    return () => clearTimeout(timer);
  }, [fetchExamData, searchTerm]);

  /* ------------------------------
     UI handlers
  ------------------------------ */
  const handleSearch = useCallback(
    (term: string) => {
      dispatch(setSearchTerm(term));
    },
    [dispatch]
  );

  const handleToggleActive = useCallback(() => {
    dispatch(toggleActiveOnly());
  }, [dispatch]);

  const handleResetFilters = useCallback(() => {
    dispatch(resetFilters());
  }, [dispatch]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage >= 1 && newPage <= totalPages) {
        dispatch(setPage(newPage));
      }
    },
    [dispatch, totalPages]
  );

  /* ------------------------------
     Return to UI
  ------------------------------ */
  return {
    exams: safeExams,
    courses,
    modules,

    isLoading: loading,
    error,

    page,
    totalPages: totalPages || 1,

    searchTerm,
    isActive,
    firmId,

    handleSearch,
    handleToggleActive,
    handleResetFilters,
    handlePageChange,

    refetch: fetchExamData,
  };
};
